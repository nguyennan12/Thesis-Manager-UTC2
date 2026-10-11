// ==============================================================================
// EVALUATION SERVICE (SRP: Rubric Criterion Scoring & Final Grade Aggregation)
// ==============================================================================

import { Injectable } from '@nestjs/common';
import { CouncilsRepository } from '../repositories/councils.repository';
import { PrismaService } from '../../../database/prisma.service';
import { TransactionManager } from '../../../database/transaction-manager';
import { AuditLogsService } from '../../audit-logs/services/audit-logs.service';
import { AuthenticatedUser } from '../../../common/interfaces/jwt-payload.interface';
import { SubmitDetailedScoreDto } from '../dto/evaluation.dto';
import { GradeCalculatorHelper } from '../helpers/grade-calculator.helper';
import { Result, AppError } from '../../../common/utils';
import { Prisma, Registration, RegistrationStatus } from '@prisma/client';
import { ROLES } from '../../../common/constants/roles.constant';

@Injectable()
export class EvaluationService {
  constructor(
    private readonly councilsRepo: CouncilsRepository,
    private readonly prisma: PrismaService,
    private readonly txManager: TransactionManager,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  async submitDetailedScores(
    dto: SubmitDetailedScoreDto,
    user: AuthenticatedUser,
  ): Promise<Result<{ success: boolean; count: number }>> {
    const reg = await this.prisma.registration.findUnique({
      where: { id: dto.registrationId },
      include: { council: { include: { members: true } } },
    });

    if (!reg) {
      return Result.err(AppError.notFound(`Không tìm thấy hồ sơ đồ án với ID '${dto.registrationId}'.`));
    }

    if (!reg.councilId || !reg.council) {
      return Result.err(AppError.badRequest('Sinh viên này chưa được phân công vào bất kỳ hội đồng bảo vệ nào.'));
    }

    // Kiểm tra người chấm phải là thành viên trong Hội đồng
    const lecturerId = user.lecturerId;
    const isMember = lecturerId && reg.council.members.some((m) => m.lecturerId === lecturerId);
    const isAdmin = user.roles?.includes(ROLES.ADMIN);

    if (!isMember && !isAdmin) {
      return Result.err(
        AppError.forbidden('Chỉ các giảng viên là thành viên của hội đồng này mới có quyền nhập điểm tiêu chí.'),
      );
    }

    const scorerId = lecturerId || reg.council.members[0].lecturerId;

    await this.txManager.run(async (tx) => {
      for (const item of dto.scores) {
        await this.councilsRepo.upsertDetailedScore(
          dto.registrationId,
          item.criterionId,
          scorerId,
          item.score,
          item.notes,
          tx,
        );
      }
    });

    this.auditLogsService.record({
      action: 'COUNCIL_DETAILED_SCORES_SUBMITTED',
      endpoint: '/api/v1/evaluation/scores',
      httpMethod: 'POST',
      accountId: user.sub,
      payload: { registrationId: dto.registrationId, criterionCount: dto.scores.length },
    });

    return Result.ok({ success: true, count: dto.scores.length });
  }

  async calculateFinalGrade(
    registrationId: string,
    user: AuthenticatedUser,
  ): Promise<Result<Registration>> {
    const reg = await this.prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        detailedScores: true,
        student: true,
        council: { include: { members: true } },
      },
    });

    if (!reg) {
      return Result.err(AppError.notFound(`Không tìm thấy hồ sơ đồ án với ID '${registrationId}'.`));
    }

    if (reg.scoreProcess === null || reg.scoreProcess === undefined) {
      return Result.err(AppError.badRequest('Chưa có điểm đánh giá quá trình từ Giảng viên hướng dẫn.'));
    }

    if (reg.scoreReviewer === null || reg.scoreReviewer === undefined) {
      return Result.err(AppError.badRequest('Chưa có điểm đánh giá từ Giảng viên phản biện.'));
    }

    if (!reg.detailedScores || reg.detailedScores.length === 0) {
      return Result.err(AppError.badRequest('Hội đồng bảo vệ chưa nhập điểm tiêu chí nào cho sinh viên này.'));
    }

    // Tính điểm trung bình của Hội đồng (lấy trung bình cộng tất cả các điểm tiêu chí)
    let totalScore = 0;
    for (const s of reg.detailedScores) {
      totalScore += Number(s.score);
    }
    const scoreCouncilAvg = Math.round((totalScore / reg.detailedScores.length) * 100) / 100;

    // BR-C5: Tính điểm tổng kết theo công thức: 30% GVHD + 20% GVPB + 50% Hội đồng
    const scoreProcessNum = Number(reg.scoreProcess);
    const scoreReviewerNum = Number(reg.scoreReviewer);
    const scoreFinal = GradeCalculatorHelper.calculateFinalScore(
      scoreProcessNum,
      scoreReviewerNum,
      scoreCouncilAvg,
    );

    // BR-C6: Quy đổi sang thang 4 và thang điểm chữ UTC2
    const gradeResult = GradeCalculatorHelper.convertToScale4AndLetter(scoreFinal);

    const updated = await this.prisma.registration.update({
      where: { id: registrationId },
      data: {
        scoreCouncilAvg: new Prisma.Decimal(scoreCouncilAvg.toString()),
        scoreFinal: new Prisma.Decimal(scoreFinal.toString()),
        gradeScale4: new Prisma.Decimal(gradeResult.scale4.toString()),
        gradeLetter: gradeResult.letter,
        status: gradeResult.isPassed ? RegistrationStatus.COMPLETED : RegistrationStatus.FAILED,
      },
    });

    this.auditLogsService.record({
      action: 'FINAL_GRADE_CALCULATED',
      endpoint: `/api/v1/evaluation/${registrationId}/calculate-final`,
      httpMethod: 'POST',
      accountId: user.sub,
      payload: {
        registrationId,
        scoreFinal,
        gradeLetter: gradeResult.letter,
        status: updated.status,
      },
    });

    return Result.ok(updated);
  }
}

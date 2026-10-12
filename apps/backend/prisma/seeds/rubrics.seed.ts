// ==============================================================================
// RUBRICS & EVALUATION CRITERIA SEED
// Hệ thống Web Quản lý Đồ án Tốt nghiệp UTC2 (UTC2-DAMS)
// ==============================================================================

import { PrismaClient, TopicType } from '@prisma/client';

export async function seedRubrics(prisma: PrismaClient) {
  console.log('   -> Seeding Standard UTC2 Defense Evaluation Rubrics (Active)...');

  // 1. Tạo hoặc cập nhật bộ tiêu chí đánh giá KLTN Chuyên ngành (MAJOR) 2025-2026
  const rubricSet = await prisma.rubricSet.upsert({
    where: { code: 'RUBRIC_MAJOR_2025_2026' },
    update: {
      name: 'Bộ tiêu chí đánh giá Khóa luận Tốt nghiệp Đại học chính quy UTC2 (Hệ 100%)',
      topicType: TopicType.MAJOR,
      academicYear: '2025-2026',
      totalWeight: 100.0,
      isActive: true,
      version: 1,
    },
    create: {
      code: 'RUBRIC_MAJOR_2025_2026',
      name: 'Bộ tiêu chí đánh giá Khóa luận Tốt nghiệp Đại học chính quy UTC2 (Hệ 100%)',
      topicType: TopicType.MAJOR,
      academicYear: '2025-2026',
      totalWeight: 100.0,
      isActive: true,
      version: 1,
    },
  });

  // 2. Danh sách 4 tiêu chí chuẩn hóa của UTC2
  const criteriaData = [
    {
      code: 'TC01',
      name: '1. Khảo sát tài liệu & Cơ sở lý thuyết',
      description: 'Khảo sát tài liệu đầy đủ, trích dẫn học thuật chuẩn IEEE/APA, làm chủ cơ sở lý thuyết đồ án.',
      weight: 15.0,
      topicType: TopicType.MAJOR,
      orderIndex: 1,
    },
    {
      code: 'TC02',
      name: '2. Thiết kế kiến trúc & Phương pháp giải quyết',
      description: 'Kiến trúc hệ thống phân tầng rõ ràng, CSDL chuẩn hóa, giải thuật tối ưu và đúng quy chuẩn.',
      weight: 25.0,
      topicType: TopicType.MAJOR,
      orderIndex: 2,
    },
    {
      code: 'TC03',
      name: '3. Kết quả thực nghiệm & Ứng dụng thực tế',
      description: 'Sản phẩm phần mềm chạy thực nghiệm hoàn chỉnh, xử lý trọn vẹn ca kiểm thử và có tính ứng dụng cao.',
      weight: 35.0,
      topicType: TopicType.MAJOR,
      orderIndex: 3,
    },
    {
      code: 'TC04',
      name: '4. Báo cáo thuyết minh & Thuyết trình bảo vệ',
      description: 'Thuyết minh chuẩn mẫu ĐATN UTC2, slide mạch lạc, trả lời lưu loát các câu hỏi của Hội đồng.',
      weight: 25.0,
      topicType: TopicType.MAJOR,
      orderIndex: 4,
    },
  ];

  for (const crit of criteriaData) {
    await prisma.evaluationCriterion.upsert({
      where: {
        rubricSetId_code: {
          rubricSetId: rubricSet.id,
          code: crit.code,
        },
      },
      update: {
        name: crit.name,
        description: crit.description,
        weight: crit.weight,
        topicType: crit.topicType,
        orderIndex: crit.orderIndex,
      },
      create: {
        rubricSetId: rubricSet.id,
        code: crit.code,
        name: crit.name,
        description: crit.description,
        weight: crit.weight,
        topicType: crit.topicType,
        orderIndex: crit.orderIndex,
      },
    });
  }

  console.log(`   [OK] Rubric Set '${rubricSet.code}' seeded with 4 criteria (Total Weight: 100.00%)`);
  return { rubricSet };
}

// ==============================================================================
// GRADE CALCULATOR HELPER (BR-C5 & BR-C6: Standard UTC2 Final Grade Computation)
// ==============================================================================

export interface GradeConversionResult {
  scale4: number;
  letter: string;
  isPassed: boolean;
}

export class GradeCalculatorHelper {
  /**
   * BR-C5: Tính điểm tổng kết theo công thức chuẩn:
   * Điểm tổng kết = (GVHD * 30%) + (GVPB * 20%) + (Hội đồng * 50%)
   */
  static calculateFinalScore(
    scoreProcess: number,
    scoreReviewer: number,
    scoreCouncilAvg: number,
  ): number {
    const finalScore = scoreProcess * 0.3 + scoreReviewer * 0.2 + scoreCouncilAvg * 0.5;
    return Math.round(finalScore * 100) / 100;
  }

  /**
   * BR-C6: Quy đổi điểm hệ 10 sang thang điểm 4 và điểm chữ theo Quy chế UTC2
   */
  static convertToScale4AndLetter(score10: number): GradeConversionResult {
    const rounded = Math.round(score10 * 100) / 100;

    if (rounded >= 8.5) {
      return { scale4: 4.0, letter: 'A', isPassed: true };
    }
    if (rounded >= 8.0) {
      return { scale4: 3.5, letter: 'B+', isPassed: true };
    }
    if (rounded >= 7.0) {
      return { scale4: 3.0, letter: 'B', isPassed: true };
    }
    if (rounded >= 6.5) {
      return { scale4: 2.5, letter: 'C+', isPassed: true };
    }
    if (rounded >= 5.5) {
      return { scale4: 2.0, letter: 'C', isPassed: true };
    }
    if (rounded >= 5.0) {
      return { scale4: 1.5, letter: 'D+', isPassed: true };
    }
    if (rounded >= 4.0) {
      return { scale4: 1.0, letter: 'D', isPassed: true };
    }

    return { scale4: 0.0, letter: 'F', isPassed: false };
  }
}

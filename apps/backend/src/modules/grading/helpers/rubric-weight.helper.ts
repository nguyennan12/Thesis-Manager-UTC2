// ==============================================================================
// RUBRIC WEIGHT HELPER (BR-08: Exact Decimal Calculation for 100.00% Total Weight)
// ==============================================================================

import { Prisma } from '@prisma/client';

export interface CriterionWeightItem {
  weight: number | string | Prisma.Decimal;
  code?: string;
  name?: string;
}

export class RubricWeightHelper {
  private static readonly TARGET_WEIGHT = new Prisma.Decimal(100.0);
  private static readonly ZERO = new Prisma.Decimal(0.0);

  /**
   * Tính tổng trọng số chính xác của danh sách tiêu chí
   */
  static calculateTotal(items: CriterionWeightItem[]): Prisma.Decimal {
    let total = new Prisma.Decimal(0);
    for (const item of items) {
      const weightDecimal = new Prisma.Decimal(item.weight.toString());
      total = total.plus(weightDecimal);
    }
    return total;
  }

  /**
   * Kiểm tra tổng trọng số có đúng 100.00% không
   */
  static isTargetTotal(total: Prisma.Decimal): boolean {
    return total.equals(this.TARGET_WEIGHT);
  }

  /**
   * Kiểm tra tính hợp lệ của từng tiêu chí và tổng số
   * Trả về mảng lỗi tiếng Việt nếu có
   */
  static validate(items: CriterionWeightItem[], requireFull100: boolean = false): string[] {
    const errors: string[] = [];

    if (!items || items.length === 0) {
      errors.push('Bộ tiêu chí phải có ít nhất 1 tiêu chí đánh giá.');
      return errors;
    }

    let total = new Prisma.Decimal(0);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      let weightDecimal: Prisma.Decimal;

      try {
        weightDecimal = new Prisma.Decimal(item.weight.toString());
      } catch {
        errors.push(`Trọng số của tiêu chí thứ ${i + 1} không phải là số hợp lệ.`);
        continue;
      }

      if (weightDecimal.lessThanOrEqualTo(this.ZERO)) {
        errors.push(`Trọng số của tiêu chí "${item.name || item.code || i + 1}" phải lớn hơn 0%.`);
      }

      if (weightDecimal.greaterThan(this.TARGET_WEIGHT)) {
        errors.push(`Trọng số của tiêu chí "${item.name || item.code || i + 1}" không được vượt quá 100%.`);
      }

      total = total.plus(weightDecimal);
    }

    if (total.greaterThan(this.TARGET_WEIGHT)) {
      errors.push(`Tổng trọng số các tiêu chí (${total.toFixed(2)}%) không được vượt quá 100.00%.`);
    }

    if (requireFull100 && !total.equals(this.TARGET_WEIGHT)) {
      errors.push(`Tổng trọng số các tiêu chí (${total.toFixed(2)}%) phải đạt chính xác 100.00% để kích hoạt.`);
    }

    return errors;
  }
}

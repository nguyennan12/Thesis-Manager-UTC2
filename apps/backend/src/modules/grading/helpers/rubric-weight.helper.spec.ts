import { describe, it, expect } from 'vitest';
import { RubricWeightHelper } from './rubric-weight.helper';
import { Prisma } from '@prisma/client';

describe('RubricWeightHelper (BR-08)', () => {
  it('should accurately calculate total decimal weight equaling 100.00%', () => {
    const items = [
      { weight: 30.0, name: 'Báo cáo thuyết minh' },
      { weight: 40.5, name: 'Sản phẩm demo' },
      { weight: 29.5, name: 'Kỹ năng thuyết trình' },
    ];

    const total = RubricWeightHelper.calculateTotal(items);
    expect(total.equals(new Prisma.Decimal(100.0))).toBe(true);
    expect(RubricWeightHelper.isTargetTotal(total)).toBe(true);
    expect(RubricWeightHelper.validate(items, true)).toHaveLength(0);
  });

  it('should detect when total weight exceeds 100%', () => {
    const items = [
      { weight: 60.0, name: 'Tiêu chí 1' },
      { weight: 50.0, name: 'Tiêu chí 2' },
    ];

    const errors = RubricWeightHelper.validate(items, false);
    expect(errors.some((e) => e.includes('không được vượt quá 100.00%'))).toBe(true);
  });

  it('should detect negative or zero weights', () => {
    const items = [
      { weight: 0, name: 'Tiêu chí 0' },
      { weight: -10, name: 'Tiêu chí âm' },
    ];

    const errors = RubricWeightHelper.validate(items, false);
    expect(errors.some((e) => e.includes('phải lớn hơn 0%'))).toBe(true);
  });

  it('should reject activation when total weight is less than 100%', () => {
    const items = [
      { weight: 50.0, name: 'Tiêu chí 1' },
      { weight: 40.0, name: 'Tiêu chí 2' },
    ];

    const errors = RubricWeightHelper.validate(items, true);
    expect(errors.some((e) => e.includes('phải đạt chính xác 100.00%'))).toBe(true);
  });
});

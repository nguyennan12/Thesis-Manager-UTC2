import { describe, it, expect } from 'vitest';
import { QuotaResolverHelper } from './quota-resolver.helper';

describe('QuotaResolverHelper', () => {
  it('should return specific semester quota when defined and positive', () => {
    expect(QuotaResolverHelper.resolve(7, 5)).toBe(7);
    expect(QuotaResolverHelper.resolve(3, 5)).toBe(3);
    expect(QuotaResolverHelper.resolve(10, 5)).toBe(10);
  });

  it('should fallback to default quota (5) when semester quota is null or undefined', () => {
    expect(QuotaResolverHelper.resolve(null, 5)).toBe(5);
    expect(QuotaResolverHelper.resolve(undefined, 5)).toBe(5);
  });

  it('should fallback to default quota when semester quota is 0 or negative', () => {
    expect(QuotaResolverHelper.resolve(0, 5)).toBe(5);
    expect(QuotaResolverHelper.resolve(-2, 5)).toBe(5);
  });

  it('should enforce minimum effective quota of 1 even if default is set to 0 or negative', () => {
    expect(QuotaResolverHelper.resolve(undefined, 0)).toBe(1);
    expect(QuotaResolverHelper.resolve(undefined, -5)).toBe(1);
  });
});

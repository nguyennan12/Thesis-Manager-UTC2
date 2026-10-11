import { describe, it, expect } from 'vitest';
import { GradeCalculatorHelper } from './grade-calculator.helper';

describe('GradeCalculatorHelper (BR-C5 & BR-C6)', () => {
  describe('calculateFinalScore (30% - 20% - 50%)', () => {
    it('should accurately calculate weighted score', () => {
      // 8.0 * 0.3 = 2.4; 7.5 * 0.2 = 1.5; 9.0 * 0.5 = 4.5 => Total = 8.4
      const finalScore = GradeCalculatorHelper.calculateFinalScore(8.0, 7.5, 9.0);
      expect(finalScore).toBe(8.4);
    });

    it('should handle perfect score of 10.0', () => {
      const finalScore = GradeCalculatorHelper.calculateFinalScore(10.0, 10.0, 10.0);
      expect(finalScore).toBe(10.0);
    });

    it('should handle failing score', () => {
      const finalScore = GradeCalculatorHelper.calculateFinalScore(3.0, 3.5, 3.0);
      expect(finalScore).toBe(3.1);
    });
  });

  describe('convertToScale4AndLetter', () => {
    it('should map score >= 8.5 to A (4.0)', () => {
      const res = GradeCalculatorHelper.convertToScale4AndLetter(8.8);
      expect(res.scale4).toBe(4.0);
      expect(res.letter).toBe('A');
      expect(res.isPassed).toBe(true);
    });

    it('should map 8.0 <= score < 8.5 to B+ (3.5)', () => {
      const res = GradeCalculatorHelper.convertToScale4AndLetter(8.2);
      expect(res.scale4).toBe(3.5);
      expect(res.letter).toBe('B+');
      expect(res.isPassed).toBe(true);
    });

    it('should map 7.0 <= score < 8.0 to B (3.0)', () => {
      const res = GradeCalculatorHelper.convertToScale4AndLetter(7.5);
      expect(res.scale4).toBe(3.0);
      expect(res.letter).toBe('B');
      expect(res.isPassed).toBe(true);
    });

    it('should map 4.0 <= score < 5.0 to D (1.0)', () => {
      const res = GradeCalculatorHelper.convertToScale4AndLetter(4.2);
      expect(res.scale4).toBe(1.0);
      expect(res.letter).toBe('D');
      expect(res.isPassed).toBe(true);
    });

    it('should map score < 4.0 to F (0.0) and fail', () => {
      const res = GradeCalculatorHelper.convertToScale4AndLetter(3.9);
      expect(res.scale4).toBe(0.0);
      expect(res.letter).toBe('F');
      expect(res.isPassed).toBe(false);
    });
  });
});

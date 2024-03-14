import { describe, it, expect } from 'vitest';
import { compareAsc } from 'date-fns';
import { diffInYears, luhn, testDate } from './utils';

describe('diffInYears', () => {
  it('should return 0 if both dates are the same', () => {
    const date = new Date();
    expect(diffInYears(date, date)).toBe(0);
  });

  it('should return 1 if the second date is exactly one year ahead of the first date', () => {
    const dateLeft = new Date(2021, 1, 1);
    const dateRight = new Date(2020, 1, 1);
    expect(diffInYears(dateLeft, dateRight)).toBe(1);
  });

  it('should return -1 if the second date is exactly one year behind the first date', () => {
    const dateLeft = new Date(2020, 1, 1);
    const dateRight = new Date(2021, 1, 1);
    expect(diffInYears(dateLeft, dateRight)).toBe(-1);
  });

  it('should return the correct difference for dates with different years', () => {
    const dateLeft = new Date(2023, 1, 1);
    const dateRight = new Date(2020, 1, 1);
    expect(diffInYears(dateLeft, dateRight)).toBe(3);
  });

  it('should return the correct difference for dates with the same year but different months', () => {
    const dateLeft = new Date(2020, 0, 1);
    const dateRight = new Date(2020, 11, 31);
    expect(diffInYears(dateLeft, dateRight)).toBe(0);
  });

  it('should return the correct difference for dates with the same year and month but different days', () => {
    const dateLeft = new Date(2020, 0, 1);
    const dateRight = new Date(2020, 0, 31);
    expect(diffInYears(dateLeft, dateRight)).toBe(0);
  });
});

describe('luhn', () => {
  it('should return 0 for an empty string', () => {
    expect(luhn('')).toBe(0);
  });

  it('should return 0 for a non-numeric string', () => {
    expect(luhn('abcd')).toBe(0);
  });

  it('should return 0 for a string with non-numeric characters', () => {
    expect(luhn('1234abcd')).toBe(0);
  });

  it('should return the correct check digit for a valid number', () => {
    expect(luhn('1212121212')).toBe(0);
  });

  it('should return the correct check digit for a long valid number', () => {
    expect(luhn('1234567812345670')).toBe(0);
  });
})

describe('testDate', () => {
  it('should return true for a valid date', () => {
    expect(testDate(2024, 2, 14)).toBe(true);
  });

  it('should return false for an invalid date with a non-existent month', () => {
    expect(testDate(2024, 13, 14)).toBe(false);
  });

  it('should return false for an invalid date with a non-existent day in February', () => {
    expect(testDate(2024, 2, 30)).toBe(false);
  });

  it('should return false for an invalid date with a non-existent day in April', () => {
    expect(testDate(2024, 4, 31)).toBe(false);
  });

  it('should return false for an invalid date with a non-existent day in June', () => {
    expect(testDate(2024, 6, 31)).toBe(false);
  });

  it('should return false for an invalid date with a non-existent day in September', () => {
    expect(testDate(2024, 9, 31)).toBe(false);
  });

  it('should return false for an invalid date with a non-existent day in November', () => {
    expect(testDate(2024, 11, 31)).toBe(false);
  });

  it('should return true for a valid date in a leap year February', () => {
    expect(testDate(2024, 1, 28)).toBe(true);
  });

  it('should return true for a valid date in a non-leap year February', () => {
    expect(testDate(2023, 1, 28)).toBe(true);
  });

  it('should return true for a valid date in a leap year February', () => {
    expect(testDate(2024, 2, 29)).toBe(true);
  });
})

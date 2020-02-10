import { advanceTo, clear } from 'jest-date-mock';
import personnummer from './src';

const invalidNumbers = [
  null,
  [],
  true,
  false,
  0,
  '19112233-4455',
  '20112233-4455',
  '9999999999',
  '199999999999',
  '199909193776',
  'Just a string'
];

describe('validation', () => {
  test('should validate personnummer with control digit', () => {
    const numbers = [
      8507099805,
      '198507099805',
      '198507099813',
      '850709-9813',
      '196411139808'
    ];

    numbers.forEach(n => {
      expect(personnummer.valid(n)).toBe(true);
    });
  });

  test('should not validate personnummer without control digit', () => {
    const numbers = [
      '19850709980',
      '19850709981',
      '19641113980'
    ];

    numbers.forEach(n => {
      expect(personnummer.valid(n)).toBe(false);
    });
  });

  test('should not validate wrong personnummer or wrong types', () => {
    invalidNumbers.forEach(n => {
      expect(personnummer.valid(n)).toBe(false);
    });
  });

  test('should validate co-ordination numbers', () => {
    expect(personnummer.valid('198507699802')).toBe(true);
    expect(personnummer.valid('850769-9802')).toBe(true);
    expect(personnummer.valid('198507699810')).toBe(true);
    expect(personnummer.valid('850769-9810')).toBe(true);
  });

  test('should validate numbers to be co-ordination numbers', () => {
    expect(personnummer.parse('198507699802').isCoordinationNumber()).toBe(true);
    expect(personnummer.parse('850769-9802').isCoordinationNumber()).toBe(true);
    expect(personnummer.parse('198507699810').isCoordinationNumber()).toBe(true);
    expect(personnummer.parse('850769-9810').isCoordinationNumber()).toBe(true);
  });

  test('should not validate wrong co-ordination numbers', () => {
    expect(personnummer.valid('198567099805')).toBe(false);
  });
});

describe('parse', () => {
  test('should parse personnummer', () => {
    expect(personnummer.parse('198507699802')).toEqual({
      age: '34',
      century: '19',
      fullYear: '1985',
      year: '85',
      month: '07',
      day: '69',
      sep: '-',
      num: '980',
      check: '2'
    });
  });
});

describe('format', () => {
  test('should format input values as personnummer', () => {
    expect(personnummer.parse('19850709-9805').format()).toBe('850709-9805');
    expect(personnummer.parse('198507099813').format()).toBe('850709-9813');
    expect(personnummer.parse('19850709-9805').format(true)).toBe('198507099805');
    expect(personnummer.parse('198507099813').format(true)).toBe('198507099813');
  });

  test('should format input values and replace separator with the right one', () => {
    expect(personnummer.parse('19850709+9805').format()).toBe('850709-9805');
    expect(personnummer.parse('19121212-1212').format()).toBe('121212+1212');
  });
});

describe('age', () => {
  test('should get age', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.parse('198507099805').age).toBe('34');
    expect(personnummer.parse('198507099813').age).toBe('34');
    expect(personnummer.parse('196411139808').age).toBe('54');
    expect(personnummer.parse('19121212+1212').age).toBe('106');
    clear();
  });

  test('should get age with co-ordination numbers', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.parse('198507699810').age).toBe('34');
    expect(personnummer.parse('198507699802').age).toBe('34');
    clear();
  });
});

describe('sex', () => {
  test('should test sex with co-ordination numbers', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.parse('198507099813').isMale()).toBe(true);
    expect(personnummer.parse('198507099813').isFemale()).toBe(false);
    expect(personnummer.parse('198507699802').isFemale()).toBe(true);
    expect(personnummer.parse('198507699802').isMale()).toBe(false);
    clear();
  });
});

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
  'Just a string',
];

describe('validation', () => {
  test('should validate personnummer with control digit', () => {
    const numbers = [
      8507099805,
      '198507099805',
      '198507099813',
      '850709-9813',
      '196411139808',
    ];

    numbers.forEach(n => {
      expect(personnummer.valid(n)).toBe(true);
    })
  });

  test('should not validate personnummer without control digit', () => {
    const numbers = [
      '19850709980',
      '19850709981',
      '19641113980',
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

  test('should not validate wrong co-ordination numbers', () => {
    expect(personnummer.valid('198567099805')).toBe(false);
  });
});

describe('format', () => {
  test('should format input values as personnummer', () => {
    expect(personnummer.format('19850709-9805')).toBe('850709-9805');
    expect(personnummer.format('198507099813')).toBe('850709-9813');

    const opts = {
      longFormat: true,
    };

    expect(personnummer.format('19850709-9805', opts)).toBe('198507099805');
    expect(personnummer.format('198507099813', opts)).toBe('198507099813');
  });

  test('should format input values and replace separator with the right one', () => {
    expect(personnummer.format('19850709+9805')).toBe('850709-9805');
    expect(personnummer.format('19121212-1212')).toBe('121212+1212');
  });
});

describe('age', () => {
  test('should get age', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.getAge('198507099805')).toBe(34);
    expect(personnummer.getAge('198507099813')).toBe(34);
    expect(personnummer.getAge('196411139808')).toBe(54);
    expect(personnummer.getAge('19121212+1212')).toBe(106);
    clear();
  });

  test('should get age with co-ordination numbers', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.getAge('198507699810')).toBe(34);
    expect(personnummer.getAge('198507699802')).toBe(34);
    clear();
  });

  test('should get age and exclude co-ordination numbers', () => {
    const numbers = ['198507699810', '198507699802'];
    const opts = {
      coordinationNumber: false,
    };

    numbers.forEach(n => {
      expect(() => {
        personnummer.getAge(n, opts);
      }).toThrow();
    });
  });
});

describe('sex', () => {
  test('should test sex with co-ordination numbers', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.isMale('198507099813')).toBe(true);
    expect(personnummer.isFemale('198507099813')).toBe(false);
    expect(personnummer.isFemale('198507699802')).toBe(true);
    expect(personnummer.isMale('198507699802')).toBe(false);
    clear();
  });

  test('should test sex with invalid numbers', () => {
    invalidNumbers.forEach(n => {
      expect(() => {
        personnummer.isMale(n);
      }).toThrow();

      expect(() => {
        personnummer.isFemale(n);
      }).toThrow();
    });
  });
});

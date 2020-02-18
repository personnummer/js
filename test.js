import { advanceTo, clear } from 'jest-date-mock';
import Personnummer from './src';

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
      '8507099805',
      '198507099805',
      '198507099813',
      '850709-9813',
      '196411139808'
    ];

    numbers.forEach(n => {
      expect(Personnummer.valid(n)).toBe(true);
    });
  });

  test('should not validate personnummer without control digit', () => {
    const numbers = [
      '19850709980',
      '19850709981',
      '19641113980'
    ];

    numbers.forEach(n => {
      expect(Personnummer.valid(n)).toBe(false);
    });
  });

  test('should not validate wrong personnummer or wrong types', () => {
    invalidNumbers.forEach(n => {
      expect(Personnummer.valid(n)).toBe(false);
    });
  });

  test('should validate co-ordination numbers', () => {
    expect(Personnummer.valid('198507699802')).toBe(true);
    expect(Personnummer.valid('850769-9802')).toBe(true);
    expect(Personnummer.valid('198507699810')).toBe(true);
    expect(Personnummer.valid('850769-9810')).toBe(true);
  });

  test('should validate numbers to be co-ordination numbers', () => {
    expect(Personnummer.parse('198507699802').isCoordinationNumber()).toBe(true);
    expect(Personnummer.parse('850769-9802').isCoordinationNumber()).toBe(true);
    expect(Personnummer.parse('198507699810').isCoordinationNumber()).toBe(true);
    expect(Personnummer.parse('850769-9810').isCoordinationNumber()).toBe(true);
  });

  test('should not validate wrong co-ordination numbers', () => {
    expect(Personnummer.valid('198567099805')).toBe(false);
  });
});

describe('parse', () => {
  test('should parse personnummer', () => {
    const p = Personnummer.parse('198507699802');
    expect(p.age).toEqual('34')
    expect(p.century).toEqual('19')
    expect(p.fullYear).toEqual('1985')
    expect(p.year).toEqual('85')
    expect(p.month).toEqual('07')
    expect(p.sep).toEqual('-')
    expect(p.num).toEqual('980')
    expect(p.check).toEqual('2')
  });

  test('should throw errors for bad inputs when parsing', () => {
    invalidNumbers.forEach(n => {
      try {
        Personnummer.parse(n);
        expect(false).toBe(true);
      } catch (e) {
        expect(true).toBe(true);
      }
    });
  })
});

describe('format', () => {
  test('should format input values as personnummer', () => {
    expect(Personnummer.parse('19850709-9805').format()).toBe('850709-9805');
    expect(Personnummer.parse('198507099813').format()).toBe('850709-9813');
    expect(Personnummer.parse('19850709-9805').format(true)).toBe('198507099805');
    expect(Personnummer.parse('198507099813').format(true)).toBe('198507099813');
  });

  test('should format input values and replace separator with the right one', () => {
    expect(Personnummer.parse('19850709+9805').format()).toBe('850709-9805');
    expect(Personnummer.parse('19121212-1212').format()).toBe('121212+1212');
  });
});

describe('age', () => {
  test('should get age', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(Personnummer.parse('198507099805').age).toBe('34');
    expect(Personnummer.parse('198507099813').age).toBe('34');
    expect(Personnummer.parse('196411139808').age).toBe('54');
    expect(Personnummer.parse('19121212+1212').age).toBe('106');
    clear();
  });

  test('should get age with co-ordination numbers', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(Personnummer.parse('198507699810').age).toBe('34');
    expect(Personnummer.parse('198507699802').age).toBe('34');
    clear();
  });
});

describe('sex', () => {
  test('should test sex with co-ordination numbers', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(Personnummer.parse('198507099813').isMale()).toBe(true);
    expect(Personnummer.parse('198507099813').isFemale()).toBe(false);
    expect(Personnummer.parse('198507699802').isFemale()).toBe(true);
    expect(Personnummer.parse('198507699802').isMale()).toBe(false);
    clear();
  });
});

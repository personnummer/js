import { advanceTo, clear } from 'jest-date-mock';
import personnummer from './src';

const invalidNumbers = [
  null,
  [],
  true,
  false,
  100101001,
  '112233-4455',
  '19112233-4455',
  '9999999999',
  '199999999999',
  '9913131315',
  '9911311232',
  '9902291237',
  '19990919_3766',
  '990919_3766',
  '199909193776',
  'Just a string',
  '990919+3776',
  '990919-3776',
  '9909193776',
];

describe('Personnummer tests', () => {
  test('should validate personnummer with control digit', () => {
    const numbers = [
      6403273813,
      '510818-9167',
      '19900101-0017',
      '19130401+2931',
      '196408233234',
      '000101-0107',
      '0001010107',
      '200002296127',
      '200002283422',
      '101010-1010'
    ];

    numbers.forEach(n => {
      expect(personnummer.valid(n)).toBe(true);
    })
  });

  test('should not validate personnummer without control digit', () => {
    const numbers = [
      640327381,
      '510818-916',
      '19900101-001',
      '100101+001',
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
    expect(personnummer.valid('701063-2391')).toBe(true);
    expect(personnummer.valid('640883-3231')).toBe(true);
  });

  test('should not validate wrong co-ordination numbers', () => {
    expect(personnummer.valid('900161-0017')).toBe(false);
    expect(personnummer.valid('640893-3231')).toBe(false);
  });

  test('should format input values as personnummer', () => {
    expect(personnummer.format(6403273813)).toBe('640327-3813');
    expect(personnummer.format('510818-9167')).toBe('510818-9167');
    expect(personnummer.format('19900101-0017')).toBe('900101-0017');
    expect(personnummer.format('19130401+2931')).toBe('130401+2931');
    expect(personnummer.format('196408233234')).toBe('640823-3234');
    expect(personnummer.format('0001010107')).toBe('000101-0107');
    expect(personnummer.format('000101-0107')).toBe('000101-0107');
    expect(personnummer.format('191304012931')).toBe('130401+2931');

    const opts = {
      longFormat: true,
    };

    expect(personnummer.format(6403273813, opts)).toBe('196403273813');
    expect(personnummer.format('510818-9167', opts)).toBe('195108189167');
    expect(personnummer.format('19900101-0017', opts)).toBe('199001010017');
    expect(personnummer.format('19130401+2931', opts)).toBe('191304012931');
    expect(personnummer.format('196408233234', opts)).toBe('196408233234');
    expect(personnummer.format('0001010107', opts)).toBe('200001010107');
    expect(personnummer.format('000101-0107', opts)).toBe('200001010107');
    expect(personnummer.format('000101+0107', opts)).toBe('190001010107');
  });

  test('should format input values and replace separator with the right one', () => {
    expect(personnummer.format('19121212-1212')).toBe('121212+1212');
    expect(personnummer.format('20121212+1212')).toBe('121212-1212');
  });

  test('should not format input value as personnummer', () => {
    invalidNumbers.forEach(n => {
      try {
        personnummer.format(n);
      } catch (e) {}
    });
  });

  test('test get age', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.getAge(6403273813)).toBe(55);
    expect(personnummer.getAge('510818-9167')).toBe(67);
    expect(personnummer.getAge('19900101-0017')).toBe(29);
    expect(personnummer.getAge('19130401+2931')).toBe(106);
    expect(personnummer.getAge('200002296127')).toBe(19);
    clear();
  });

  test('test sex with co-ordination numbers', () => {
    advanceTo(new Date(2019, 7, 13));
    expect(personnummer.isMale('701063-2391')).toBe(true);
    expect(personnummer.isFemale('701063-2391')).toBe(false);
    expect(personnummer.isFemale('640883-3223')).toBe(true);
    expect(personnummer.isMale('640883-3223')).toBe(false);
    clear();
  });

  test('test sex with invalid numbers', () => {
    invalidNumbers.forEach(n => {
      try {
        personnummer.isMale(n);
      } catch (e) {}

      try {
        personnummer.isFemale(n);
      } catch (e) {}
    });
  });
});

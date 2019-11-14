import test from 'ava';
import personnummer from './src/personnummer';

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

test('should validate personnummer with control digit', t => {
  t.is(true, personnummer.valid(8507099805));
  t.is(true, personnummer.valid('198507099805'));
  t.is(true, personnummer.valid('198507099813'));
  t.is(true, personnummer.valid('850709-9813'));
  t.is(true, personnummer.valid('196411139808'));
});

test('should not validate personnummer without control digit', t => {
  t.is(false, personnummer.valid('19850709980'));
  t.is(false, personnummer.valid('19850709981'));
  t.is(false, personnummer.valid('19641113980'));
});

test('should not validate wrong personnummer or wrong types', t => {
  invalidNumbers.forEach(n => {
    t.is(false, personnummer.valid(n));
  });
});

test('should validate co-ordination numbers', t => {
  t.is(true, personnummer.valid('198507699802'));
  t.is(true, personnummer.valid('850769-9802'));
  t.is(true, personnummer.valid('198507699810'));
  t.is(true, personnummer.valid('850769-9810'));
});

test('should not validate wrong co-ordination numbers', t => {
  t.is(false, personnummer.valid('198567099805'));
});

test('should format input values as personnummer', t => {
  t.is('850709-9805', personnummer.format('19850709-9805'));
  t.is('850709-9813', personnummer.format('198507099813'));

  t.is('198507099805', personnummer.format('19850709-9805', true));
  t.is('198507099813', personnummer.format('198507099813', true));
});

test('should format input values and replace separator with the right one', t => {
  t.is('850709-9805', personnummer.format('19850709+9805'));
  t.is('121212+1212', personnummer.format('19121212-1212'));
});

test('should not format invalid input values as personnummer', t => {
  invalidNumbers.forEach(n => {
    t.is('', personnummer.format(n));
  });
});

test('test get age', t => {
  const oldNow = Date.now;
  Date.now = () => new Date(2019, 7, 13);

  t.is(34, personnummer.getAge('198507099805'));
  t.is(34, personnummer.getAge('198507099813'));
  t.is(54, personnummer.getAge('196411139808'));
  t.is(106, personnummer.getAge('19121212+1212'));

  Date.now = oldNow;
});

test('test get age with co-ordination numbers', t => {
  const oldNow = Date.now;
  Date.now = () => new Date(2019, 7, 13);

  t.is(34, personnummer.getAge('198507699810'));
  t.is(34, personnummer.getAge('198507699802'));

  Date.now = oldNow;
});

test('test get age and exclude co-ordination numbers', t => {
  t.is(0, personnummer.getAge('198507699810', false));
  t.is(0, personnummer.getAge('198507699802', false));
});

test('test sex', t => {
  t.is(true, personnummer.isMale(198507099813, false));
  t.is(false, personnummer.isFemale(198507099813, false));
  t.is(true, personnummer.isFemale('198507099805', false));
  t.is(false, personnummer.isMale('198507099805', false));
});

test('test sex with co-ordination numbers', t => {
  t.is(true, personnummer.isMale('198507099813'));
  t.is(false, personnummer.isFemale('198507099813'));
  t.is(true, personnummer.isFemale('198507699802'));
  t.is(false, personnummer.isMale('198507699802'));
});

test('test sex with invalid numbers', t => {
  invalidNumbers.forEach(n => {
    try {
      personnummer.isMale(n);
    } catch (e) {
      t.pass();
    }

    try {
      personnummer.isFemale(n);
    } catch (e) {
      t.pass();
    }
  });
});

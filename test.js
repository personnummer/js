import test from 'ava';
import personnummer from './src/personnummer';

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

test('should validate personnummer with control digit', t => {
  t.is(true, personnummer.valid(6403273813));
  t.is(true, personnummer.valid('510818-9167'));
  t.is(true, personnummer.valid('19900101-0017'));
  t.is(true, personnummer.valid('19130401+2931'));
  t.is(true, personnummer.valid('196408233234'));
  t.is(true, personnummer.valid('000101-0107'));
  t.is(true, personnummer.valid('0001010107'));
  t.is(true, personnummer.valid('200002296127'));
  t.is(true, personnummer.valid('200002296127'));
  t.is(true, personnummer.valid('200002283422'));
  t.is(true, personnummer.valid('101010-1010'));
});

test('should not validate personnummer without control digit', t => {
  t.is(false, personnummer.valid(640327381));
  t.is(false, personnummer.valid('510818-916'));
  t.is(false, personnummer.valid('19900101-001'));
  t.is(false, personnummer.valid('100101+001'));
});

test('should not validate wrong personnummer or wrong types', t => {
  invalidNumbers.forEach(n => {
    t.is(false, personnummer.valid(n));
  });
});

test('should validate co-ordination numbers', t => {
  t.is(true, personnummer.valid('701063-2391'));
  t.is(true, personnummer.valid('640883-3231'));
});

test('should not validate wrong co-ordination numbers', t => {
  t.is(false, personnummer.valid('900161-0017'));
  t.is(false, personnummer.valid('640893-3231'));
});

test('should format input values as personnummer', t => {
  t.is('640327-3813', personnummer.format(6403273813));
  t.is('510818-9167', personnummer.format('510818-9167'));
  t.is('900101-0017', personnummer.format('19900101-0017'));
  t.is('130401+2931', personnummer.format('19130401+2931'));
  t.is('640823-3234', personnummer.format('196408233234'));
  t.is('000101-0107', personnummer.format('0001010107'));
  t.is('000101-0107', personnummer.format('000101-0107'));
  t.is('130401+2931', personnummer.format('191304012931'));
  t.is('196403273813', personnummer.format(6403273813, true));
  t.is('195108189167', personnummer.format('510818-9167', true));
  t.is('199001010017', personnummer.format('19900101-0017', true));
  t.is('191304012931', personnummer.format('19130401+2931', true));
  t.is('196408233234', personnummer.format('196408233234', true));
  t.is('200001010107', personnummer.format('0001010107', true));
  t.is('200001010107', personnummer.format('000101-0107', true));
  t.is('190001010107', personnummer.format('000101+0107', true));
});

test('should format input values and replace separator with the right one', t => {
  t.is('130401+2931', personnummer.format('19130401-2931'));
  t.is('900101-0017', personnummer.format('19900101+0017'));
  t.is('121212+1212', personnummer.format('19121212-1212'));
  t.is('121212-1212', personnummer.format('20121212+1212'));
});

test('should not format input value as personnummer', t => {
  invalidNumbers.forEach(n => {
    t.is('', personnummer.format(n));
  });
});

test('test get age', t => {
  const oldNow = Date.now;
  Date.now = () => new Date(2019, 7, 13);

  t.is(55, personnummer.getAge(6403273813));
  t.is(67, personnummer.getAge('510818-9167'));
  t.is(29, personnummer.getAge('19900101-0017'));
  t.is(106, personnummer.getAge('19130401+2931'));
  t.is(19, personnummer.getAge('200002296127'));

  Date.now = oldNow;
});

test('test get age with co-ordination numbers', t => {
  const oldNow = Date.now;
  Date.now = () => new Date(2019, 7, 13);

  t.is(48, personnummer.getAge('701063-2391'));
  t.is(54, personnummer.getAge('640883-3231'));

  Date.now = oldNow;
});

test('test get age and exclude co-ordination numbers', t => {
  t.is(0, personnummer.getAge('701063-2391', false));
  t.is(0, personnummer.getAge('640883-3231', false));
});

test('test sex', t => {
  t.is(true, personnummer.isMale(6403273813, false));
  t.is(false, personnummer.isFemale(6403273813, false));
  t.is(true, personnummer.isFemale('510818-9167', false));
  t.is(false, personnummer.isMale('510818-9167', false));
});

test('test sex with co-ordination numbers', t => {
  t.is(true, personnummer.isMale('701063-2391'));
  t.is(false, personnummer.isFemale('701063-2391'));
  t.is(true, personnummer.isFemale('640883-3223'));
  t.is(false, personnummer.isMale('640883-3223'));
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

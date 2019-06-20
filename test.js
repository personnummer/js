import test from 'ava';
import personnummer from './src/personnummer';

test('should validate personnummer with control digit', t => {
  t.is(true, personnummer.valid(6403273813));
  t.is(true, personnummer.valid('510818-9167'));
  t.is(true, personnummer.valid('19900101-0017'));
  t.is(true, personnummer.valid('19130401+2931'));
  t.is(true, personnummer.valid('196408233234'));
  t.is(true, personnummer.valid('000101-0107'));
  t.is(true, personnummer.valid('0001010107'));
});

test('should not validate personnummer without control digit', t => {
  t.is(false, personnummer.valid(640327381));
  t.is(false, personnummer.valid('510818-916'));
  t.is(false, personnummer.valid('19900101-001'));
  t.is(false, personnummer.valid('100101+001'));
});

test('should not validate wrong personnummer or wrong types', t => {
  t.is(false, personnummer.valid(undefined));
  t.is(false, personnummer.valid(null));
  t.is(false, personnummer.valid([]));
  t.is(false, personnummer.valid({}));
  t.is(false, personnummer.valid(false));
  t.is(false, personnummer.valid(true));
  t.is(false, personnummer.valid(1122334455));
  t.is(false, personnummer.valid('112233-4455'));
  t.is(false, personnummer.valid('19112233-4455'));
  t.is(false, personnummer.valid('9999999999'));
  t.is(false, personnummer.valid('199999999999'));
  t.is(false, personnummer.valid('9913131315'));
  t.is(false, personnummer.valid('9911311232'));
  t.is(false, personnummer.valid('9902291237'));
  t.is(false, personnummer.valid('19990919_3766'));
  t.is(false, personnummer.valid('990919_3766'));
  t.is(false, personnummer.valid('199909193776'));
  t.is(false, personnummer.valid('Just a string'));
  t.is(false, personnummer.valid('990919+3776'));
  t.is(false, personnummer.valid('990919-3776'));
  t.is(false, personnummer.valid('9909193776'));
});

test('should validate co-ordination numbers', t => {
  t.is(true, personnummer.valid('701063-2391'));
  t.is(true, personnummer.valid('640883-3231'));
});

test('should not validate wrong co-ordination numbers', t => {
  t.is(false, personnummer.valid('900161-0017'));
  t.is(false, personnummer.valid('640893-3231'));
});

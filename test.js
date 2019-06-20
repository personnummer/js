var test           = require('ava');
var isPersonnummer = require('./is-personnummer');

test('should validate personnummer with control digit', function (t) {
  t.is(true, isPersonnummer(6403273813));
  t.is(true, isPersonnummer('510818-9167'));
  t.is(true, isPersonnummer('19900101-0017'));
  t.is(true, isPersonnummer('19130401+2931'));
  t.is(true, isPersonnummer('196408233234'));
  t.is(true, isPersonnummer('000101-0107'));
  t.is(true, isPersonnummer('0001010107'));
});

test('should not validate personnummer without control digit', function (t) {
  t.is(false, isPersonnummer(640327381));
  t.is(false, isPersonnummer('510818-916'));
  t.is(false, isPersonnummer('19900101-001'));
  t.is(false, isPersonnummer('100101+001'));
});

test('should not validate wrong personnummer or wrong types', function (t) {
  t.is(false, isPersonnummer(undefined));
  t.is(false, isPersonnummer(null));
  t.is(false, isPersonnummer([]));
  t.is(false, isPersonnummer({}));
  t.is(false, isPersonnummer(false));
  t.is(false, isPersonnummer(true));
  t.is(false, isPersonnummer(1122334455));
  t.is(false, isPersonnummer('112233-4455'));
  t.is(false, isPersonnummer('19112233-4455'));
  t.is(false, isPersonnummer('9999999999'));
  t.is(false, isPersonnummer('199999999999'));
  t.is(false, isPersonnummer('9913131315'));
  t.is(false, isPersonnummer('9911311232'));
  t.is(false, isPersonnummer('9902291237'));
  t.is(false, isPersonnummer('19990919_3766'));
  t.is(false, isPersonnummer('990919_3766'));
  t.is(false, isPersonnummer('199909193776'));
  t.is(false, isPersonnummer('Just a string'));
  t.is(false, isPersonnummer('990919+3776'));
  t.is(false, isPersonnummer('990919-3776'));
  t.is(false, isPersonnummer('9909193776'));
});

test('should validate co-ordination numbers', function (t) {
  t.is(true, isPersonnummer('701063-2391'));
  t.is(true, isPersonnummer('640883-3231'));
});

test('should not validate wrong co-ordination numbers', function (t) {
  t.is(false, isPersonnummer('900161-0017'));
  t.is(false, isPersonnummer('640893-3231'));
});

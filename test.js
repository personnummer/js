var assert         = require('assert'),
    isPersonnummer = require('./is-personnummer');

it('should validate personnummer with control digit', function () {
  assert.equal(true, isPersonnummer(6403273813));
  assert.equal(true, isPersonnummer('510818-9167'));
  assert.equal(true, isPersonnummer('19900101-0017'));
  assert.equal(true, isPersonnummer('19130401+2931'));
  assert.equal(true, isPersonnummer('196408233234'));
});

it('should not validate personnummer without control digit', function () {
  assert.equal(false, isPersonnummer(640327381));
  assert.equal(false, isPersonnummer('510818-916'));
  assert.equal(false, isPersonnummer('19900101-001'));
  assert.equal(false, isPersonnummer('100101+001'));
});

it('should not validate wrong personnummer or wrong types', function () {
  assert.equal(false, isPersonnummer(undefined));
  assert.equal(false, isPersonnummer(null));
  assert.equal(false, isPersonnummer([]));
  assert.equal(false, isPersonnummer({}));
  assert.equal(false, isPersonnummer(false));
  assert.equal(false, isPersonnummer(true));
  assert.equal(false, isPersonnummer(1122334455));
  assert.equal(false, isPersonnummer('112233-4455'));
  assert.equal(false, isPersonnummer('19112233-4455'));
  assert.equal(false, isPersonnummer('9999999999'));
  assert.equal(false, isPersonnummer('199999999999'));
  assert.equal(false, isPersonnummer('9913131315'));
  assert.equal(false, isPersonnummer('9911311232'));
  assert.equal(false, isPersonnummer('9902291237'));
  assert.equal(false, isPersonnummer('19990919_3766'));
  assert.equal(false, isPersonnummer('990919_3766'));
  assert.equal(false, isPersonnummer('199909193776'));
  assert.equal(false, isPersonnummer('Just a string'));
  assert.equal(false, isPersonnummer('990919+3776'));
  assert.equal(false, isPersonnummer('990919-3776'));
  assert.equal(false, isPersonnummer('9909193776'));
});

it('should validate co-ordination numbers', function () {
  assert.equal(true, isPersonnummer('701063-2391'));
  assert.equal(true, isPersonnummer('640883-3231'));
});

it('should not validate wrong co-ordination numbers', function () {
  assert.equal(false, isPersonnummer('900161-0017'));
  assert.equal(false, isPersonnummer('640893-3231'));
});

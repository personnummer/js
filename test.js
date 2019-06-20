const assert       = require('assert');
const personnummer = require('./src/personnummer');

it('should validate personnummer with control digit', () => {
  assert.equal(true, personnummer.valid(6403273813));
  assert.equal(true, personnummer.valid('510818-9167'));
  assert.equal(true, personnummer.valid('19900101-0017'));
  assert.equal(true, personnummer.valid('19130401+2931'));
  assert.equal(true, personnummer.valid('196408233234'));
  assert.equal(true, personnummer.valid('000101-0107'));
  assert.equal(true, personnummer.valid('0001010107'));
});

it('should not validate personnummer without control digit', () => {
  assert.equal(false, personnummer.valid(640327381));
  assert.equal(false, personnummer.valid('510818-916'));
  assert.equal(false, personnummer.valid('19900101-001'));
  assert.equal(false, personnummer.valid('100101+001'));
});

it('should not validate wrong personnummer or wrong types', () => {
  assert.equal(false, personnummer.valid(undefined));
  assert.equal(false, personnummer.valid(null));
  assert.equal(false, personnummer.valid([]));
  assert.equal(false, personnummer.valid({}));
  assert.equal(false, personnummer.valid(false));
  assert.equal(false, personnummer.valid(true));
  assert.equal(false, personnummer.valid(1122334455));
  assert.equal(false, personnummer.valid('112233-4455'));
  assert.equal(false, personnummer.valid('19112233-4455'));
  assert.equal(false, personnummer.valid('9999999999'));
  assert.equal(false, personnummer.valid('199999999999'));
  assert.equal(false, personnummer.valid('9913131315'));
  assert.equal(false, personnummer.valid('9911311232'));
  assert.equal(false, personnummer.valid('9902291237'));
  assert.equal(false, personnummer.valid('19990919_3766'));
  assert.equal(false, personnummer.valid('990919_3766'));
  assert.equal(false, personnummer.valid('199909193776'));
  assert.equal(false, personnummer.valid('Just a string'));
  assert.equal(false, personnummer.valid('990919+3776'));
  assert.equal(false, personnummer.valid('990919-3776'));
  assert.equal(false, personnummer.valid('9909193776'));
});

it('should validate co-ordination numbers', () => {
  assert.equal(true, personnummer.valid('701063-2391'));
  assert.equal(true, personnummer.valid('640883-3231'));
});

it('should exclude validation for co-ordination numbers', () => {
  assert.equal(false, personnummer.valid('701063-2391', false));
  assert.equal(false, personnummer.valid('640883-3231', false));
});

it('should not validate wrong co-ordination numbers', () => {
  assert.equal(false, personnummer.valid('900161-0017'));
  assert.equal(false, personnummer.valid('640893-3231'));
});

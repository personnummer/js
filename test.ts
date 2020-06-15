import fetch from 'node-fetch';
import Personnummer from './src';
import { diffInYears } from './src/utils';

const availableListFormats = [
  'long_format',
  'short_format',
  'separated_format',
  'separated_long',
];

let _testList = [];
const testList = () => {
  if (_testList.length) {
    return new Promise((resolve) => {
      resolve(_testList.length);
    });
  }

  return fetch(
    'https://raw.githubusercontent.com/personnummer/meta/master/testdata/list.json'
  ).then((p) => p.json());
};

test('should validate personnummer with control digit', async () => {
  const list = await testList();

  list.forEach((item) => {
    availableListFormats.forEach((format) => {
      expect(Personnummer.valid(item[format])).toBe(item.valid);
    });
  });
});

test('should format personnummer', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (!item.valid) {
      return;
    }

    availableListFormats.forEach((format) => {
      if (
        format !== 'short_format' &&
        item.separated_format.indexOf('+') === -1
      ) {
        expect(Personnummer.parse(item[format]).format()).toBe(
          item.separated_format
        );
        expect(Personnummer.parse(item[format]).format(true)).toBe(
          item.long_format
        );
      }
    });
  });
});

test('should throw personnummer error', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (item.valid) {
      return;
    }

    availableListFormats.forEach((format) => {
      try {
        Personnummer.parse(item[format]);
        expect(false).toBe(true);
      } catch (e) {
        expect(true).toBe(true);
      }
    });
  });
});

test('should test personnummer sex', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (!item.valid) {
      return;
    }

    availableListFormats.forEach((format) => {
      expect(Personnummer.parse(item[format]).isMale()).toBe(item.isMale);
      expect(Personnummer.parse(item[format]).isFemale()).toBe(item.isFemale);
    });
  });
});

test('should test personnummer age', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (!item.valid) {
      return;
    }

    availableListFormats.forEach((format) => {
      if (
        format !== 'short_format' &&
        item.separated_format.indexOf('+') === -1
      ) {
        const pin = item.separated_long;
        const year = pin.slice(0, 4);
        const month = pin.slice(4, 6);
        let day = pin.slice(6, 8);
        if (item.type == 'con') {
          day = '' + (parseInt(day) - 60);
        }

        const date = new Date(year, month, day);
        const now = new Date();
        const expected = diffInYears(now, date);

        expect(Personnummer.parse(item[format]).getAge()).toBe(expected);
      }
    });
  });
});

import { it, expect } from 'vitest';
import { request } from 'undici';
import { diffInYears } from './src/utils';

const Personnummer = process.env.FILE?.includes('cjs')
  ? require(process.env.FILE)
  : (await import(process.env.FILE)).default;

const availableListFormats = [
  'long_format',
  'short_format',
  'separated_format',
  'separated_long',
];

const _testList = [];
const testList = (file = 'list'): Promise<any> => {
  if (_testList.length) {
    return new Promise((resolve) => {
      resolve(_testList.length);
    });
  }

  return request(
    `https://raw.githubusercontent.com/personnummer/meta/master/testdata/${file}.json`,
    {}
  ).then((p) => p.body.json());
};

it('should validate personnummer with control digit', async () => {
  const list = await testList();

  list.forEach((item) => {
    availableListFormats.forEach((format) => {
      expect(Personnummer.valid(item[format])).toBe(item.valid);
    });
  });
});

it('should format personnummer', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (!item.valid) {
      return;
    }

    availableListFormats.forEach((format) => {
      if (format !== 'short_format') {
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

it('should parse personnummer', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (!item.valid) {
      return;
    }

    availableListFormats
      .filter((f) => f !== 'short_format')
      .forEach((format) => {
        const parsed = Personnummer.parse(item[format]);
        const pin = item.separated_long;
        const expected = {
          _century: pin.slice(0, 2),
          _fullYear: pin.slice(0, 4),
          _year: pin.slice(2, 4),
          _month: pin.slice(4, 6),
          _day: pin.slice(6, 8),
          _sep: pin.slice(8, 9),
          _num: pin.slice(9, 12),
          _check: pin.slice(12),
        };

        expect(parsed).toEqual(expected);
      });
  });
});

it('should throw personnummer error', async () => {
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

it('should test personnummer sex', async () => {
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

it('should test personnummer age', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (!item.valid) {
      return;
    }

    const pin = item.separated_long;
    const year = pin.slice(0, 4);
    const month = pin.slice(4, 6);
    let day = pin.slice(6, 8);
    if (item.type == 'con') {
      day = '' + (parseInt(day) - 60);
    }

    const ageDate = `${year}-${month}-${day}`;
    const date = new Date(ageDate);
    const now = new Date(Date.now());
    const expected = diffInYears(now, date);

    availableListFormats.forEach((format) => {
      if (format !== 'short_format') {
        expect(Personnummer.parse(item[format]).getAge()).toBe(expected);
      }
    });
  });
});

it('should test personnummer date', async () => {
  const list = await testList();

  list.forEach((item) => {
    if (!item.valid) {
      return;
    }

    const pin = item.separated_long;
    const year = pin.slice(0, 4);
    const month = pin.slice(4, 6);
    let day = pin.slice(6, 8);
    if (item.type == 'con') {
      day = '' + (parseInt(day) - 60);
    }

    const ageDate = `${year}-${month}-${day}`;
    const personnummerDate = new Date(ageDate);

    availableListFormats.forEach((format) => {
      if (format !== 'short_format') {
        expect(Personnummer.parse(item[format]).getDate()).toStrictEqual(
          personnummerDate
        );
      }
    });
  });
});

it('should test organization numbers and throw error', async () => {
  const list = await testList('orgnumber');

  list.forEach((item) => {
    availableListFormats.forEach((format) => {
      expect(() => {
        Personnummer.parse(item[format]);
      }).toThrow(Error);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { diffInYears } from './utils';

type TestList = {
  integer: number;
  long_format: string;
  short_format: string;
  separated_format: string;
  separated_long: string;
  valid: boolean;
  type: string;
  isMale: boolean;
  isFemale: boolean;
};

const file = process.env.FILE || '.';
const Personnummer = file.includes('cjs')
  ? // eslint-disable-next-line
  require(file)
  : (await import(file)).default;

const availableListFormats = [
  'long_format',
  'short_format',
  'separated_format',
  'separated_long',
];

const _testList = {};

const testList = (file = 'list'): Promise<TestList[]> => {
  if (Array.isArray(_testList[file]) && _testList[file].length) {
    return new Promise((resolve) => {
      resolve(_testList[file].length);
    });
  }

  const res = fetch(
    `https://raw.githubusercontent.com/personnummer/meta/master/testdata/${file}.json`,
    {},
  ).then((p) => p.json());

  _testList[file] = res;

  return res;
};

describe('personnummer', () => {
  it('should validate personnummer with control digit', async () => {
    const list = await testList();

    list
      .filter((item) => item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          expect(Personnummer.valid(item[format])).toBe(item.valid);
        });
      });
  });

  it('should format personnummer', async () => {
    const list = await testList();

    list
      .filter((item) => item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          if (format !== 'short_format') {
            expect(Personnummer.parse(item[format]).format()).toBe(
              item.separated_format,
            );
            expect(Personnummer.parse(item[format]).format(true)).toBe(
              item.long_format,
            );
          }
        });
      });
  });

  it('should parse personnummer', async () => {
    const list = await testList();

    list
      .filter((item) => item.valid)
      .forEach((item) => {
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

  it('should throw personnummer error if not valid', async () => {
    const list = await testList();

    list
      .filter((item) => !item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          try {
            Personnummer.parse(item[format]);
            expect(false).toBe(true);
          } catch (_err) {
            expect(true).toBe(true);
          }
        });
      });
  });

  it('should test personnummer sex', async () => {
    const list = await testList();

    list
      .filter((item) => item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          expect(Personnummer.parse(item[format]).isMale()).toBe(item.isMale);
          expect(Personnummer.parse(item[format]).isFemale()).toBe(
            item.isFemale,
          );
        });
      });
  });

  it('should test personnummer age', async () => {
    const list = await testList();

    list
      .filter((item) => item.valid)
      .forEach((item) => {
        const pin = item.separated_long;
        const year = pin.slice(0, 4);
        const month = pin.slice(4, 6);
        let day = pin.slice(6, 8);
        if (item.type == 'con') {
          day = '' + (parseInt(day) - 60);
        }

        const ageDate = `${year}-${month}-${+day < 10 ? '0' : ''}${day}`;
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

    list
      .filter((item) => item.valid)
      .forEach((item) => {
        const pin = item.separated_long;
        const year = pin.slice(0, 4);
        const month = pin.slice(4, 6);
        let day = pin.slice(6, 8);
        if (item.type == 'con') {
          day = '' + (parseInt(day) - 60);
        }

        const ageDate = `${year}-${month}-${('' + day).length < 2 ? '0' : ''
          }${day}`;
        const personnummerDate = new Date(ageDate);

        availableListFormats.forEach((format) => {
          if (format !== 'short_format') {
            expect(Personnummer.parse(item[format]).getDate()).toStrictEqual(
              personnummerDate,
            );
          }
        });
      });
  });
});

// organization numbers

describe('organization numbers', () => {
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
});

// interim numbers

describe('interim numbers', () => {
  it('should validate interim numbers', async () => {
    const list = await testList('interim');

    list
      .filter((item) => item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          const p = Personnummer.parse(item[format], {
            allowInterimNumber: true,
          });
          expect(p.valid()).toBeTruthy();
          expect(p.isInterimNumber()).toBeTruthy();
          expect(p.isMale()).toBe(item.isMale);
          expect(p.isFemale()).toBe(item.isFemale);
        });
      });
  });

  it('should format interim numbers', async () => {
    const list = await testList('interim');

    list
      .filter((item) => item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          if (format !== 'short_format') {
            const p = Personnummer.parse(item[format], {
              allowInterimNumber: true,
            });
            expect(p.format()).toBe(item.separated_format);
            expect(p.format(true)).toBe(item.long_format);
          }
        });
      });
  });

  it('should throw personnummer error if not valid', async () => {
    const list = await testList('interim');

    list
      .filter((item) => !item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          expect(() => {
            Personnummer.parse(item[format], {
              allowInterimNumber: true,
            });
          }).toThrow(Error);
        });
      });
  });

  it('should throw personnummer error if interim numbers is not allowed', async () => {
    const list = await testList('interim');

    list
      .filter((item) => !item.valid)
      .forEach((item) => {
        availableListFormats.forEach((format) => {
          try {
            Personnummer.parse(item[format], {
              allowInterimNumber: false,
            });
            expect(false).toBe(true);
          } catch (_err) {
            expect(true).toBe(true);
          }
        });
      });
  });
});

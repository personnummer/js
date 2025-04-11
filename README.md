# personnummer [![Build Status](https://img.shields.io/github/actions/workflow/status/personnummer/js/nodejs.yml?branch=master)](https://github.com/personnummer/js/actions) [![NPM Downloads](https://img.shields.io/npm/dm/personnummer.svg)](https://www.npmjs.com/package/personnummer)

Validate Swedish personal identity numbers.

Install the module with npm:

```
npm install --save personnummer
```

## Example

```javascript
import Personnummer from 'personnummer';

Personnummer.valid('191212121212')
//=> true
```

See [index.test.ts](src/index.test.ts) for more examples.

## Options
| Option                  | Type                     | Default                 | Description                       |
|-------------------------|:-------------------------|:------------------------|:----------------------------------|
| allowCoordinationNumber | bool                     | true                    | Accept coordination numbers       |
| allowInterimNumber      | bool                     | false                   | Accept interim/T numbers          |

## License

MIT

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

See [test.ts](test.ts) for more examples.

## License

MIT

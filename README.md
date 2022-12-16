# personnummer [![Build Status](https://img.shields.io/github/actions/workflow/status/personnummer/js/nodejs.yml?branch=master)](https://github.com/personnummer/js/actions) [![NPM Downloads](https://img.shields.io/npm/dm/personnummer.svg)](https://www.npmjs.com/package/personnummer)

Validate Swedish personal identity numbers. Follows version 3 of the [specification](https://github.com/personnummer/meta#package-specification-v3).

Install the module with npm:

```
npm install --save personnummer
```

## Example

```javascript
import Personnummer from 'personnummer';

Personnummer.valid('198507099805')
//=> true
```

See [test.ts](test.ts) for more examples.

## License

MIT

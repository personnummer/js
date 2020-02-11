# personnummer [![Build Status](https://github.com/personnummer/js/workflows/build/badge.svg)](https://github.com/personnummer/js/actions)

Validate Swedish social security numbers.

Install the module with npm:

```
npm install --save personnummer
```

## Example

```javascript
const personnummer = require('personnummer');

personnummer.valid('198507099805')
//=> true
```

See [test.js](test.js) for more examples.

## License

MIT

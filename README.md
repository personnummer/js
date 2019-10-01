# personnummer [![Build Status](https://github.com/personnummer/js/workflows/build/badge.svg)](https://github.com/personnummer/js/actions)

Validate Swedish social security numbers.

Install the module with npm:

```
npm install --save personnummer
```

## Example

```javascript
const personnummer = require('personnummer');

personnummer.valid(6403273813);
//=> true

personnummer.valid('19130401+2931')
//=> true
```

See [test.js](test.js) for more examples.

## License

MIT

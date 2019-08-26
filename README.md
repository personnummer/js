# personnummer [![Build Status](https://secure.travis-ci.org/personnummer/js.png?branch=master)](http://travis-ci.org/personnummer/js)

Validate Swedish social security numbers.

Install the module with npm:

```
npm install --save personnummer
```

## Example

```javascript
node
> var personnummer = require('personnummer');
undefined
> personnummer.valid(6403273813);
true
> personnummer.valid('19130401+2931')
true
```

See [test.js](test.js) for more examples.

## License

MIT

# is-personnummer [![Build Status](https://secure.travis-ci.org/frozzare/is-personnummer.png?branch=master)](http://travis-ci.org/frozzare/is-personnummer)

Validate Swedish personal identity numbers.

Install the module with npm:

```
$ npm install is-personnummer
```

or with Bower, with AMD and browser support:

```
$ bower install is-personnummer
```

## Example

```javascript
var isPersonnummer = require('is-personnummer');

// Some examples that will equal true.
console.log(isPersonnummer('510818-9167'));   // true
console.log(isPersonnummer('19130401+2931')); // true
console.log(isPersonnummer('196408233234'));  // true

// Some examples that will equal false.
console.log(isPersonnummer('510818-916'));   // false
console.log(isPersonnummer('19130401+293')); // false
console.log(isPersonnummer('19640823323'));  // false
```

See [test.js](test.js) for more examples.

## License
Copyright (c) 2014 Fredrik Forsmo  
Licensed under the MIT license.

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

or as a cli:

```
$ npm install -g is-personnummer
$ is-personnummer 510818-9167
$ true
```

## Example

```javascript
$ node
> var isPersonnummer = require('is-personnummer');
undefined
> isPersonnummer('510818-9167');
true
> isPersonnummer('19130401+2931')
true
> isPersonnummer('196408233234')
true
> isPersonnummer('510818-916')
false
> isPersonnummer('19130401+293')
false
> isPersonnummer('19640823323')
false
```

See [test.js](test.js) for more examples.

## License

MIT © [Fredrik Forsmo](https://github.com/frozzare)

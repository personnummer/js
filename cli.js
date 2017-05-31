#!/usr/bin/env node

var pnr = require('./');
var meow = require('meow');
var cli = meow({
    help: [
        'Usage',
        '  $ is-personnummer-cli [input]',
        '',
        'Examples',
        '  $ is-personnummer-cli 510818-9167',
        '  true',
        '',
        '  $ is-personnummer-cli 19130401+293',
        '  false',
        ''
    ]
});

if (!cli.input[0]) {
    console.log(cli.help);
} else {
    var ret = cli.input[0];
    var l = ret.toString().length;
    if(pnr(ret) === false){
        // might be leading zeros
        if(l <= 7) {
            console.log(pnr('000' + ret));
        }
    } else console.log(pnr(ret));
}

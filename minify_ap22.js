#!/bin/env node

var fs = require('fs');
fs.readFile('src/ap22.js', 'utf8', function (err, data) {
    if (err) {
        return console.log(err);
    }

    // remove // style comments, spaces and new lines
    data = data.replace(new RegExp('//.*|\n|\r| ', 'g'), '');

    // preserve for of
    data = data.replace('of', ' of ');

    fs.writeFile('dist/ap22.min.js', data, 'utf8', function (err) {
        if (err) {
            console.log(err);
        }
    });
});
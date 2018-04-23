#!/usr/bin/env node

/**
 * Module dependencies.
 */

var program = require('commander');
var parser = require('../dist/src/index').parse
var fs = require('fs')
var path = require('path')

program
    .version('0.1.0')
    .usage('[file] [options]')
    .option('-o --out <file>', 'save result to a file')
    .option('-p, --pretty', 'pretty print json')
    .parse(process.argv);


var file = program.args[0]

function start() {
    var result = null

    if (!file) {
        console.error('file is needed')
    }

    file = path.resolve(process.cwd(), file)

    if (!fs.existsSync(file)) {
        console.error(`${file} is not a file`)
    }

    result = parser(file)

    if (!program.out) {
        if (program.pretty) {
            return console.log(JSON.stringify(result, null, 2))
        }

        return console.log(JSON.stringify(result))
    }
}

start()


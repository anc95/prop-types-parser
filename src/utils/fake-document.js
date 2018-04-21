const jsdom = require('jsdom')
const JSDOM = jsdom.JSDOM

const dom = new JSDOM(
    `<p>Hello, world</p>`,
    { includeNodeLocations: true }
);
  
const document = dom.window.document;

module.exports = document
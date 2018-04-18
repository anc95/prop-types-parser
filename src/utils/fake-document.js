import { JSDOM } from 'jsdom'

const dom = new JSDOM(
    `<p>Hello, world</p>`,
    { includeNodeLocations: true }
);
  
const document = dom.window.document;

export default document
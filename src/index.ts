import parse from './lib/parse'
import parseSeries from './lib/parseSeries'
export { default as parse } from './lib/parse'
export { default as  parseSeries } from './lib/parseSeries'

const config: ParserConfig = {
    base: '/Users/anchao01/code/erp-comp-helper/node_modules/@befe/erp-comps/v2/components/',
    fileExtension: 'js',
    components: [
        ['Section', {
            location: '/Users/anchao01/code/erp-comp-helper/node_modules/@befe/erp-comps/v2/components/Section/Container.js'
        }],
        ['Avatar'],
        ['Button', {
            location: './Button'
        }],
        ['Select', {
            location: '/Users/anchao01/code/erp-comp-helper/node_modules/@befe/erp-comps/v2/components/Select/Generic.js'
        }]
    ]
}
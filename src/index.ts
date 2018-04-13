import {
    ParserConfig
} from '../types/config'
import parsePropTypes from './lib/parsePropTypes'

const config: ParserConfig = {
    // base: '/Users/anchao01/code/erp-comp-helper/node_modules/@befe/erp-comps/v2/components/',
    fileExtension: 'js',
    components: [
        // ['Avatar'],
        ['Button', {
            location: './a'
        }],
        // ['Select', {
        //     location: '/Users/anchao01/code/erp-comp-helper/node_modules/@befe/erp-comps/v2/components/Select/Generic.jas'
        // }]
    ]
}
parsePropTypes(config)
# prop-types-parser
![](https://api.travis-ci.org/anc95/prop-types-parser.svg?branch=master)
![](https://img.shields.io/npm/dm/react-prop-types-parser.svg)

parse prop-types to analysize react components props data stucture

## why not [react-docgen](https://github.com/reactjs/react-docgen)

[react-docgen](https://github.com/reactjs/react-docgen) is based on ast, and only based ast, so it is hard to analysize some runtime code, such as `ONECOMPONENT.PropTypes` is imported form a module or is produced by a runtime function

`prop-types-parser`, combines ast and runtime code, it is more flexible and stronger
## install
`npm install react-prop-types-parser`

## usage

```
import { parse, parseSeries } from 'react-prop-types-parser'

parse(file, options)
```

### options
```
interface ParserConfig {
    /**
     * @desciption alias in code
     * @example {'@module': path.join(__dirname, ''../lib/@module'')}
     */
    alias?: Object,
    /**
     * @description global object will be injected to runtime code, and removed when finished excuting
     * @example { a: function () {return 'i was injected'}
     }
     */
    globalObject?: Object,
    /**
     * @description replace the third module with your module, so we have the effort to support more prop-types-like library
     * @example {'prop-types': path.join(__dirname, '../lib/prop-types')}
     */
    resolveModule?: Object,
    /**
     * @description babel config used to run the code depended by the main component entry
     *
     */
    babelConfig?: Object
}
```

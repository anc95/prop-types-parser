# prop-types-parser

parse prop-types to analysize react components props data stucture

## why not [react-docgen](https://github.com/reactjs/react-docgen)

[react-docgen](https://github.com/reactjs/react-docgen) is based on ast, and only based ast, so it is hard to analysize some runtime code, such as `ONECOMPONENT.PropTypes` is imported form a module or is produce by a runtime function

`prop-types-parser`, combines ast and runtime code, it is more flexible and stronger
## install
`npm install prop-types-parser`

## ussage

```
import { parse, parseSeries } from 'react-prop-types-parser'

parse(file, options)
```

### options
```
interface ParserConfig {
    /**
     * @desciption alias in code
     * @example {'moduleA', path.join(__dirname, ''../lib/moduleA'')}
     */
    alias?: Object,
    /**
     * @description global object will be injected to runtime code, and removed when finished excuting
     * @example { a: function () {return 'i was injected'}
     }
     */
    globalObject?: Object,
    /**
     * @description replace the third module with your module, so we have the effective to support more prop-types-like library
     * @example {'prop-types', path.join(__dirname, '../lib/prop-types')}
     */
    resolveModule?: Object
}
```
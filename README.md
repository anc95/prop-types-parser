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

parse(file)
// used for react component libriry
parseSeries(complexOption)
```

### doc is pending
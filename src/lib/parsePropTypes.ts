import { ParserConfig } from '../../types/config'
import extractPropTypeCode from './extractPropTypeCode'
import parseConfig from './parseConfig'

export default function(config: ParserConfig) {
    const components = parseConfig(config)

    for (let key of Object.keys(components)) {
        const compConfig = components[key]
        // const result: string | undefined = extractPropTypeCode(compConfig.location, compConfig.cwd)

        // if (result) {
        //     console.log(result)
        // }
    }
}
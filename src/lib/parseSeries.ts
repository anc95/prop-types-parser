import { ParserConfig } from '../../types/config'
import parseConfig from './parseConfig'
import parse from './parse'

export default function(config: ParserConfig) {
    const components = parseConfig(config)
    const result = {}

    for (let key of Object.keys(components)) {
        const compConfig = components[key]
        result[key] = parse(compConfig.location)
    }

    return result
}
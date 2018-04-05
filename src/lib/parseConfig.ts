import {
    ParserConfig
} from '../../types/config'
import resolveConfig from './resolveConfig'
import { dirname } from 'path'

export default function parseConfig (config: ParserConfig): Object {
    config = resolveConfig(config)
    const components = config.components
    const result = {}

    components.forEach(comp => {
        if (comp[1] && comp[1].location) {
            comp[1].cwd = dirname(comp[1].location)
            result[comp[0]] = comp[1]
        }
    })

    config.validComponents = result

    return result
}
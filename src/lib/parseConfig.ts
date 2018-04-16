import {
    ParserConfig
} from '../../types/config'
import resolveConfig from './resolveConfig'
import { dirname } from 'path'

interface Result {
    validComponents: object[],
    alias: object
}

export default function parseConfig (config: ParserConfig): Result {
    config = resolveConfig(config)
    const components = config.components
    const validComponents = {}

    components.forEach(comp => {
        if (comp[1] && comp[1].location) {
            comp[1].cwd = dirname(comp[1].location)
            validComponents[comp[0]] = comp[1]
        }
    })

    config.validComponents = validComponents

    return <Result>{
        validComponents,
        alias: config.alias
    }
}
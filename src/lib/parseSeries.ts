import { ParserConfig, ComponentSource } from '../../types/config'
import resolveSource from './resolveSource'
import parse from './parse'

export default function(source: ComponentSource, config: ParserConfig) {
    const validComponents = resolveSource(source)
    const result = {}
    const keys = Object.keys(<object>validComponents) 
    
    tryParse(result, keys, validComponents, config)
    return result
}

let i = 0
function tryParse(result: object, keys: string[], validComponents: any, config: object) {
    try {
        for (; i < keys.length; i++) {
            const key = keys[i]
            const compConfig = validComponents[key]
            result[key] = parse(compConfig.location, config)
        }
    } catch (e) {
        console.log(e)
        i++
        tryParse(result, keys, validComponents, config)
    }
}
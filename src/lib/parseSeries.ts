import { ParserConfig } from '../../types/config'
import parseConfig from './parseConfig'
import parse from './parse'

export default function(options: ParserConfig) {
    const { validComponents, alias } = parseConfig(options)
    const result = {}
    const keys = Object.keys(validComponents) 
    
    tryParse(result, keys, validComponents, alias)
    return result
}

let i = 0
function tryParse(result: object, keys: string[], validComponents: any, alias: object) {
    try {
        for (; i < keys.length; i++) {
            const key = keys[i]
            const compConfig = validComponents[key]
            result[key] = parse(compConfig.location, alias)
        }
    } catch (e) {
        console.log(e)
        i++
        tryParse(result, keys, validComponents, alias)
    }
}
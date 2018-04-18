import {
    ParserConfig,
    CompInfo,
    CompConfig
} from '../../types/config'
import { 
    isDirectory, 
    isFile,
    hasExtension
} from '../utils'
import { join as pathResolve, isAbsolute } from 'path'
import * as _ from 'lodash'
import document from '../utils/fake-document'

export default function (config: ParserConfig): ParserConfig {
    let resolvedConfig = resolveDefaultConfig(config)
    let components = resolvedConfig.components

    components.map((comp: CompInfo) => {
        const compLocation = _.has(comp[1], 'location') ? comp[1].location : ''

        comp[1] = <CompConfig>{
            location: resolveCompLocation(<string>resolvedConfig.base, comp[0], compLocation, <string>resolvedConfig.fileExtension)
        }
    })

    resolvedConfig.components = components

    return resolvedConfig
}

function resolveDefaultConfig(config: ParserConfig): ParserConfig {
    let defaultConfig: ParserConfig = {
        base: process.cwd(),
        fileExtension: 'js',
        components: [],
        alias: {},
        resolveModule: {
            'prop-types': pathResolve(__dirname, '../utils/propTypes')
        },
        globalObject: {
            document
        }
    }

    for (let key of Object.keys(defaultConfig)) {
        if (config.hasOwnProperty(key) && config[key]) {
            if (typeof config[key] === 'object') {
                defaultConfig[key] = Object.assign({}, defaultConfig[key], config[key])
            } else {
                defaultConfig[key] = config[key]
            }
        }
    }

    return defaultConfig
}

function resolveCompLocation(base: string, compName: string, compLocation: string, fileExtension: string): string | null {
    let compPath: string = ''
    if (compLocation) {
        if (isAbsolute(compLocation)) {
            compPath = compLocation
        } else {
            compPath = pathResolve(base, compLocation)
        }
    } else {
        compPath = pathResolve(base, compName)
    }

    if (isDirectory(compPath)) {
        compPath = pathResolve(compPath, `./index.${fileExtension}`)
    } else {
        if (!hasExtension(compPath)) {
            compPath = `${compPath}.${fileExtension}`
        }
    }

    if (isFile(compPath)) {
        return compPath
    } else {
        return null
    } 
}
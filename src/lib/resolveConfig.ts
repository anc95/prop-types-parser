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

export default function (config: ParserConfig): ParserConfig {
    let resolvedConfig: ParserConfig = {
        base: process.cwd(),
        fileExtension: 'js',
        components: [],
        alias: {}
    }

    let {
        base,
        components,
        fileExtension,
        alias
    } = config

    if (base) {
        resolvedConfig.base = base
    }

    if (fileExtension) {
        resolvedConfig.fileExtension = fileExtension
    }

    if (alias) {
        resolvedConfig.alias = alias
    }

    components.map((comp: CompInfo) => {
        const compLocation = _.has(comp[1], 'location') ? comp[1].location : ''

        comp[1] = <CompConfig>{
            location: resolveCompLocation(<string>resolvedConfig.base, comp[0], compLocation, <string>resolvedConfig.fileExtension)
        }
    })

    resolvedConfig.components = components

    return resolvedConfig
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
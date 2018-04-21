/**
 * @file react组件声明地址
 */
import {
    isFile,
    isDirectory,
    hasExtension
} from '../utils'
import {ComponentSource, CompInfo, CompConfig} from '../../types/config'
import resolveDefaultConfig from '../utils/resolveDefaultConfig'
import * as _ from 'lodash'
import * as path from 'path'

export default function resolveSource(source: string | ComponentSource): null | string | CompInfo[] {
    if (typeof source === 'string') {
        return resolveSourceFile(source)
    }

    const defaultSource = {
        base: process.cwd(),
        fileExtension: 'js',
        components: []
    }

    source = <ComponentSource>resolveDefaultConfig(defaultSource, source)
    let components = source.components

    components.map((comp: CompInfo) => {
        const compLocation = _.has(comp[1], 'location') ? comp[1].location : ''

        comp[1] = <CompConfig>{
            location: resolveCompLocation(<string>(<ComponentSource>source).base, comp[0], compLocation, <string>(<ComponentSource>source).fileExtension)
        }
    })

    return components
}

/**
 * 解析组件绝对地址, 没有则返回null
 * @param base 
 * @param compName 
 * @param compLocation 
 * @param fileExtension 
 */
function resolveCompLocation(base: string, compName: string, compLocation: string, fileExtension: string): string | null {
    let compPath: string = ''
    if (compLocation) {
        if (path.isAbsolute(compLocation)) {
            compPath = compLocation
        } else {
            compPath = path.join(base, compLocation)
        }
    } else {
        compPath = path.join(base, compName)
    }

    if (isDirectory(compPath)) {
        compPath = path.join(compPath, `./index.${fileExtension}`)
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

/**
 * 得到绝对路径
 * @param source 文件地址
 */
function resolveSourceFile(source: string): string {
    if (!path.isAbsolute(source)) {
        source = path.join(process.cwd(), source)
    }

    if (isFile(source)) {
        return source
    } else {
        throw new Error(`${source} is not a file`)
    }
}
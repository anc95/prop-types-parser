import {
    readFileSync
} from 'fs'
import {join as pathJoin} from 'path'
import {parse, BabylonOptions} from 'babylon'
import { File, Program, ClassProperty } from 'babel-types'
import resolveExportedComponent from './resolveExportedComponent'
import traverse, { NodePath } from 'babel-traverse'
import extractPropTypeCode from './extractPropTypeCode'
import * as t from 'babel-types'
import {PropType} from '../../types/props'
import getJsonObjComments from '../utils/getJsonObjComments'

const AST_PARSE_CONFIG: BabylonOptions = {
    sourceType: 'module',
    plugins: [
        'classProperties',
        'objectRestSpread'
    ]
}
/**
 * 解析出props依赖, 遵循react-docgen格式
 * @param file 文件地址
 */
export default function(file: string) {
    let classDeclarationPath: NodePath | null = null
    const content = readFileSync(file, 'utf8')
    const ast: File = parse(content, AST_PARSE_CONFIG)
    const result = {
        description: '',
        displayName: '',
        props: []
    }
    traverse(ast, {
        Program(path: NodePath) {
            classDeclarationPath = resolveExportedComponent(path)
        }
    })

    if (!classDeclarationPath) {
        throw new Error(`cannot find exported react Component in ${file}`)
    }

    const propsTypesPath = getPropTypesPath(classDeclarationPath)

    if (!propsTypesPath) {
        throw new Error(`cannot find proptypes defination in ${file}`)
    }

    console.log()
    const a: any = (<NodePath>propsTypesPath).get('value')
    // getJsonObjComments(a)
    console.log(getJsonObjComments(a))

    console.log(extractPropTypeCode(<NodePath>propsTypesPath))
}

/**
 * 找到propTypes path
 * @param path reactComponent class声明所在的path
 */
function getPropTypesPath(path: NodePath): NodePath | null {
    let propTypesPath: NodePath | null = null
    path.traverse({
        ClassProperty: function(path) {
            const node = <ClassProperty>path.node
            if (t.isIdentifier(node.key)
                && node.key.name === 'propTypes'
            ) {
                propTypesPath = path
            } else {
                return false
            }
        }
    })

    return propTypesPath
}
import {
    readFileSync,
    writeFileSync
} from 'fs'
import { execSync } from 'child_process'
import {parse, BabylonOptions} from 'babylon'
import { File, ClassProperty } from 'babel-types'
import resolveExportedComponent from './resolveExportedComponent'
import traverse, { NodePath } from 'babel-traverse'
import extractPropTypeCode from './extractPropTypeCode'
import * as t from 'babel-types'
import getJsonObjComments from '../utils/getJsonObjComments'
import * as vm from 'vm'
import * as path from 'path'

const AST_PARSE_CONFIG: BabylonOptions = {
    sourceType: 'module',
    plugins: [
        'classProperties',
        'objectRestSpread',
        'throwExpressions',
        'optionalCatchBinding',
        'importMeta',
        'asyncGenerators',
        'exportNamespaceFrom',
        'exportDefaultFrom',
        'classPrivateMethods',
        'classPrivateProperties',
        'decorators',
        'doExpressions'
    ]
}
/**
 * 解析出props依赖, 遵循react-docgen格式
 * @param file 文件地址
 */
export default function(file: string, alias: object) {
    let classDeclarationPath: NodePath | null = null
    const content = readFileSync(file, 'utf8')
    const ast: File = parse(content, AST_PARSE_CONFIG)
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

    const value: any = (<NodePath>propsTypesPath).get('value')
    const code = extractPropTypeCode(<NodePath>propsTypesPath, path.dirname(file), alias)
    console.log(code)
    const comments = getJsonObjComments(value)
    const propTypes = execExtractCode(code, file)

    for (let key of Object.keys(propTypes)) {
        if (comments[key] && propTypes[key]) {
            propTypes[key].description = comments[key]
        }
    }
    
    return propTypes
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

/**
 * 执行代码, 拿到propTypes
 * @param code 代码内容为字符串
 */
function execExtractCode(code: string, file: string) {
    let result: any = null
    const script = new vm.Script(code)
    const sandbox = { require: require, console, module, exports, __filename, __dirname: path.dirname(file), callback: ((res: any) => {
        result = res
    })};
    vm.createContext(sandbox);
    script.runInContext(sandbox)
    
    return result
}
import {
    readFileSync
} from 'fs'
import {join as pathJoin} from 'path'
import {transformFromAst, Node, transform} from 'babel-core'
import {parse, BabylonOptions} from 'babylon'
import { File, Program, VariableDeclaration, ClassProperty, exportDefaultDeclaration, classDeclaration } from 'babel-types'
import resolveExportedComponent from './resolveExportedComponent'
import findAllDependencesByObj from '../utils/findAllDependencesByObj'
import traverse, { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import * as _ from 'lodash'

const easyPropTypeModule = pathJoin(__dirname, 'propTypes.js')
const babelRegisterCode: string = `
require('babel-register')({
    presets: ['env]
})
`

const AST_PARSE_CONFIG: BabylonOptions = {
    sourceType: 'module',
    plugins: [
        'classProperties',
        'objectRestSpread'
    ]
}
/**
 * 将proptypes相关代码单独解析出来
 * @param propTypesPath 代码中propTypes定义所在的path
 */
export default function(propTypesPath: NodePath): string {
    let programAst: Program | any = {
        type: 'Program',
        body: []
    }
    const node = propTypesPath.node
    const dependencies = findAllDependencesByObj(propTypesPath.get('value'))
    changeImportedPropTypesSource(dependencies)

    if (dependencies && dependencies.length) {
        dependencies.forEach(dep => {
            programAst.body.push(dep.node)
        })
    }

    programAst.body.push(transStaticPropertyToDeclare(node)) 
    const code: string = <string>transformFromAst(programAst).code
    return babelRegisterCode + transform(code, {presets: ['babel-preset-env']}).code
}

/**
 * 改变prop-types库的引用
 * @param dependencies proptypes定义中的变量依赖
 */
function changeImportedPropTypesSource(dependencies: NodePath[]) {
    dependencies.some(dep => {
        if (t.isLiteral(dep.get('source'))) {
            if (_.get(dep, 'node.source.value') === 'prop-types') {
                dep.get('source').replaceWith(
                    t.stringLiteral(easyPropTypeModule)
                )
            }
        }
    })
}

/**
 * 去除可能存在的static propTypes中的static
 * @param node 
 */
function transStaticPropertyToDeclare(node: any): VariableDeclaration{
    node.static = false

    const declaration: VariableDeclaration = t.variableDeclaration(
        'var',
        [
            t.variableDeclarator(
                t.identifier('_propTypes_'),
                node.value
            )
        ]
    )

    return declaration
}
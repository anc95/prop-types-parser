import {join as pathJoin} from 'path'
import {transformFromAst, Node, transform} from 'babel-core'
import {BabylonOptions} from 'babylon'
import { Program, VariableDeclaration } from 'babel-types'
import findAllDependencesByObj from '../utils/findAllDependencesByObj'
import { NodePath } from 'babel-traverse'
import * as t from 'babel-types'
import * as _ from 'lodash'

const easyPropTypeModule = pathJoin(__dirname, '../utils/propTypes.js')
const babelRegisterCode: string = `
var exportPropTypes = require('../plugins/exportPropTypes')
require('babel-register')({
    presets: [require('babel-preset-env'), require('babel-preset-stage-0')],
    cache: false,
    plugins: [
        // require('babel-plugin-transform-object-rest-spread'),
        [
            exportPropTypes,
            {
                alias: {
                    '@befe': '/Users/anchao01/code/erp-comp-helper/node_modules/@befe'
                }
            }
        ]
    ],
    ignore: /node_modules\\/(?!@befe)/
})
`

/**
 * 将proptypes相关代码单独解析出来
 * @param propTypesPath 代码中propTypes定义所在的path
 */
export default function(propTypesPath: NodePath, cwd: string): string {
    let programAst: Program | any = {
        type: 'Program',
        body: []
    }
    const node = propTypesPath.node
    const dependencies = findAllDependencesByObj(propTypesPath.get('value'))
    changeImportedSource(dependencies, cwd)

    if (dependencies && dependencies.length) {
        dependencies.forEach(dep => {
            programAst.body.push(dep.node)
        })
    }

    programAst.body.push(transStaticPropertyToDeclare(node)) 
    const code: string = <string>transformFromAst(programAst).code
    return babelRegisterCode + transform(code, {presets: ['babel-preset-env']}).code + 'callback && callback(_propTypes_)'
}

/**
 * 改变库的引用
 * @param dependencies require所引用的路径替换 相对到绝对, 对prop-types替换
 */
function changeImportedSource(dependencies: NodePath[], cwd: string) {
    dependencies.some(dep => {
        if (t.isLiteral(dep.get('source'))) {
            const sourceName = _.get(dep, 'node.source.value')
            if (sourceName === 'prop-types') {
                dep.get('source').replaceWith(
                    t.stringLiteral(easyPropTypeModule)
                )
            } else if (sourceName) {
                dep.get('source').replaceWith(
                    t.stringLiteral(pathJoin(cwd, sourceName))
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
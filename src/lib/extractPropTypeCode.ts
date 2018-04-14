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

const easyPropTypeModule = pathJoin(__dirname, 'propTypes.ts')
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

export default function(classDeclarationPath: NodePath): string {
    let programAst: Program | any = {
        type: 'Program',
        body: []
    }

    classDeclarationPath.traverse({
        ClassProperty: function(path) {
            const node = <ClassProperty>path.node
            if (t.isIdentifier(node.key)
                && node.key.name === 'propTypes'
            ) {
                const dependencies = findAllDependencesByObj(path.get('value'))
                changeImportedPropTypesSource(dependencies)

                if (dependencies && dependencies.length) {
                    dependencies.forEach(dep => {
                        programAst.body.push(dep.node)
                    })
                }

                programAst.body.push(transStaticPropertyToDeclare(node)) 
            } else {
                return false
            }
        }
    })
    const code: string = <string>transformFromAst(programAst).code
    return babelRegisterCode + transform(code, {presets: ['babel-preset-env']}).code
}

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
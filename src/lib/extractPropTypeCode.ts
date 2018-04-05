import {
    readFileSync
} from 'fs'
import {join as pathJoin} from 'path'
import {transformFromAst, Node, transform} from 'babel-core'
import {parse, BabylonOptions} from 'babylon'
import { File, Program, VariableDeclaration, ClassProperty } from 'babel-types'
const traverse = require('@babel/traverse').default
const t = require('@babel/types')

const easyPropTypeModule = pathJoin(__dirname, 'propTypes.ts')

const protectLib: Array<string> = [
    'prop-types'
]

const AST_PARSE_CONFIG: BabylonOptions = {
    sourceType: 'module',
    plugins: [
        'classProperties',
        'objectRestSpread'
    ]
}

export default function(file: string, cwd: string): string | undefined {
    let programAst: Program | any = {
        type: 'Program',
        body: []
    } 
    const content = readFileSync(file, 'utf8')
    const ast: File = parse(content, AST_PARSE_CONFIG)

    traverse(ast, {
        ImportDeclaration(path: any) {
            const node = path.node
            const lib = node.source.value

            if (lib[0] === '.' || protectLib.indexOf(lib) > -1) {
                programAst.body.push(node)
            }

            if (lib === 'prop-types') {
                node.source = t.stringLiteral(easyPropTypeModule)
            } else {
                node.source = t.stringLiteral(pathJoin(cwd, lib))
            }
        },

        VariableDeclaration(path: any) {
            const type = path.parent.type
            if (['ExportNamedDeclaration', 'Program'].indexOf(type) !== -1) {
                programAst.body.push(path.node)
            }
        },

        ExportDefaultDeclaration(path: any) {
            path.traverse({
                ClassProperty(path: any) {
                    const node = path.node
                    if (t.isIdentifier(node.key)
                        && node.key.name === 'propTypes'
                    ) {
                        node.static = false
                        programAst.body.push(transStaticPropertyToDeclare(node)) 
                    }
                }
            })
        }
    })

    const code = transformFromAst(programAst).code || ''
    return transform(code, {presets: ['babel-preset-env']}).code
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
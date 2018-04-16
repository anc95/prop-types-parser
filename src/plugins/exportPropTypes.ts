
import * as _ from 'lodash'
import { dirname } from 'path'
import * as path from 'path'
import * as t from 'babel-types'
import { NodePath } from 'babel-traverse';

const easyPropTypes = path.join(__dirname, '../utils/propTypes.js')

module.exports = function() {
    // let visitedPropsTypes: boolean = false
    // let dependencies = []
    // let body: NodePath[] = []
    let dir = ''
    return {
        visitor: {
            Program: {
                enter(path: NodePath, state: any) {
                    dir = dirname(state.file.opts.filename)
                }
            },
            ImportDeclaration(path: NodePath, state: any) {
                const sourceName = _.get(path, 'node.source.value')

                if (/(\.less|\.css)$/.test(sourceName)) {
                    return path.remove()
                }

                if (sourceName === 'prop-types') {
                    path.get('source').replaceWith(
                        t.stringLiteral(easyPropTypes)
                    )
                    // visitedPropsTypes = true
                } else {
                    const alias = _.get(state, 'opts.alias')
                    if (!alias) {
                        return false
                    }
                    path.get('source').replaceWith(
                        t.stringLiteral(resolveAlias(sourceName, alias, dir))
                    )
                }
            },
            ExportDefaultDeclaration(path: NodePath) {
                // if (!visitedPropsTypes) {
                //     return false
                // }

                // const declaration = path.get('declaration')
                // if (t.isObjectExpression(declaration)) {
                //     dependencies = findAllDependencesByObj(declaration)
                //     console.log(dependencies.length)
                //     if (dependencies.length) {
                //         body = _.concat(body, dependencies, path)
                //     }
                // }
            }
        }
    }
};

function resolveAlias(filePath: string, alias: any, dirname: string): string {
    if (filePath.startsWith('.')) {
        return path.join(dirname, filePath)
    }

    for (let key of Object.keys(alias)) {
        if (filePath.startsWith(`${key}${path.sep}`)) {
            return path.join(alias[key], `.${filePath.substr(key.length)}`)
        }
    }

    return filePath
}
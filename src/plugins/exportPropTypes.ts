
import * as _ from 'lodash'
import { dirname } from 'path'
import * as path from 'path'
import * as t from 'babel-types'
import { NodePath } from 'babel-traverse'
import ignore from '../utils/ignore'
import getJsonObjComments from '../utils/getJsonObjComments'
import { addComments } from '../lib/comments'

const easyPropTypes = path.join(__dirname, '../utils/propTypes.js')

module.exports = function() {
    let dir = ''
    let propTypesSpe: null | string = null
    return {
        visitor: {
            Program: {
                // @ts-ignore
                enter(path: NodePath, state: any) {
                    dir = dirname(state.file.opts.filename)
                }
            },
            ImportDeclaration(path: NodePath, state: any) {
                const sourceName = _.get(path, 'node.source.value')
                if (/(\.less|\.css|\.sass|\.png|\.jpg|\.svg|\.gif)$/.test(sourceName)) {
                    return path.remove()
                }

                if (sourceName === 'prop-types') {
                    propTypesSpe = _.get(path, 'node.specifiers.0.local.name')
                    path.get('source').replaceWith(
                        t.stringLiteral(easyPropTypes)
                    )
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
            // @ts-ignore
            ObjectExpression(path: t.ObjectExpression) {
                if (propTypesSpe && isPropTypesJson(path, propTypesSpe)) {
                    addComments(getJsonObjComments(path))
                } else {
                    return false
                }
            },
            ExportDefaultDeclaration: ignore
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

function isPropTypesJson(path: t.ObjectExpression, propTypesSpe: string): boolean {
    const properties = _.get(path, 'node.properties')

    if (!(properties instanceof Array)) {
        return false
    }

    return properties.some(p => {
        const calleeName = _.get(p, 'value.callee.object.name')
        return calleeName === propTypesSpe
    })
}
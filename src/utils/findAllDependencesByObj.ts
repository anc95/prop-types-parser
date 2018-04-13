/**
 * 解析类如
 * { 
 *   a: A,
 *   b: B
 * }
 * 对象的依赖存在与代码中的位置
 * @param path path对象
 */
const t = require('@babel/types')
import * as _ from 'lodash'
import {Path} from '../../types/ast'
import ignore from './ignore'
import findIndentifierDeclaration from './findIndentifierDeclaration'

const dependences:Path[] = []
const visitedId = {}

export default function(path: Path): Path[] {
    path.traverse({
        MemberExpression: ignore,
        Property: handleProperty
    })
console.log(visitedId)
    return dependences    
}

function handleProperty(path: Path) {
    const valuePath: Path = path.get('value')
    const valueNode = valuePath.node

    switch (valueNode.type) {
        case 'MemberExpression':
        case 'Identifier':
            const valuePathMap = {
                MemberExpression: 'object.name',
                Identifier: 'name'
            }
            const id = _.get(valueNode, valuePathMap[valueNode.type])
            if (visitedId[id]) {
                break
            }

            saveDependecies(path, id)
            break
        case 'CallExpression':
            const ids = _.get(valueNode, 'arguments')
            for (let i = 0, len = ids.length; i < len; i++) {
                const id = ids[i].name
                if (!t.isIdentifier(ids[i])) {
                    continue
                }

                if (visitedId[id]) {
                    continue
                }

                saveDependecies(path, id)
            }
            break
        default:
            break
    }
}

function saveDependecies(path: any, id: string): void {
    const foundDependencyPath = findIndentifierDeclaration(path, id)
    if (foundDependencyPath) {
        dependences.push(foundDependencyPath)
        visitedId[id] = true
    }
}
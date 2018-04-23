/**
 * 解析类如
 * { 
 *   ...arg
 *   a: A,
 *   b: B
 * }
 * 对象的依赖存在与代码中的位置
 * @param path path对象
 */
import * as t from 'babel-types'
import * as _ from 'lodash'
import findIndentifierDeclaration from './findIndentifierDeclaration'
import { NodePath } from 'babel-traverse';

export default function findAllDependencies(path: NodePath, visitedId?: any, dependences?: NodePath[]): NodePath[] {
    dependences = dependences ? dependences : []
    visitedId = visitedId ? visitedId : {}

    if (t.isIdentifier(path)) {
        const dep = findIndentifierDeclaration(path, _.get(path, 'node.name'))
        if (dep) {
            dependences.push(dep)
        }

        return dependences
    }

    path.traverse({
        SpreadElement: handleSpreadProperty.bind(null, visitedId, dependences),
        MemberExpression: handleMemberExpression.bind(null, visitedId, dependences),
        SpreadProperty: handleSpreadProperty.bind(null, visitedId, dependences),
        Property: handleProperty.bind(null, visitedId, dependences),
        ObjectExpression: (path: NodePath) => {
            findAllDependencies(path, visitedId, dependences)
        }
    })

    _.set(path, 'visited', true)

    dependences.forEach(path => {
        if (!_.get(path, 'visited')) {
            findAllDependencies(path, visitedId, dependences)
        }
    })
    
    return dependences    
}

function handleMemberExpression (visitedId: any, dependences: NodePath[], path: NodePath) {
    if (t.isIdentifier(path.get('object'))) {
        const id = _.get(path, 'node.object.name')
        saveDependecies(path, id, visitedId, dependences)
    }
}

function handleSpreadProperty(visitedId: any, dependences: NodePath[], path: NodePath) {
    let idName: string = ''
    if (t.isIdentifier(path.get('argument'))) {
        idName = _.get(path, 'node.argument.name')
        saveDependecies(path, idName, visitedId, dependences)
    }
}

function handleProperty(visitedId: any, dependences: NodePath[], path: NodePath) {
    const valuePath: NodePath = path.get('value')
    const valueNode = valuePath.node
    switch (valueNode.type) {
        case 'MemberExpression':
        case 'Identifier':
            const valuePathMap = {
                MemberExpression: 'object.name',
                Identifier: 'name'
            }
            const id = _.get(valueNode, valuePathMap[valueNode.type])
            saveDependecies(path, id, visitedId, dependences)
            break
        case 'CallExpression':
            handleCallExpression(visitedId, dependences, valueNode, path)
            break
        default:
            break
    }
}

function handleCallExpression(visitedId: any, dependences: NodePath[], valueNode: any, path: NodePath) {
    // a(b) or a.c(b)
    const calleeId = _.get(valueNode, 'callee.name') || _.get(valueNode, 'callee.object.name')
    saveDependecies(path, calleeId, visitedId, dependences)
    const ids = _.get(valueNode, 'arguments')
    for (let i = 0, len = ids.length; i < len; i++) {
        const id = ids[i].name
        if (t.isIdentifier(ids[i])) {
            saveDependecies(path, id, visitedId, dependences)
        }

        if (t.isMemberExpression(ids[i])) {
            const id = _.get(ids[i], 'object.name')
            saveDependecies(path, id, visitedId, dependences)
        }
    }
}

function saveDependecies(path: any, id: string, visitedId: any, dependences: NodePath[]): void {
    if (visitedId[id] || !id) {
        return
    }

    const foundDependencyPath = findIndentifierDeclaration(path, id)
    if (foundDependencyPath) {
        visitedId[id] = true
        dependences.push(foundDependencyPath)
    }
}
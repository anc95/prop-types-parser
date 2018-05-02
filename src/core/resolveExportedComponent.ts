import ignore from '../utils/ignore'
import findIndentifierDeclaration from '../utils/findIndentifierDeclaration'
import isExtendReactComponent from '../utils/isExtendReactComponent'
import { NodePath } from 'babel-traverse';
import * as _ from 'lodash'
import * as t from 'babel-types'

export default function(ast: NodePath): NodePath | null {
    let exportedComponent: NodePath | null = null

    function handleExportDefaultDeclaration(path: NodePath) {
        const declaration: NodePath = <NodePath>path.get('declaration')

        if (t.isClassDeclaration(declaration)) {
            exportedComponent = declaration
        } else if (t.isIdentifier(declaration)) {
            exportedComponent = findIndentifierDeclaration(path, _.get(declaration, 'node.name'))
        }
        
        if (!isExtendReactComponent(exportedComponent)) {
            exportedComponent = null
        }
    }

    ast.traverse({
        ImportDeclaration: ignore,
        VariableDeclaration: ignore,
        ExportNamedDeclaration: ignore,
        FunctionDeclaration: ignore,
        ExportDefaultDeclaration: handleExportDefaultDeclaration
    })
    
    return exportedComponent
}
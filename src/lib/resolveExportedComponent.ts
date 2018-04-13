const t = require('@babel/types')
import ignore from '../utils/ignore'
import findIndentifierDeclaration from '../utils/findIndentifierDeclaration'
import isExtendReactComponent from '../utils/isExtendReactComponent'
import {Path} from '../../types/ast'

export default function(ast: Path) {
    let exportedComponent: Path | null = null

    function handleExportDefaultDeclaration(path: Path) {
        const declaration: Path = <Path>path.get('declaration')

        if (t.isClassDeclaration(declaration)) {
            exportedComponent = declaration
        } else if (t.isIdentifier(declaration)) {
            exportedComponent = findIndentifierDeclaration(path, declaration.node.name)
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
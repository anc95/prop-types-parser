const t = require('@babel/types')
import ignore from '../utils/ignore'
import findIndentifierDeclaration from '../utils/findIndentifierDeclaration'

export default function(ast: any) {
    const node = ast.node
    let exportedComponent = null

    function handleExportDefaultDeclaration(path: any): any {
        const declaration = path.get('declaration')

        if (t.isClassDeclaration(declaration)) {
            exportedComponent = declaration
        } else if (t.isIdentifier(declaration)) {
            exportedComponent = findIndentifierDeclaration(path, declaration.node.name)
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
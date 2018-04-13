/**
 * 在当前scope查找是否存在某变量声明
 * @param path path对象
 * @param id indetifier
 */
export default function findDeclaration(path: any, id: string): any {
    let idPath = null

    try {
        idPath = path.scope.bindings[id].path
    } catch (e) {
        if (path.parentPath) {
            return findDeclaration(path.parentPath, id)
        }
    }
    
    let declarationPath = null

    if (!idPath) {
        return null
    }

    let parentPath = idPath

    do {
        const type: string = parentPath.node.type
        if (type && type.toLowerCase().includes('declaration')) {
            declarationPath = parentPath
            parentPath = null
        }

        parentPath = parentPath && parentPath.parentPath
    } while (parentPath)

    if (!declarationPath && path.parentPath) {
        return findDeclaration(path.parentPath, id)
    }

    return declarationPath
}
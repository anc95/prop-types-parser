/**
 * 在当前scope查找是否存在某变量声明
 * @param path path对象
 * @param id indetifier
 */
export default function(path: any, id: string): any {
    const idPath = path.scope.bindings[id].path
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

    return declarationPath
}
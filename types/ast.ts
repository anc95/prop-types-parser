export interface Node {
    name: string,
    type: string
}

export interface Path {
    parentPath: Path,
    node: Node
    get(p:string):Path,
    traverse(p: any): any
}
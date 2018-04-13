/**
 * 是否为集成与reactComponent
 * @param classDeclarationPath class声明path
 */
import * as _ from 'lodash'

export default function isExtendReactComponent(classDeclarationPath: any): boolean {
    // extend Component or extend React.Component
    if (
        _.get(classDeclarationPath, 'node.superClass.name') === 'Component'
        || _.get(classDeclarationPath, 'node.superClass.property.name') === 'Component'
    ) {
        return true
    } 

    return false
}
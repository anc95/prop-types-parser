import { ObjectExpression } from "babel-types";
import * as _ from 'lodash'

/**
 * 读取josn中的注释
 * @param path json代码的path
 */
export default function(path: ObjectExpression): any[] {
    const properties = _.get(path, 'node.properties')
    const result: any[] = []

    if (!properties || properties.length === 0) {
        return result
    }

    properties.forEach((prop: any) => {
        const key = _.get(prop, 'key.name')
        const descList = _.get(prop, 'leadingComments')

        if (descList && descList.length) {
            let desc = ''
            descList.forEach((d: any) => {
                // remove '*' in comment
                desc += d.value.replace(/(\*)*\s*\n\s*(\*)*/g, '\n')
            })

            result[key] = desc
        }
    })

    return result
}
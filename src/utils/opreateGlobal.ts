let add_keys = new Map()

/**
 * 将对象映射到全局变量
 * @param obj 一个对象, key不得与global的key重名
 */
export function assignToGlobal(obj: object) {
    for (let key of Object.keys(obj)) {
        if (!global[key]) {
            global[key] = obj[key]
            add_keys.set(key, true)
        }
    }
}

/**
 * 从global对象中移除属性, 前提是先通过assignToGlobal添加过
 * @param obj 一个对象
 */
export function removeFromGlobal(obj: object) {
    for (let key of Object.keys(obj)) {
        if (global[key] && add_keys.get(key)) {
            delete global[key]
            add_keys.set(key, false)
        }
    }
}
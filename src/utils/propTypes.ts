interface ReturnType {
    type: string,
    require: boolean,
    description: string,
    value?: any[]
}

export default class {
    static get bool() {
        return Type('bool')
    }

    static get array() {
        return Type('array')
    }

    static get func() {
        return Type('func')
    }

    static get number() {
        return Type('number')
    }

    static get symbol() {
        return Type('symbol')
    }

    static get string() {
        return Type('string')
    }

    static get object() {
        return Type('object')
    }

    static get node() {
        return Type('node')
    }

    static get any() {
        return Type('any')
    }

    static oneOf(params: any[]) {
        return Type('enum', params)
    }

    static oneOfType(params: any[]) {
        return Type('union', params)
    }

    static shape(params: any[]) {
        return Type('shape')
    }

    static objectOf() {
        return Type('object')
    }
}

function Type(type: string, params?: any[]) {
    const returnType = {
        type,
        require: false,
        description: ''
    }

    Object.defineProperty(returnType, 'isRequired', {
        get: function() {
            returnType.require = true
            return returnType
        }
    })

    if (type === 'enum' || type === 'union') {
        (<ReturnType>returnType).value = (<any[]>params).map(p => {
            return {
                value: p
            }
        })
    }

    return returnType
}
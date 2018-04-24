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

    static oneOf(params) {
        return Type('enum', params)
    }

    static oneOfType(params) {
        return Type('union', params)
    }

    static shape(params) {
        return Type('shape')
    }

    static objectOf() {
        return Type('object')
    }
}

function Type(type, params) {
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
        returnType.value = params.map(p => {
            return {
                value: p
            }
        })
    }

    return returnType
}
export default class {
    // array: 'array',
    // bool: 'bool',
    // func: '[TYPE]func',
    // number: '[TYPE]number',
    // object: '[TYPE]object',
    // string: '[TYPE]string',
    // symbol: '[TYPE]symbol',
    // oneOf(param) {
    //     return param
    // },
    // oneOfType(param) {
    //     return param
    // }

    static get array() {
        return Type('array')
    }

    static get bool() {
        return Type('bool')
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

    static oneOf(params) {
        return  Type('enum', params)
    }
}

function Type(type, params) {
    const returnType = {
        type,
        require: false
    }

    Object.defineProperty(returnType, 'isRequired', {
        get: function() {
            console.log('hahhahha')
            returnType.require = true
            return returnType
        }
    })

    if (type === 'enum') {
        returnType.value = params.map(p => {
            return {
                value: p
            }
        })
    }

    return returnType
}
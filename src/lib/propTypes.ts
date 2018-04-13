export default {
    array: '[TYPE]array',
    bool: '[TYPE]bool',
    func: '[TYPE]func',
    number: '[TYPE]number',
    object: '[TYPE]object',
    string: '[TYPE]string',
    symbol: '[TYPE]symbol',
    oneOf(param) {
        return param
    },
    oneOfType(param) {
        return param
    }
}
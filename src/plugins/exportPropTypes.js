module.exports = function({ Plugin, types }) {
    console.log(111111)
    return {
        visitor: {
            ImportDeclaration(path) {
                console.log(1)
            },
        }
    }
};
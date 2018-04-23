let comments = {}

export default comments

export function clearComments() {
    for (let key of Object.keys(comments)) {
        delete comments[key]
    }
}

export function addComments(newComments: object) {
    for (let key of Object.keys(newComments)) {
        if (!comments[key]) {
            comments[key] = newComments[key]
        }
    }
}
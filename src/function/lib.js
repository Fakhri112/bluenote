const getColor = (str) => {
    const word = str
    const spliceFirst = word.substring(10)
    const indexUndrsc = spliceFirst.indexOf("_");
    const spliceLast = spliceFirst.slice(0, indexUndrsc)
    return spliceLast
}

const getContentChecklist = (arr) => {
    let todoData = ''
    arr.forEach((val) => {
        todoData += val.todo + ' '
    })
    return todoData
}

const getCurrentDate = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = today.toLocaleString('en-US', { month: 'short' })
    var yyyy = today.getFullYear();

    today = `(${mm} ${dd}, ${yyyy})`
    return today
}

const sessionGet = (key) => {
    let getSession = JSON.parse(sessionStorage.getItem(key))
    return getSession
}

const sessionSet = (key, value) => {
    sessionStorage.setItem(key, JSON.stringify(value))
}

const getPrefixEmail = (email) => {
   
    let index = email.indexOf('@')
    let prefix = email.slice(0, index)
    return prefix
}

module.exports = {
    getColor,
    getContentChecklist,
    getCurrentDate,
    sessionGet,
    sessionSet,
    getPrefixEmail
};
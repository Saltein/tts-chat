/**
 * Конвертирует массив объектов в строку query parameters для URL
 * @param {Object[]} objList - Массив объектов для конвертации. Каждое свойство объекта станет параметром URL
 * @returns {string} Строка параметров в формате `&key1=value1&key2=value2`
 * @example
 * // returns 'name=John&age=25&city=New%20York'
 * convertObjToStr([{name: 'John', age: 25}, {city: 'New York'}])
 */
export const convertObjToStr = (objList = []) => {
    let resultStr = ''
    for (const obj of objList) {
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                resultStr += `&${key}=${encodeURIComponent(obj[key])}`
            }
        }
    }
    return resultStr.slice(1)
}
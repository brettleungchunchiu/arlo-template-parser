const _ =  require('lodash')
const moment = require('moment')

const BLOCK_TAG = 'with'

const getDataByPath = (dataSource, path) => {
    return _.has(dataSource, `${path.join('.')}`) 
        ? path.reduce((data, fieldName) => { return data[fieldName] }, dataSource)
        : ''
}

const apply = (template = '', dataSource = {}) => {
    const dataFieldPath = []
    let result = ''
    
    for (let i = 0; i < template.length; i++) {
        const character = template.charAt(i)
        if (character === '[') {
            const endBlockIndex = _.indexOf(template, ']', i)
            if (endBlockIndex > -1) {
                const blockString  = template.substring(i + 1, endBlockIndex)
                const blockTokens = blockString.split(/\s+/g)

                if (blockTokens.length === 2 && blockTokens[0] === BLOCK_TAG) {
                    dataFieldPath.push(blockTokens[1])
                } else if (blockTokens.length === 1 && blockTokens[0] === `/${BLOCK_TAG}`) {
                    dataFieldPath.pop()
                } else if (blockTokens.length > 0) {
                    const data = getDataByPath(dataSource, [...dataFieldPath, ...blockTokens[0].split('.')])
                    const dateFormat = (blockString.match(/"/g) || []).length === 2 ? blockString.split(/"/)[1] : null
                    result += data instanceof moment ? data.format(dateFormat) : data
                } else {
                    throw `Invalid Block`
                }
                i = endBlockIndex
            } else {
                result += template.substring(i)
                break
            }
        } else {
            result += character
        }
    }

    return result
}

// Block: for your test convenience
const template = `
    [with Contact]
        Hello [FirstName] [LastName]
        [with Organisation]
            You are from [Name] in [City]
        [/with]      
    [/with]
    The current date is [Today "D MMMM YYYY"]
`
const dataSource = {
    Contact: {
        FirstName: 'John',
        LastName: 'Smith',
        Organisation: {
            Name: 'Acme Ltd',
            City: 'Auckland'
        }
    },
    Today: moment('1990-12-01')
}

const output = apply(template, dataSource)
// console.log(output)
// End of Block

module.exports = apply
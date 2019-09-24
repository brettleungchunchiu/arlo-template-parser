const moment = require('moment')
const apply = require('../templateParser/templateEngine')

test('Basic local property substitute', () => {
    const template = 'Hello [name]'
    const dataSource = {
        name: 'John'
    }
    expect(apply(template, dataSource)).toBe('Hello John')
})

test('Scoped property substitute', () => {
    const template = 'Hello [contact.firstName] [contact.lastName]'
    const dataSource = {
        contact: {
            firstName:'John',
            lastName: 'Smith'
        }
    }
    expect(apply(template, dataSource)).toBe('Hello John Smith')
})

test('Spanned local property substitute', () => {
    const template = '[with contact]Hello [firstName] from [with organization][name] in [city][/with][/with]'
    const dataSource = {
        contact: {
            firstName:'John',
            lastName: 'Smith',
            organization: {
                name: 'Acme Ltd',
                city: 'Auckland'
            }
        }
    }
    expect(apply(template, dataSource)).toBe('Hello John from Acme Ltd in Auckland')
})

test('Invalid property substitute', () => {
    const template = 'Hello [InvalidProperty1] [InvalidProperty2] [name]'
    const dataSource = {
        name: 'John'
    }
    expect(apply(template, dataSource)).toBe('Hello   John')
})

test('No property substitute', () => {
    const template = 'Hello there'
    const dataSource = {
        name: 'John'
    }
    expect(apply(template, dataSource)).toBe('Hello there')
})

test('Formatted date property substitute', () => {
    const template = 'The current date is [today \"D MMMM YYYY\"]'
    const dataSource = {
        today: moment('1990-12-01')
    }
    expect(apply(template, dataSource)).toBe('The current date is 1 December 1990')
})

test('Unformattable property substitute', () => {
    const template = 'Hello [name \"D MMMM YYYY\"]'
    const dataSource = {
        name: 'John'
    }
    expect(apply(template, dataSource)).toBe('Hello John')
})
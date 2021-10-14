import axios from 'axios'
import moment from 'moment'
import { accountAPI } from './accountAPI'
import { categoriesAPI } from './categoriesAPI'
import { todosAPI } from './todosAPI'

export const baseURL = 'https://mytodo.azurewebsites.net/api/'
// export const baseURL = 'https://localhost:44352/api/'

export const instance = axios.create({
    baseURL,
    withCredentials: true,
})

console.log(moment().isBefore('2021-10-16'))

instance.interceptors.response.use(originalResponse => {
    stringToMoment(originalResponse.data)
    return originalResponse
})

instance.interceptors.request.use(originalRequest => {
    momentToString(originalRequest.data)
    return originalRequest
})

export const stringToMoment = (body: any) => {
    if (body === null || body === undefined || typeof body !== 'object') return body

    for (const key of Object.keys(body)) {
        const value = body[key]

        if (typeof value === 'string') {
            const date = moment(value, true)

            if (date.isValid()) body[key] = date
        } else if (typeof value === 'object') stringToMoment(value)
    }
}

export const momentToString = (body: any) => {
    if (body === null || body === undefined || typeof body !== 'object') return body

    for (const key of Object.keys(body)) {
        const value = body[key]

        if (typeof value === 'object') {
            if (moment.isMoment(value)) {
                body[key] = value.format('YYYY-MM-DD')
            } else {
                momentToString(value)
            }
        }
    }
}

export const API = {
    account: accountAPI,
    todos: todosAPI,
    categories: categoriesAPI,
}

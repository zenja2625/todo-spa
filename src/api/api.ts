import axios from 'axios'
import moment from 'moment'
import { serverDateFormat } from '../dateFormat'
import { accountAPI } from './accountAPI'
import { categoriesAPI } from './categoriesAPI'
import { todosAPI } from './todosAPI'

export const baseURL = 'https://mytodo.azurewebsites.net/api/'
// export const baseURL = 'https://localhost:44352/api/'

export const instance = axios.create({
    baseURL,
    withCredentials: true,
})

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

        if (key === 'id' && typeof value === 'number') {
            body[key] = value.toString()
        }
        else if (typeof value === 'string') {
            const date = moment(value, true)

            if (date.isValid()) body[key] = date
        } else if (typeof value === 'object') stringToMoment(value)
    }
}

const ids = [ 'id', 'parentId', 'prevTodoId',  ]

export const momentToString = (body: any) => {
    if (body === null || body === undefined || typeof body !== 'object') return body

    for (const key of Object.keys(body)) {
        const value = body[key]
            console.log(key + ' ' + !!ids.find(x => x === key))
        if (!!ids.find(x => x === key) && typeof value === 'string') {
            console.log(key + ' ' + value + ' ' + Number(value))
            const asd = Number(value)
            
            console.log(asd)
            body[key] = asd
            console.log(key)
        }
        else if (typeof value === 'object') {
            if (moment.isMoment(value)) {
                body[key] = value.format(serverDateFormat)
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

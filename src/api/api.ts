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
    if (typeof originalRequest.data === 'object') {
        const body = JSON.parse(JSON.stringify(originalRequest.data))
        momentToString(body)
        originalRequest.data = body
    }

    return originalRequest
})

export const stringToMoment = (body: any) => {
    if (body === null || body === undefined || typeof body !== 'object') return body

    for (const key of Object.keys(body)) {
        const value = body[key]

        if (key === 'isHiddenSubTasks' && typeof value === 'boolean') {
            body[key] = value
            body['isOpen'] = !value
        } else if (key === 'id' && typeof value === 'number') {
            body[key] = value.toString()
        } else if (typeof value === 'string') {
            const date = moment(value, true)

            if (date.isValid()) body[key] = date
        } else if (typeof value === 'object') stringToMoment(value)
    }
}

const ids = ['id', 'parentId', 'prevTodoId']

export const momentToString = (body: any) => {
    if (body === null || body === undefined || typeof body !== 'object') return body

    for (const key of Object.keys(body)) {
        const value = body[key]

        if (key === 'isOpen' && typeof value === 'boolean') {
            body['isHiddenSubTasks'] = !value
        } else if (!!ids.find(x => x === key) && typeof value === 'string') {
            body[key] = Number(value)
        } else if (typeof value === 'object') {
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

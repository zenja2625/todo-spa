import axios from "axios"
import { accountAPI } from "./accountAPI"
import { categoriesAPI } from './categoriesAPI'
import { todosAPI } from './todosAPI'

export const baseURL = 'https://mytodo.azurewebsites.net/api/'

export const instance = axios.create({
    baseURL,
    withCredentials: true
})

export const API = {
    account: accountAPI,
    todos: todosAPI,
    categories: categoriesAPI
}
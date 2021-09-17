import axios from "axios"
import { accountAPI } from "./accountAPI"
import { categoriesAPI } from './categoriesAPI'
import { todosAPI } from './todosAPI'

export const baseURL = 'https://mytodo.azurewebsites.net/api/'
// export const baseURL = 'https://localhost:44352/api/'

export const instance = axios.create({
    baseURL,
    withCredentials: true
})

// instance.interceptors.response.use(originalResponse => {
//     return originalResponse
// })

// const client = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE_URL });

// client.interceptors.response.use(originalResponse => {
//   handleDates(originalResponse.data);
//   return originalResponse;
// });

// export default client;

// const isoDateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d*)?$/;

// function isIsoDateString(value: any): boolean {
//   return value && typeof value === "string" && isoDateFormat.test(value);
// }

// export function handleDates(body: any) {
//   if (body === null || body === undefined || typeof body !== "object")
//     return body;

//   for (const key of Object.keys(body)) {
//     const value = body[key];
//     if (isIsoDateString(value)) body[key] = parseISO(value);
//     else if (typeof value === "object") handleDates(value);
//   }
// }

export const API = {
    account: accountAPI,
    todos: todosAPI,
    categories: categoriesAPI
}
import { combineReducers } from 'redux'
import { accountReducer } from './acountReducer'
import { toDoReducer } from './todoReducer'
import { ApplicationState } from './types'

export const reducers = combineReducers<ApplicationState>({
     account: accountReducer,
     todos: toDoReducer
})


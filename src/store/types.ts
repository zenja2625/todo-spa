export const ADD_TODO = 'ADD_TODO'
export const DELETE_TODO = 'DELETE_TODO'
export const CHECK_TODO = 'CHECK_TODO'

export interface ToDo {
    Id: number
    Value: string
    IsDone: boolean
}

export interface ToDoState {
    todos: ToDo[]
    todoId: number
}

interface AddToDoAction {
    type: typeof ADD_TODO
}

interface DeleteToDoAction {
    type: typeof DELETE_TODO
    todoId: number
}

interface CheckToDoAction {
    type: typeof CHECK_TODO
    todoId: number
}

export type ToDoActionTypes = AddToDoAction | DeleteToDoAction | CheckToDoAction
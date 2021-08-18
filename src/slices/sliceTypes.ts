import { todoStatusDTO } from '../api/apiTypes'

export type AppType = {
    initialized: boolean
    requestCount: number
}

export type AccountType = {
    username: string
    isAuth: boolean
}

export type Category = {
    id: number
    name: string
}

export interface TodoDTO {
    id: number
    value: string
    isDone: boolean
    isHiddenSubTasks: boolean
    depth: number
    taskEnd?: string
}

export interface Todo extends TodoDTO {
    showHideButton: boolean
}

export type TodoMoveType = {
    id: string
    prevTodoId: number | null
    depth: number
}

export type CategoriesType = {
    categories: Array<Category>
    selectedCategoryId: number
}

export type TodosType = {
    todos: Array<TodoDTO>
    todoStatusDTOs: Array<todoStatusDTO>
    draggedTodos: Array<TodoDTO>
}

export type UpdateStatusesType = {
    todoStatusDTOs: Array<todoStatusDTO>
    categoryId: number
}

export type RejectValueType = {
    rejectValue: string
}

export type ChangeTodoPositionType = {
    todoId: number
    prevTodoId: number | null
    depth: number
}

import { todoStatusDTO } from '../api/apiTypes'

export type AppType = {
    initialized: boolean,
    requestCount: number
}

export type AccountType = {
    username: string,
    isAuth: boolean
}

export type Category = {
    id: number,
    name: string
}

export type Todo = {
    id: number,
    value: string,
    isDone: boolean,
    isHiddenSubTasks: boolean,
    depth: number,
    taskEnd?: string
}

export type CategoriesType = {
    categories: Array<Category>,
    selectedCategoryId: number
}

export type TodosType = {
    todos: Array<Todo>,
    todoStatusDTOs: Array<todoStatusDTO>,
    draggedTodos: Array<Todo>
}

export type UpdateStatusesType = {
    todoStatusDTOs: Array<todoStatusDTO>,
    categoryId: number 
}

export type RejectValueType = {
    rejectValue: string
}

export type ChangeTodoPositionType = {
    todoId: number,
    selectedTodoId: number,
    depth: number
}
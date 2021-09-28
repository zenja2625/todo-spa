import { TodoPositionDTO, TodoStatusDTO } from '../api/apiTypes'
import { TodoEditorValueType } from '../containers/containerTypes'
import { RootState } from '../store'

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


export type PutTodoDTO = {
    value: string
    taskEnd?: string
}

// export type TodoMoveType = {
//     id: string
//     overTodoId: number
//     depth: number
// }

export type CategoriesType = {
    categories: Array<Category>
    selectedCategoryId: number
}

export type TodoEditorType = {
    isEditorOpen: boolean
    editTodoId?: number
    prevTodoId?: number
    addBefore?: boolean
}

export type TodoDragType = {
    draggedTodo?: TodoDTO
    draggedTodoDepth?: number
}

export type TodosType = {
    todos: Array<TodoDTO>
    todoStatusDTOs: { [id: number]: TodoStatusDTO }
    todoPositionDTOs: Array<TodoPositionDTO>
    draggedTodo: Todo | null
    todoEditor: TodoEditorType
    todoDrag: TodoDragType
}

export type UpdateStatusesType = {
    todoStatusDTOs: Array<TodoStatusDTO>
    categoryId: number
}

export type UpdatePositionsType = {
    todoPositionDTOs: Array<TodoPositionDTO>
    categoryId: number
}

export type CreateTodoProps = {
    categoryId: number
    todoValue: TodoEditorValueType
    prevTodoId?: number
    addBefore?: boolean
}

export type updateTodoDragDepthProps = {
    overTodoId: number
    offsetLeft: number
}

export type RejectValueType = {
    rejectValue: string
}

export type ChangeTodoPositionType = {
    todoId: number
    prevTodoId: number | null
    depth: number
}

export interface IState {
    state: RootState
}

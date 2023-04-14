import { TodoPositionDTO, TodoStatusDTO } from '../api/apiTypes'
import { TodoEditorValueType } from '../containers/containerTypes'
import { RootState } from '../store'
import { Moment } from 'moment'
import { Coors } from '../Tree/types'

export type AppType = {
    initialized: boolean
    requestCount: number
    siderCollapsed: boolean
}

export type AccountType = {
    username: string
    isAuth: boolean
}

export type Category = {
    id: string
    name: string
}

export interface TodoDTO {
    id: string
    value: string
    isDone: boolean
    isOpen: boolean
    depth: number
    taskEnd?: Moment
}

export interface Todo extends TodoDTO {
    showHideButton: boolean
}

export type PutTodoDTO = {
    value: string
    taskEnd?: Moment
}

export interface IEditor<T> {
    isOpen: boolean
    value: T
    editId?: string
}

export interface ITodoEditor extends IEditor<TodoEditorValueType> {
    overId?: string
    addBefore?: boolean
}

export type CategoriesType = {
    items: Array<Category>
    editor: IEditor<string>
    showCompletedTodos: boolean
}

export type TodoDragType = {
    //?????????????
    draggedTodo?: TodoDTO
    draggedTodoDepth?: number
}

export type TodosType = {
    items: Array<TodoDTO>
    todoStatusDTOs: Array<TodoStatusDTO>
    todoPositionDTOs: Array<TodoPositionDTO>
    todoEditor: ITodoEditor
    draggedTodo: {
        activeIndex: number
        overIndex: number
        depth: number
        initialPosition: Coors
    }
    todosRequestId: string | null
}

export type DragStartType = {
    activeIndex: number
    depth: number
    initialPosition: Coors
}

export type openCategoryEditorProps = {
    value?: string
    editId?: string
}

export type OpenTodoEditorProps = {
    value?: TodoEditorValueType
    editId?: string
    overId?: string
    addBefore?: boolean
}

export type UpdateStatusesType = {
    todoStatusDTOs: Array<TodoStatusDTO>
    categoryId: string
}

export type UpdatePositionsType = {
    todoPositionDTOs: Array<TodoPositionDTO>
    categoryId: string
}

export type CreateTodoProps = {
    categoryId: string
    todoValue: TodoEditorValueType
    overId?: string
    addBefore?: boolean
}

export type updateTodoDragDepthProps = {
    overTodoId: string
    offsetLeft: number
}

export type RejectValueType = {
    rejectValue: string
}

export type ChangeTodoPositionType = {
    todoId: string
    prevTodoId: string | null
    depth: number
}

export interface IState {
    state: RootState
}

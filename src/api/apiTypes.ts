import { Moment } from 'moment'

export type UserLoginDTO = {
    name: string;
    password: string;
}
export type UserRegisterDTO = {
    name: string,
    password: string,
    confirmPassword: string
}
export type TodoPostDTO = {
    value: string,
    parentId: number,
    prevTodoId: number,
    taskEnd?: Moment
}
export type TodoPutDTO = {
    value: string,
    taskEnd?: Moment
}
export type TodoStatusDTO = {
    id: number,
    isDone?: boolean,
    isHiddenSubTasks?: boolean
}
export type TodoPositionDTO = {
    id: number,
    parentId: number,
    prevTodoId: number
}
export type CategoryRequestDTO = {
    name: string
}
export type UserLoginDTO = {
    Name: string;
    Password: string;
}
export type UserRegisterDTO = {
    Name: string,
    Password: string,
    ConfirmPassword: string
}
export type TodoPostDTO = {
    value: string,
    parentId: number,
    prevTodoId: number,
    taskEnd?: Date
}
export type TodoPutDTO = {
    Value: string,
    TaskEnd?: Date
}
export type TodoStatusDTO = {
    id: number,
    isDone?: boolean,
    isHiddenSubTasks?: boolean
}
export type TodoPositionDTO = {
    Id: number,
    ParentId: number,
    PrevToDoId: number
}
export type CategoryRequestDTO = {
    Name: string
}
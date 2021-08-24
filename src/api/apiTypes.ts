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
    Value: string,
    ParentId: number,
    PrevToDoId: number,
    TaskEnd?: Date
}
export type TodoPutDTO = {
    Value: string,
    TaskEnd?: Date
}
export type TodoStatusDTO = {
    id: number,
    isDone?: boolean,
    isHiddenSubTodo?: boolean
}
export type TodoPositionDTO = {
    Id: number,
    ParentId: number,
    PrevToDoId: number
}
export type CategoryRequestDTO = {
    Name: string
}
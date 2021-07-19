export type UserLoginDTO = {
    Name: string;
    Password: string;
}
export type UserRegisterDTO = {
    Name: string,
    Password: string,
    ConfirmPassword: string
}
export type todoPostDTO = {
    Value: string,
    ParentId: number,
    PrevToDoId: number,
    TaskEnd?: Date
}
export type todoPutDTO = {
    Value: string,
    TaskEnd?: Date
}
export type todoStatusDTO = {
    id: number,
    isDone?: boolean,
    isHiddenSubTodo?: boolean
}
export type todoPositionDTO = {
    Id: number,
    ParentId: number,
    PrevToDoId: number
}
export type categoryRequestDTO = {
    Name: string
}
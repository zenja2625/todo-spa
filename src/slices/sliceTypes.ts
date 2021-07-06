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
    todos: Array<Todo>
}

export type RejectValueType = {
    rejectValue: string
}
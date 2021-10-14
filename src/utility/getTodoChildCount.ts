import { ITodo } from './getTodoDepth'

export const getTodoChildCount = (todos: Array<ITodo>, index: number) => {
    let count = 0
    for (let i = index + 1; i < todos.length && todos[index].depth < todos[i].depth; i++) count++

    return count
}
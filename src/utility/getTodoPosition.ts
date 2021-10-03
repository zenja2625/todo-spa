import { ITodo } from './getTodoDepth'

export const getTodoPosition = (
    todos: Array<ITodo>,
    actualPrevTodoIndex: number = -1,
    actualTodoDepth: number = 0,
    actualTodoIndex: number = -1
) => {
    let parentId = 0
    let prevTodoId = 0

    for (let i = actualPrevTodoIndex; i >= 0; i--) {
        const todo = todos[i]

        if (actualTodoIndex !== -1 && todo.id === todos[actualTodoIndex].id) continue
        if (actualTodoDepth === 0 && prevTodoId) break
        if (todo.depth < actualTodoDepth) {
            parentId = todos[i].id
            break
        } else if (todo.depth === actualTodoDepth && !prevTodoId) prevTodoId = todo.id
    }

    return { parentId, prevTodoId }
}

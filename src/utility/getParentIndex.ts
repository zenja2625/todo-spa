import { ITodo } from './getTodoDepth'

export const getParentIndex = (todos: Array<ITodo>, index: number) => {
    for (let i = index - 1; i >= 0; i--) {
        if (todos[index].depth > todos[i].depth) {
            return i
        }
    }

    return -1
}
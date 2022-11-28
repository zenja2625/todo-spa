import { getTodoChildCount } from './getTodoChildCount'

export interface ITodo {
    id: string
    depth: number
}

export const getTodoDepth = (
    todos: Array<ITodo>,
    activeIndex: number,
    overIndex: number,
    deltaX: number,
    depthIndent: number
) => {
    const childCount = getTodoChildCount(todos, activeIndex)
    const prevIndex = activeIndex >= overIndex ? overIndex - 1 : overIndex
    const nextIndex = activeIndex <= overIndex ? overIndex + childCount + 1 : overIndex

    const maxDepth = prevIndex >= 0 ? todos[prevIndex].depth + 1 : 0
    const minDepth = nextIndex < todos.length ? todos[nextIndex].depth : 0

    if (depthIndent <= 0) return todos[activeIndex].depth

    const actualDepth = todos[activeIndex].depth + Math.floor(deltaX / depthIndent)

    return actualDepth < minDepth ? minDepth : actualDepth > maxDepth ? maxDepth : actualDepth
}

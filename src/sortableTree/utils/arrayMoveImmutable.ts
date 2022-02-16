import { TreeItem } from '../types'

export const arrayMoveImmutable = <T extends TreeItem>(
    items: Array<T>,
    from: number,
    to: number,
    childCount: number,
    depthDelta: number,
    maxDepth: number
) => {
    const newItems = [...items]
    const activeItems = newItems.splice(from, childCount + 1).map(item => {
        const newDepth = item.depth + depthDelta
        return { ...item, depth: newDepth > maxDepth ? maxDepth : newDepth }
    })
    newItems.splice(to, 0, ...activeItems)

    return newItems
}

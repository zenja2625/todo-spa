import { useCallback } from 'react'
import { TreeItem } from '../types'

export const useItemDepth = (
    items: Array<TreeItem>,
    activeIndex: number,
    depth: number,
    childCount: number,
    maxDepth: number
) => {
    const newDepth = useCallback(
        (newDepth: number) => {
            const fraction = (depth - newDepth) % 1

            const direction = fraction >= 0 ? 1 : -1

            return fraction >= 0.6 * direction ? Math.floor(newDepth) : Math.ceil(newDepth)
        },
        [depth]
    )

    return useCallback(
        (overIndex: number, depthDelta: number) => {
            const prevIndex = activeIndex >= overIndex ? overIndex - 1 : overIndex + childCount
            const nextIndex = activeIndex <= overIndex ? overIndex + childCount + 1 : overIndex

            const prevDepth = prevIndex >= 0 ? items[prevIndex].depth + 1 : 0
            const currentMaxDepth = prevDepth <= maxDepth ? prevDepth : maxDepth
            const currentMinDepth = nextIndex < items.length ? items[nextIndex].depth : 0

            const initDepth = items[activeIndex].depth
            const actualDepth = newDepth(initDepth + depthDelta)

            return actualDepth < currentMinDepth
                ? currentMinDepth
                : actualDepth > currentMaxDepth
                ? currentMaxDepth
                : actualDepth
        },
        [items, activeIndex, maxDepth, childCount, newDepth]
    )
}

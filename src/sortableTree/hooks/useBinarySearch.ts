import { useCallback, useMemo } from 'react'

export const useBinarySearch = (
    list: HTMLCollection | undefined,
    activeIndex: number,
    overIndex: number,
    childCount: number
) => {
    const getSortedRect = useCallback(
        (index: number): DOMRect => {
            if (list && index >= 0 && index < list.length) {
                const sortedIndex =
                    index === overIndex
                        ? activeIndex
                        : index >= activeIndex && index < overIndex
                        ? index + 1
                        : index <= activeIndex && index > overIndex
                        ? index - 1
                        : index

                return list[
                    sortedIndex > activeIndex ? sortedIndex + childCount : sortedIndex
                ].getBoundingClientRect()
            }

            return new DOMRect()
        },
        [activeIndex, overIndex, childCount, list]
    )

    const getCenter = useCallback(
        (index: number) => {
            const { top, height } = getSortedRect(index)
            return top + height / 2
        },
        [getSortedRect]
    )

    const compareIsYHigher = useCallback(
        (y: number, itemIndex: number) => getCenter(itemIndex) > y,
        [getCenter]
    )

    const binarySearch = useCallback(
        (start: number, end: number, y: number, isTop: boolean): number => {
            if (start === end) return start

            if (end - 1 === start) return compareIsYHigher(y, isTop ? start : end) ? start : end

            const index = Math.floor((start + end) / 2)

            if (compareIsYHigher(y, index)) {
                return binarySearch(start, index, y, isTop)
            } else {
                return binarySearch(index, end, y, isTop)
            }
        },
        [compareIsYHigher]
    )

    const activeHeight = useMemo(
        () => getSortedRect(activeIndex).height,
        [activeIndex, getSortedRect]
    )

    return useCallback(
        (y: number, lastIndex: number) => {
            const center = y + activeHeight / 2
            const isTop = compareIsYHigher(center, overIndex)

            return binarySearch(0, lastIndex, isTop ? y : y + activeHeight, isTop)
        },
        [binarySearch, compareIsYHigher, activeHeight, overIndex]
    )
}

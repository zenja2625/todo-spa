import React, { useCallback } from 'react'
import { Action, State } from './reducer'
import { useListeners } from './useListeners'
import { getCoordinates } from './getCoordinates'
import { Coors } from './types'

const getRoundedValue = (delta: number, active: number, limit: number, max: number, min = 0) => {
    const value = active + (delta >= 0 ? Math.floor(delta + limit) : Math.ceil(delta - limit))

    return value > max ? max : value < min ? min : value
}

export const useDnd = (
    state: State,
    dispath: React.Dispatch<Action>,
    height: number,
    gap: number,
    wrapper: HTMLElement | null,
    shift: Coors,
    maxDepth: number
) => {
    const {
        activeIndex,
        overIndex,
        order,
        activeDepth,
    } = state

    const onMove = useCallback(
        ({ x, y }: Coors) => {
            const { x: dx = 0, y: dy = 0 } = wrapper?.getBoundingClientRect() || {}

            const offsetY = y - dy - shift.y
            const index = getRoundedValue(
                offsetY / (height + gap) - overIndex,
                overIndex,
                0.5 - gap / (height + gap) / 2,
                order.length - 1
            )

            const prevIndex = activeIndex >= index ? index - 1 : index
            const nextIndex = activeIndex <= index ? index + 1 : index

            const prevDepth = order[prevIndex]?.depth + 1 || 0
            const max = prevDepth > maxDepth ? maxDepth : prevDepth
            const min = order[nextIndex]?.depth || 0

            const offsetX = x - shift.x - dx
            const depth = getRoundedValue(offsetX / 30 - activeDepth, activeDepth, 0.3, max, min)

            dispath({
                type: 'move',
                payload: {
                    index,
                    depth,
                },
            })
        },
        [wrapper, shift, height, gap,maxDepth, activeDepth, activeIndex, overIndex, order, dispath]
    )

    const dragEnd = useCallback(() => {
        dispath({ type: 'dragEnd' })
    }, [dispath])

    useListeners(activeIndex !== -1, onMove, dragEnd)

    const dragStart = useCallback(
        (id: string) => (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault()
            const { x, y } = getCoordinates(e.nativeEvent)

            dispath({
                type: 'dragStart',
                payload: {
                    id,
                    initialPosition: { x, y },
                },
            })
        },
        [dispath]
    )

    return dragStart
}

import React, { useCallback } from 'react'
import { Action, State } from './reducer'
import { useListeners } from './useListeners'
import { getCoordinates } from './getCoordinates'
import { Coors } from './types'
import { useAppDispatch } from '../store'
import { moveTodo, setDragShift, startDragTodo, stopDragTodo } from '../slices/todosSlice'

const getLimitValue = (delta: number, active: number, limit: number, max: number, min = 0) => {
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
    maxDepth: number,
    depthWidth: number,
    initialPosition: Coors
) => {
    const { activeIndex, overIndex, order: items, activeDepth } = state

    const appDispath = useAppDispatch()

    const onMove = useCallback(
        ({ x, y }: Coors) => {
            const { x: dx = 0, y: dy = 0 } = wrapper?.getBoundingClientRect() || {}

            const overCenterY = (overIndex - activeIndex) * (height + gap)
            const offsetY1 = y - initialPosition.y

            console.log(`${overCenterY} ${offsetY1}`)

            const offsetY = y - dy - shift.y
            const index = getLimitValue(
                offsetY / (height + gap) - overIndex,
                overIndex,
                0.5 - gap / (height + gap) / 2,
                items.length - 1
            )

            const prevIndex = activeIndex >= index ? index - 1 : index
            const nextIndex = activeIndex <= index ? index + 1 : index

            const prevDepth = items[prevIndex]?.depth + 1 || 0
            const max = prevDepth > maxDepth ? maxDepth : prevDepth
            const min = items[nextIndex]?.depth || 0

            const offsetX = x - shift.x - dx
            const depth = getLimitValue(
                offsetX / depthWidth - activeDepth,
                activeDepth,
                0.3,
                max,
                min
            )

            const initialDepth = items[activeIndex].depth

            appDispath(setDragShift({ x: depth - initialDepth, y: index - activeIndex }))

            // dispath({
            //     type: 'move',
            //     payload: {
            //         index,
            //         depth,
            //     },
            // })
        },
        [wrapper, shift, height, gap, maxDepth, activeDepth, activeIndex, overIndex, items, initialPosition, dispath]
    )

    const dragEnd = useCallback(() => {
        document.body.style.cursor = ''
        appDispath(
            moveTodo({
                id: items[activeIndex].id,
                overId: items[overIndex].id,
                actualDepth: activeDepth,
            })
        )
        appDispath(stopDragTodo())
        dispath({ type: 'dragEnd' })
    }, [dispath, appDispath, activeDepth, activeIndex, overIndex, items])

    useListeners(activeIndex !== -1, onMove, dragEnd)

    const dragStart = useCallback(
        (id: string) => (e: React.MouseEvent | React.TouchEvent) => {
            e.preventDefault()
            document.body.style.cursor = 'move'
            const initialPosition = getCoordinates(e.nativeEvent)
            appDispath(startDragTodo({ dragId: id, initialPosition }))
        },
        [appDispath]
    )

    return dragStart
}

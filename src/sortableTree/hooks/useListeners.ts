import { useCallback, useEffect } from 'react'
import { Coors } from '../types'
import { getCoordinates } from '../utils/getCoordinates'

export const useListeners = (
    isMove: boolean,
    setCoors: (coors: Coors) => void,
    dragEnd?: () => void,
    onCancel?: () => void
) => {
    const move = useCallback(
        (event: Event) => {
            setCoors(getCoordinates(event))
        },
        [setCoors]
    )

    const cancel = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === 'Escape' && onCancel) onCancel()
        },
        [onCancel]
    )

    useEffect(() => {
        if (isMove) {
            window.addEventListener('mousemove', move)
            window.addEventListener('touchmove', move)
            if (dragEnd) {
                window.addEventListener('mouseup', dragEnd)
                window.addEventListener('touchend', dragEnd)
            }
            window.addEventListener('keydown', cancel)
        }

        return () => {
            window.removeEventListener('mousemove', move)
            window.removeEventListener('touchmove', move)
            if (dragEnd) {
                window.removeEventListener('mouseup', dragEnd)
                window.removeEventListener('touchend', dragEnd)
            }
            window.removeEventListener('keydown', cancel)
        }
    }, [isMove, move, dragEnd, cancel])
}

import { useCallback, useEffect, useRef } from 'react'
import { Coors } from './types'
import { getCoordinates } from './getCoordinates'

export const useListeners = (
    isActive: boolean,
    setCoors: (coors: Coors) => void,
    dragEnd?: () => void,
    onCancel?: () => void
) => {
    const touchTargetRef = useRef<EventTarget | null>(null)

    const onMove = useCallback(
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

    const touchEnd = useCallback(
        (e: Event) => {
            e.preventDefault()
            touchTargetRef.current = null
            dragEnd?.()
        },
        [dragEnd]
    )

    const touchStart = useCallback(
        (e: TouchEvent) => {
            touchTargetRef.current = e.target
            // e.target?.addEventListener("touchmove", function(event) {
            //     event.preventDefault();
            //   }, false);
            // e.target?.addEventListener('touchmove', onMove)
            // e.target?.addEventListener('touchend', touchEnd)
        },
        [onMove, touchEnd]
    )

    useEffect(() => {
        window.addEventListener('touchstart', touchStart)

        if (isActive) {
            window.addEventListener('mousemove', onMove)
            // window.addEventListener('touchstart', touchStart)
            window.addEventListener('keydown', cancel)
            dragEnd && window.addEventListener('mouseup', dragEnd)
            if (touchTargetRef.current) {
                touchTargetRef.current.addEventListener('touchmove', onMove)
                touchTargetRef.current.addEventListener('touchend', touchEnd)
            }
        }
        return () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('touchstart', touchStart)
            window.removeEventListener('keydown', cancel)
            dragEnd && window.removeEventListener('mouseup', dragEnd)
            if (touchTargetRef.current) {
                touchTargetRef.current.removeEventListener('touchmove', onMove)
                touchTargetRef.current.removeEventListener('touchend', touchEnd)
            }
        }
    }, [isActive, onMove, dragEnd, cancel, touchStart, touchEnd])
}

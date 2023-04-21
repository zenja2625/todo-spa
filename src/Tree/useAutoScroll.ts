import { MutableRefObject, RefObject, useCallback, useEffect, useRef } from 'react'
import { FixedSizeList as List } from 'react-window'
import { useListeners } from './useListeners'
import { Coors } from './types'

type Direction = -1 | 0 | 1

export const useAutoScroll = (
    active: boolean,
    offset: number,
    innerRef: RefObject<HTMLDivElement>,
    outerRef: RefObject<HTMLDivElement>,
) => {
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const directionRef = useRef<Direction>(0)

    const stopScroll = useCallback(() => {
        if (!intervalRef.current) return

        clearInterval(intervalRef.current)
        directionRef.current = 0
    }, [])

    useEffect(() => {
        if (!active) stopScroll()
    }, [active, stopScroll])

    const scroll = useCallback(() => {
        console.log(directionRef.current)

        outerRef.current?.scrollBy(0, directionRef.current * 8)
    }, [outerRef])

    const startScroll = useCallback(
        (direction: Direction, delay: number) => {
            if (directionRef.current !== direction) {
                if (intervalRef.current !== null) {
                    clearInterval(intervalRef.current)
                }

                directionRef.current = direction
                scroll()
                intervalRef.current = setInterval(scroll, delay)
            }
        },
        [scroll]
    )

    const onMove = useCallback(
        ({ y }: Coors) => {
            if (!innerRef.current || !outerRef.current) return

            const scrollTop = outerRef.current.scrollTop
            const innerY = innerRef.current.getBoundingClientRect().y
            const outerBottom = outerRef.current.getBoundingClientRect().bottom

            const top = innerY + scrollTop + offset
            const bottom = outerBottom - offset - window.outerHeight + window.innerHeight

            if (y < top) {
                startScroll(-1, 10)
            } else if (y > bottom) {
                startScroll(1, 10)
            } else {
                stopScroll()
            }
        },
        [innerRef, outerRef, offset, scroll, startScroll, stopScroll]
    )

    useListeners(active, onMove, () => {})
}

import { useCallback, useEffect, useRef } from 'react'
import { Coors, Direction } from '../types'
import { getScrollable } from '../utils/getScrollable'
import { useListeners } from './useListeners'

export const useAutoScroll = (
    wrapper: HTMLElement | null,
    isScroll: boolean = true,
    threshold: number = 0.08,
    speed: number = 25
) => {
    const scrollWrapper = useRef<HTMLElement | null>(null)
    const timeoutId = useRef<ReturnType<typeof setInterval> | null>(null)
    const direction = useRef<Direction>(1)

    const stopScroll = useCallback(() => {
        if (timeoutId.current) {
            clearInterval(timeoutId.current)
            timeoutId.current = null
        }
    }, [])

    useEffect(() => {
        if (!isScroll) stopScroll()
    }, [isScroll, stopScroll])

    const canScroll = useCallback(() => {
        const wrapper = scrollWrapper.current

        if (wrapper) {
            return direction.current === -1
                ? wrapper.scrollTop > 0
                : wrapper.clientHeight + wrapper.scrollTop < wrapper.scrollHeight
        }

        return false
    }, [])

    const scroll = useCallback(() => {
        if (scrollWrapper.current) {
            scrollWrapper.current.scrollBy(0, speed * direction.current)
            if (!canScroll()) stopScroll()
        }
    }, [speed, canScroll, stopScroll])

    const onMove = useCallback(
        ({ y }: Coors) => {
            if (!scrollWrapper.current) {
                if (wrapper) scrollWrapper.current = getScrollable(wrapper)
                if (!scrollWrapper.current) return
            }

            const piece = y / scrollWrapper.current.clientHeight

            if (piece <= threshold || piece >= 1 - threshold) {
                direction.current = piece <= threshold ? -1 : 1

                if (!timeoutId.current && canScroll()) {
                    timeoutId.current = setInterval(scroll, 50)
                }
            } else stopScroll()
        },
        [wrapper, threshold, scroll, canScroll, stopScroll]
    )

    useListeners(isScroll, onMove)
}

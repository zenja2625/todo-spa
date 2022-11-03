import { useLayoutEffect } from 'react'
import { ItemRef } from '../types'

export const useTreeStyle = (
    list: ItemRef[] | undefined,
    activeIndex: number,
    overIndex: number,
    depth: number,
    activeDepth: number,
    depthIndent: number,
    childCount: number
) => {
    useLayoutEffect(() => {
        if (list && activeIndex >= 0 && activeIndex < list.length) {
            const lastChildIndex = activeIndex + childCount

            for (let i = list.length - 1; i >= 0; i--) {
                const children = list[i].ref.current

                if (children instanceof HTMLElement) {
                    if (i === activeIndex) children.classList.add('selectedItem')

                    if (i > activeIndex && i <= lastChildIndex) children.style.display = 'none'
                    else {
                        const order = i > lastChildIndex ? i - childCount : i
                        children.style.order = (2 * order + 1).toString()
                    }
                }
            }
        }

        return () => {
            if (list && activeIndex >= 0 && activeIndex < list.length) {
                for (let i = list.length - 1; i >= 0; i--) {
                    const children = list[i].ref.current

                    if (children instanceof HTMLElement) {
                        children.style.order = ''
                        children.style.display = ''
                        if (i === activeIndex) {
                            children.classList.remove('selectedItem')
                            children.style.marginLeft = `${depthIndent * activeDepth}px`
                        }
                    }
                }
            }
        }
    }, [list, activeIndex, activeDepth, depthIndent, childCount])

    useLayoutEffect(() => {
        if (list && activeIndex >= 0 && activeIndex < list.length) {
            const active = list[activeIndex].ref.current

            if (active instanceof HTMLElement) {
                const order = activeIndex < overIndex ? overIndex + 1 : overIndex

                active.style.order = (2 * order).toString()
                active.style.marginLeft = `${depthIndent * depth}px`
            }
        }
    }, [list, overIndex, depth, depthIndent, activeIndex])
}

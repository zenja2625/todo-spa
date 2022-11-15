import { Coors } from './types'

export const getItemPosition = (
    wrapper: HTMLElement | null,
    itemHeight: number,
    initialScrollTop: number,
    depth: number,
    depthWidth: number,
    initialCoors: Coors,
    coors: Coors
): Coors => {
    const { x, y } = wrapper ? wrapper.getBoundingClientRect() : { x: 0, y: 0 }

    // debugger
    return {
        x: coors.x - initialCoors.x + x + depth * depthWidth,
        y: coors.y - (initialCoors.y + y - itemHeight * initialScrollTop),
    }
}

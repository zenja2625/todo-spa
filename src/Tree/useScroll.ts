import { useEffect } from 'react'

export const useScroll = (onScroll: (e: WheelEvent) => void) => {
    useEffect(() => {
        // const scroll = (e: WheelEvent) => {
        //     // setStartIndex(prev => {
        //     //     const direction = e.deltaY > 0 ? 1 : -1

        //     //     const index = prev + direction
        //     //     return index < 0
        //     //         ? 0
        //     //         : index > length - itemsOnScreen
        //     //         ? length - itemsOnScreen
        //     //         : index
        //     // })
        // }

        window.addEventListener('wheel', onScroll)

        return () => {
            window.removeEventListener('wheel', onScroll)
        }
    }, [onScroll])
}

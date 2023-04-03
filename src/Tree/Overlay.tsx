import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useAppSelector } from '../store'
// import { Item } from './Item'
import { Coors, OverlayProps } from './types'
import { useListeners } from './useListeners'

export const Overlay: FC<OverlayProps> = ({ children, initialCoors, itemHeight, itemWidth }) => {
    const initialPosition = useAppSelector(state => state.todos.draggedTodo.initialPosition)

    const [coors, setCoors] = useState<Coors>(() => ({
        x: initialPosition.x,
        y: initialPosition.y,
    }))

    useEffect(() => {}, [coors])

    const getCoors = useCallback((coors: Coors) => {
        setCoors({ x: coors.x, y: coors.y })
    }, [])

    useListeners(true, getCoors)

    const style: React.CSSProperties = useMemo(
        () => ({
            position: 'fixed',
            top: initialCoors.y,
            left: initialCoors.x,
            transform: `translate(${0}px, ${0}px)`,
            //backgroundColor: 'pink',
            width: `${itemWidth}px`,
            height: `${itemHeight}px`,
            zIndex: 1000,
            // visibility: 'hidden'
        }),
        [coors, itemHeight, itemWidth]
    )

    return (
        <div style={{ transform: `translate(${0}px, ${0}px)`, ...style }}>
            {children}
            {/* <Item id={id} depth={0} isOpen={isOpen} /> */}
        </div>
    )
}

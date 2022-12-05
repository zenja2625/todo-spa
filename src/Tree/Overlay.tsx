import { FC, useCallback, useEffect, useMemo, useState } from 'react'
// import { Item } from './Item'
import { Coors, OverlayProps } from './types'
import { useListeners } from './useListeners'

export const Overlay: FC<OverlayProps> = ({
    id,
    isOpen,
    initialPosition,
    itemWidth,
    itemHeight,
    shift,
    children
}) => {
    const [coors, setCoors] = useState<Coors>(() => ({
        x: initialPosition.x - shift.x,
        y: initialPosition.y - shift.y,
    }))

    useEffect(() => {}, [coors])

    const getCoors = useCallback(
        (coors: Coors) => {
            setCoors({ x: coors.x - shift.x, y: coors.y - shift.y })
        },
        [shift]
    )

    useListeners(true, getCoors)

    const style: React.CSSProperties = useMemo(
        () => ({
            position: 'fixed',
            top: coors.y,
            left: coors.x,
            //backgroundColor: 'pink',
            width: `${itemWidth}px`,
            height: `${itemHeight}px`,
            zIndex: 1000,
            // visibility: 'hidden'
        }),
        [coors, itemHeight, itemWidth]
    )

    return (
        <div style={style}>
            {children}
            {/* <Item id={id} depth={0} isOpen={isOpen} /> */}
        </div>
    )
}

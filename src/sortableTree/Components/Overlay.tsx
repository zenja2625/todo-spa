import { CSSProperties, FC, useCallback, useState } from 'react'
import { useListeners } from '../hooks/useListeners'
import { Coors, OverlayProps } from '../types'

export const Overlay: FC<OverlayProps> = ({ initialCoors, shift, width, children }) => {
    const [{ x, y }, setCoors] = useState<Coors>(initialCoors)

    const onMove = useCallback(
        (coors: Coors) => {
            setCoors({
                x: coors.x - shift.x,
                y: coors.y - shift.y,
            })
        },
        [shift]
    )

    useListeners(true, onMove)

    const style: CSSProperties = {
        position: 'fixed',
        top: y,
        left: x,
        width: width + 'px',
    }

    return (
        <div style={style}>
            {children}
        </div>
    )
}

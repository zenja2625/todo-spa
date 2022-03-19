import { useCallback, useMemo } from 'react'
import { PropsWithChildren, useRef, useReducer } from 'react'
import { useAutoScroll } from '../hooks/useAutoScroll'
import { useBinarySearch } from '../hooks/useBinarySearch'
import { useItemDepth } from '../hooks/useItemDepth'
import { useListeners } from '../hooks/useListeners'
import { useTreeStyle } from '../hooks/useTreeStyle'
import { initialState, reducer } from '../reducer/reducer'
import { Coors, SyntheticEvents, TreeItem, TreeProps } from '../types'
import { arrayMoveImmutable } from '../utils/arrayMoveImmutable'
import { getCoordinates } from '../utils/getCoordinates'
import { getItemChildCount } from '../utils/getItemChildCount'
import { Overlay } from './Overlay'
import '../style.css'

export const Tree = <T extends TreeItem>({
    items,
    depthIndent,
    maxDepth,
    renderItem,
    onDragEnd,
}: PropsWithChildren<TreeProps<T>>) => {
    const ref = useRef<HTMLDivElement>(null)
    const [state, dispath] = useReducer(reducer, initialState)

    useAutoScroll(ref.current, state.activeIndex !== -1)

    useTreeStyle(
        ref.current?.children,
        state.activeIndex,
        state.overIndex,
        state.depth,
        state.activeDepth,
        depthIndent,
        state.childCount
    )

    const binarySearch = useBinarySearch(
        ref.current?.children,
        state.activeIndex,
        state.overIndex,
        state.childCount
    )
    const getTodoDepth = useItemDepth(
        items,
        state.activeIndex,
        state.depth,
        state.childCount,
        maxDepth
    )

    const onDrag = useCallback(
        (event: Event, index: number, depth: number) => {
            const childCount = getItemChildCount(items, index)
            const active = ref.current?.children[index]

            if (active) {
                const mouseCoors = getCoordinates(event)
                const { left, top } = active.getBoundingClientRect()
                const initialCoors: Coors = {
                    x: left,
                    y: top,
                }

                const shift: Coors = {
                    x: mouseCoors.x - initialCoors.x,
                    y: mouseCoors.y - initialCoors.y,
                }

                dispath({
                    type: 'startDrag',
                    payload: {
                        index,
                        depth,
                        childCount,
                        initialCoors,
                        shift,
                    },
                })
            }
        },
        [items]
    )

    const onMove = useCallback(
        ({ x, y }: Coors) => {
            const { x: shiftX, y: shiftY } = state.shift
            const { x: initX } = state.initialCoors
            const top = y - shiftY

            const overIndex = binarySearch(top, items.length - state.childCount - 1)

            const depthDelta = (x - initX - shiftX) / depthIndent
            const depth = getTodoDepth(overIndex, depthDelta)

            dispath({ type: 'setPosition', payload: { overIndex, depth } })
        },
        [
            binarySearch,
            getTodoDepth,
            depthIndent,
            items.length,
            state.initialCoors,
            state.shift,
            state.childCount,
        ]
    )

    const onDrop = useCallback(() => {
        dispath({ type: 'stopDrag' })

        if (state.overIndex !== state.activeIndex || state.depth !== state.activeDepth) {
            const newItems = arrayMoveImmutable(
                items,
                state.activeIndex,
                state.overIndex,
                state.childCount,
                state.depth - state.activeDepth,
                maxDepth
            )

            onDragEnd(newItems)
        }
    }, [
        items,
        state.activeIndex,
        state.overIndex,
        state.activeDepth,
        state.depth,
        state.childCount,
        maxDepth,
        onDragEnd,
    ])

    const onCancel = useCallback(() => dispath({ type: 'stopDrag' }), [])

    useListeners(state.activeIndex !== -1, onMove, onDrop, onCancel)

    const itemsList = useMemo(
        () =>
            items.map((item, index) => {
                const listeners: SyntheticEvents = {
                    onMouseDown: e => onDrag(e.nativeEvent, index, item.depth),
                    onTouchStart: e => onDrag(e.nativeEvent, index, item.depth),
                    onTouchEnd: e => e.preventDefault(),
                }

                return (
                    <div
                        style={{
                            marginLeft: depthIndent * item.depth + 'px',
                        }}
                        key={item.id}
                    >
                        {renderItem(item, listeners)}
                    </div>
                )
            }),
        [items, depthIndent, renderItem, onDrag]
    )

    const activeItem = items[state.activeIndex]
    const listWidth = ref.current?.getBoundingClientRect().width

    return (
        <>
            {activeItem && listWidth && (
                <Overlay
                    initialCoors={state.initialCoors}
                    shift={state.shift}
                    width={listWidth - depthIndent * activeItem.depth}
                >
                    {renderItem(activeItem)}
                </Overlay>
            )}
            <div ref={ref} className='list'>
                {itemsList}
            </div>
        </>
    )
}

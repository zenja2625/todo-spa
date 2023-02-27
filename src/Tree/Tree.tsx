import React, {
    FC,
    useCallback,
    useLayoutEffect,
    useReducer,
    useRef,
    useMemo,
    forwardRef,
    createContext,
    useEffect,
    CSSProperties,
    useContext,
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Coors, TreeItem, TreeProps } from './types'
import { reducer, initialState } from './reducer'
// import { Item } from './Item'
import { useDnd } from './useDnd'
import { Overlay } from './Overlay'
import { FixedSizeList as List, ListChildComponentProps, ReactElementType } from 'react-window'
import ReactDOM from 'react-dom'
import { TodoItem } from '../containers/Todos/TodoItem'
import { Todo } from '../slices/sliceTypes'
import { useAppDispatch, useAppSelector } from '../store'
import { toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'
import { Checkbox } from 'antd'

type ListData = {
    activeIndex: number
    overIndex: number
    itemHeight: number
    gap: number
    depthWidth: number
    order: Array<TreeItem>
    dragStart: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void
}

const contextIntitial = {
    overIndex: -1,
    activeDepth: 0,
    itemHeight: 0,
    gap: 0,
    depthWidth: 0,
    header: <div></div>,
    footer: <div></div>,
}

const Context = createContext(contextIntitial)

const Row = ({ index, style, data }: ListChildComponentProps<ListData>) => {
    const { dragStart, order, activeIndex, overIndex, gap, itemHeight, depthWidth } = data

    const handleProps = useMemo(
        () => ({
            onDragStart: dragStart(order[index].id),
            onMouseDown: dragStart(order[index].id),
        }),
        [dragStart, order[index].id]
    )

    //Remove
    let todo = order[index] as any

    if (index === activeIndex) return null

    const top =
        index > activeIndex && index <= overIndex
            ? (index - 1) * (itemHeight + gap)
            : index < activeIndex && index >= overIndex
            ? (index + 1) * (itemHeight + gap)
            : style.top
    const left = order[index].depth * depthWidth
    const height = itemHeight

    const nStyle = { ...style, top, left, height, right: 0, width: undefined }

    return (
        <div style={nStyle}>
            <TodoItem handleProps={handleProps} todo={todo} />
        </div>
    )
}

const innerElementType: ReactElementType = forwardRef<HTMLDivElement, { style: CSSProperties }>(
    ({ children, ...rest }, ref) => {
        // console.log(rest.style)

        const { overIndex, activeDepth, itemHeight, gap, depthWidth, header, footer } =
            useContext(Context)

        rest = { ...rest, style: { ...rest.style, position: 'relative' } }

        return (
            <>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <div
                        style={{
                            width: '800px',
                            maxWidth: '800px',
                            margin: '0 45px 0 45px',
                        }}
                    >
                        {header}
                        <div ref={ref} {...rest}>
                            {overIndex !== -1 && (
                                <div
                                    style={{
                                        position: 'absolute',
                                        backgroundColor: 'gray',
                                        height: `${itemHeight}px`,
                                        top: `${overIndex * (itemHeight + gap)}px`,
                                        right: 0,
                                        left: `${activeDepth * depthWidth}px`,
                                    }}
                                ></div>
                            )}
                            {children}
                        </div>
                        {footer}
                    </div>
                </div>
            </>
        )
    }
)

export const Tree: FC<TreeProps> = ({
    items,
    itemHeight,
    gap,
    depthWidth,
    maxDepth,
    setItems,
    footer,
    header,
}) => {
    const wrapperRef = useRef<HTMLDivElement>(null)


    const draggedTodoId = useAppSelector(state => state.todos.draggedTodoId)

    const [state, dispatch] = useReducer(reducer, initialState)

    const { activeDepth, activeIndex, initialDepth, initialPosition, overIndex } = state

    const order = items

    const shift = useMemo((): Coors => {
        const { x = 0, y = 0 } = wrapperRef.current?.getBoundingClientRect() || {}

        return {
            x: initialPosition.x - x - initialDepth * depthWidth,
            y: initialPosition.y - y - (itemHeight + gap) * activeIndex,
        }
    }, [initialPosition, initialDepth, activeIndex, depthWidth, wrapperRef, itemHeight, gap])

    const activeItemWidth =
        wrapperRef.current && activeIndex >= 0 && activeIndex < order.length
            ? wrapperRef.current.clientWidth - order[activeIndex].depth * depthWidth
            : 0

    // useLayoutEffect(() => {
    //     dispatch({ type: 'setOrder', payload: items })
    // }, [items])

    const dragStart = useDnd(
        state,
        dispatch,
        itemHeight,
        gap,
        wrapperRef.current,
        shift,
        maxDepth,
        depthWidth
    )

    const itemData: ListData = useMemo(
        () => ({
            activeIndex,
            overIndex,
            order,
            itemHeight,
            depthWidth,
            gap,
            dragStart,
        }),
        [order, activeIndex, overIndex, itemHeight, depthWidth, gap, dragStart]
    )

    const value = useMemo(
        () => ({
            overIndex,
            activeDepth,
            itemHeight,
            gap,
            depthWidth,
            header,
            footer,
        }),
        [overIndex, activeDepth, itemHeight, gap, depthWidth, header, footer]
    )

    const myRef = useRef<any>()

    useLayoutEffect(() => {
        const ds = document.getElementById('ds')
        ds?.addEventListener('scroll', e => {
            // myRef?.current?.scrollTo(ds.scrollTop)
        })
        // console.log(ds)
    }, [])

    return (
        <>
            <Context.Provider value={value}>
                <AutoSizer
                    style={{
                        width: '100%',
                    }}
                >
                    {({ width, height }) => (
                        <List
                            ref={myRef}
                            height={height}
                            itemCount={order.length}
                            itemSize={itemHeight + gap}
                            width={width}
                            itemData={itemData}
                            innerRef={wrapperRef}
                            overscanCount={0}
                            innerElementType={innerElementType}
                            onScroll={e => {
                                // console.log('Scroll')
                                // console.log(myRef.current);
                            }}
                            style={{
                                // backgroundColor: 'orangered',
                                width: `100%`,
                                willChange: 'auto',
                                // overflow: undefined,
                            }}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </Context.Provider>
            <button
                style={{ position: 'fixed' }}
                onClick={() => {
                    console.log(myRef.current.scrollTo(50000))
                }}
            >
                Click
            </button>

            {ReactDOM.createPortal(
                activeIndex !== -1 && (
                    <Overlay
                        initialPosition={initialPosition}
                        itemHeight={itemHeight}
                        itemWidth={activeItemWidth}
                        shift={shift}
                        {...order[activeIndex]}
                    >
                        <TodoItem
                            dragged={true}
                            todo={{ ...state.order[state.activeIndex] } as any}
                        />
                    </Overlay>
                ),
                document.body
            )}
        </>
    )
}

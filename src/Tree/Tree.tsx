//Todo Set over, active Index to Slice in dragStart

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
    useState,
} from 'react'
import { useListeners } from './useListeners'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Coors, TreeItem, TreeProps } from './types'
import { reducer, initialState, State } from './reducer'
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
import { useWrapperRect } from './useWrapperRect'
import { getScrollable } from './getScrollable'

type ListData = {
    activeIndex: number
    overIndex: number
    itemHeight: number
    gap: number
    depthWidth: number
    order: Array<Todo>
    dragStart: (
        activeIndex: number,
        depth: number
    ) => (e: React.MouseEvent | React.TouchEvent) => void
}

type ContextIntitialProps = {
    activeIndex: number
    overIndex: number
    activeDepth: number
    itemHeight: number
    gap: number
    depthWidth: number
    header: JSX.Element
    footer: JSX.Element
}

const contextIntitial: ContextIntitialProps = {
    activeIndex: -1,
    overIndex: -1,
    activeDepth: 0,
    itemHeight: 0,
    gap: 0,
    depthWidth: 0,
    header: <div></div>,
    footer: <div></div>,
}

const Context = createContext(contextIntitial)

export const Row = ({ index, style, data }: ListChildComponentProps<ListData>) => {
    const { dragStart, order, activeIndex, overIndex, gap, itemHeight, depthWidth } = data

    const handleProps = useMemo(
        () => ({
            onDragStart: dragStart(index, order[index].depth),
            onMouseDown: dragStart(index, order[index].depth),
        }),
        [dragStart, index, order[index].depth]
    )

    let todo = order[index]

    if (index === activeIndex) return null

    const height = itemHeight

    const nStyle = { ...style, height, right: 0, width: undefined }

    if (activeIndex !== -1) {
        nStyle.top =
            index > activeIndex && index <= overIndex
                ? (index - 1) * (itemHeight + gap)
                : index < activeIndex && index >= overIndex
                ? (index + 1) * (itemHeight + gap)
                : style.top
        nStyle.left = order[index].depth * depthWidth
    } else {
        nStyle.left = order[index].depth * depthWidth
    }

    return (
        <div style={nStyle}>
            <TodoItem handleProps={handleProps} todo={todo} />
        </div>
    )
}

const innerElementType: ReactElementType = forwardRef<HTMLDivElement, { style: CSSProperties }>(
    ({ children, ...rest }, ref) => {
        // console.log(rest.style)

        const { activeIndex, overIndex, activeDepth, itemHeight, gap, depthWidth, header, footer } =
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
                            {activeIndex !== -1 && (
                                <>
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
                                    {/* <Overlay
                                        style={{
                                            position: 'absolute',
                                            backgroundColor: 'gray',
                                            height: `${itemHeight}px`,
                                            top: `${overIndex * (itemHeight + gap)}px`,
                                            right: 0,
                                            left: `${activeDepth * depthWidth}px`,
                                        }}
                                    >
                                        <TodoItem dragged={true} todo={active} />
                                    </Overlay> */}
                                </>
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
    
    const {
        activeIndex,
        overIndex,
        depth: activeDepth,
        initialPosition,
    } = useAppSelector(state => state.todos.draggedTodo)

    const initialDepth = useMemo(
        () => (activeIndex !== -1 ? items[activeIndex].depth : 0),
        [items, activeIndex]
    )

    const [_state, dispatch] = useReducer(reducer, initialState)

    const shift = useMemo((): Coors => {
        const { x = 0, y = 0 } = wrapperRef.current?.getBoundingClientRect() || {}

        return {
            x: initialPosition.x - x - initialDepth * depthWidth,
            y: initialPosition.y - y - (itemHeight + gap) * activeIndex,
        }
    }, [initialPosition, initialDepth, activeIndex, depthWidth, wrapperRef, itemHeight, gap])
    
    const activeItemWidth =
        wrapperRef.current && activeIndex >= 0 && activeIndex < items.length
            ? wrapperRef.current.clientWidth - items[activeIndex].depth * depthWidth
            : 0

    const state: State = {
        activeIndex,
        overIndex,
        order: items,
        activeDepth,
        activeChildren: [],
        initialDepth: 0,
        initialPosition: { x: 0, y: 0 },
    }

    const dragStart = useDnd(
        state,
        dispatch,
        itemHeight,
        gap,
        wrapperRef.current,
        shift,
        maxDepth,
        depthWidth,
        initialPosition
    )

    const itemData: ListData = useMemo(
        () => ({
            activeIndex,
            overIndex,
            order: items,
            itemHeight,
            depthWidth,
            gap,
            dragStart,
        }),
        [items, activeIndex, overIndex, itemHeight, depthWidth, gap, dragStart]
    )

    useLayoutEffect(() => {
        // console.log('innerRef')
        // console.log(wrapperRef.current?.getBoundingClientRect())
    })

    const value: ContextIntitialProps = useMemo(
        () => ({
            activeIndex,
            overIndex,
            activeDepth,
            itemHeight,
            gap,
            depthWidth,
            header,
            footer,
        }),
        [activeIndex, overIndex, activeDepth, itemHeight, gap, depthWidth, header, footer]
    )

    const myRef = useRef<any>()
    const outerRef = useRef<any>()

    useLayoutEffect(() => {
        const ds = document.getElementById('ds')
        ds?.addEventListener('scroll', e => {
            // myRef?.current?.scrollTo(ds.scrollTop)
        })
        // console.log(ds)
    }, [])

    //const scrollTop = wrapperRef.current ? getScrollable(wrapperRef.current)?.scrollTop || 0 : 0

    const [mode, setMode] = useState('None')

    useListeners(activeIndex !== -1, ({ y }) => {
        if (wrapperRef.current) {
            const offset = 40
            
            const outerWrapper = myRef.current.props.outerRef.current
            
            const scrollTop = outerWrapper.scrollTop
            const { y: dy } = wrapperRef.current.getBoundingClientRect()
            
            const top = dy + scrollTop + offset
            const bottom = outerWrapper.getBoundingClientRect().bottom - offset
            
            
            if (y < top) {
                setMode('Top')
            }
            else if (y > bottom){
                setMode('Bottom')
            }
            else {
                setMode('None')
            }
            
            //console.log(`bottom ${y} ${bottom}`)
            //console.log(myRef.current.props.outerRef.current.getBoundingClientRect().height)
        }
    })
    

    const [xPos, yPos, todoWidth] = useMemo(() => {
        if (activeIndex === -1) {
            return [0, 0, 0]
        }
        const {
            y = 0,
            x = 0,
            width: todoWi = 0,
        } = wrapperRef.current?.getBoundingClientRect() || {}

        const depthOffset = items[activeIndex].depth * depthWidth

        const yPos = (itemHeight + gap) * activeIndex + y
        const xPos = depthOffset + x
        const todoWidth = todoWi - depthOffset

        return [xPos, yPos, todoWidth]
    }, [activeIndex, itemHeight, gap, items, depthWidth])

    console.log(yPos)

    return (
        <>
            <Context.Provider value={value}>
                <AutoSizer
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {({ width, height }) => {
                        return (
                            <>
                                <div
                                    style={{
                                        width: '50px',
                                        height: '50px',
                                        backgroundColor: 'orange',
                                        position: 'fixed',
                                        zIndex: 1000,
                                    }}
                                >
                                    {mode}
                                </div>
                                <List
                                    ref={myRef}
                                    height={height}
                                    itemCount={items.length}
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
                                    outerRef={outerRef}
                                >
                                    {Row}
                                </List>
                                {activeIndex !== -1 && (
                                    <Overlay
                                        initialCoors={{ x: xPos, y: yPos }}
                                        style={{}}
                                        itemHeight={itemHeight}
                                        itemWidth={todoWidth}
                                    >
                                        <TodoItem dragged={true} todo={items[activeIndex]} />
                                    </Overlay>
                                )}
                            </>
                        )
                    }}
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

            {/* {ReactDOM.createPortal(
                activeIndex !== -1 && (
                    <Overlay
                        initialCoors={{ x: 0, y: 0 }}
                        style={{}}
                        itemHeight={itemHeight}
                        itemWidth={activeItemWidth}
                    >
                        <TodoItem dragged={true} todo={items[activeIndex]} />
                    </Overlay>
                ),
                document.body
            )} */}
        </>
    )
}

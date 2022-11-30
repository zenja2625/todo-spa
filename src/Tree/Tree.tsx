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
} from 'react'
import AutoSizer from 'react-virtualized-auto-sizer'
import { Coors, TreeItem, TreeProps } from './types'
import { reducer, initialState } from './reducer'
// import { Item } from './Item'
import { useDnd } from './useDnd'
import { Overlay } from './Overlay'
import { FixedSizeList as List, ListChildComponentProps, ReactElementType } from 'react-window'
import ReactDOM from 'react-dom'
import { TodoItem1 } from '../containers/Todos/TodoItem1'
import { Todo } from '../slices/sliceTypes'
import { useAppDispatch } from '../store'
import { toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'

type ListData = {
    activeIndex: number
    overIndex: number
    itemHeight: number
    gap: number
    depthWidth: number
    order: Array<TreeItem>
    toggleIsOpen: (id: string) => void
    toggleIsCheck: (id: string) => void
    dragStart: (id: string) => (e: React.MouseEvent | React.TouchEvent) => void
}

const contextIntitial = {
    overIndex: -1,
    activeDepth: 0,
    itemHeight: 0,
    gap: 0,
    depthWidth: 0,
}

const Context = createContext(contextIntitial)

const Row = ({ index, style, data }: ListChildComponentProps<ListData>) => {
    const {
        dragStart,
        toggleIsOpen,
        toggleIsCheck,
        order,
        activeIndex,
        overIndex,
        gap,
        itemHeight,
        depthWidth,
    } = data

    const handleProps = useMemo(
        () => ({
            onDragStart: dragStart(order[index].id),
            onMouseDown: dragStart(order[index].id),
        }),
        [dragStart, order[index].id]
    )

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

    //Remove
    const todo = order[index] as any

    return (
        <div style={nStyle}>
            <TodoItem1
                handleProps={handleProps}
                toggleIsOpen={e => toggleIsOpen(e.toString())}
                todo={{ ...todo, id: Number(todo.id), isHiddenSubTasks: todo.isOpen }}
            />
        </div>
    )
}

const innerElementType: ReactElementType = forwardRef<HTMLDivElement, any>(
    ({ children, ...rest }, ref) => {
        console.log(rest)

        rest = { ...rest, style: { ...rest.style, display: 'flex', justifyContent: 'center' } }

        return (
            <Context.Consumer>
                {({ overIndex, activeDepth, itemHeight, gap, depthWidth }) => {
                    return (
                        <>
                        <div style={{ height: '180px', width: '100%', backgroundColor: 'blanchedalmond'}}>

                        </div>
                            <div {...rest}>
                                <div
                                    ref={ref}
                                    style={{
                                        position: 'relative',
                                        width: '800px',
                                        maxWidth: '800px',
                                        margin: '0 45px 0 45px',
                                    }}
                                >
                                    {children}
                                    <div
                                        style={{
                                            backgroundColor: 'gray',
                                            height: `${itemHeight}px`,
                                            position: 'absolute',
                                            right: 0,
                                            left: activeDepth * depthWidth,
                                            top: `${overIndex * (itemHeight + gap)}px`,
                                        }}
                                    ></div>
                                </div>
                            </div>
                        </>
                    )
                }}
            </Context.Consumer>
        )
    }
)

export const Tree: FC<TreeProps> = ({ items, itemHeight, gap, depthWidth, maxDepth, setItems }) => {
    const wrapperRef = useRef<HTMLDivElement>(null)

    const [state, dispatch] = useReducer(reducer, initialState)
    const appDispatch = useAppDispatch()

    const { activeDepth, activeIndex, initialDepth, initialPosition, order, overIndex } = state

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

    useLayoutEffect(() => {
        dispatch({ type: 'setOrder', payload: items })
    }, [items])

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

    const toggleIsOpen = useCallback(
        (id: string) => {
            appDispatch(toggleTodoHiding(id))
        },
        [appDispatch]
    )

    const toggleIsCheck = useCallback(
        (id: string) => {
            appDispatch(toggleTodoProgress(id))
        },
        [appDispatch]
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
            toggleIsOpen,
            toggleIsCheck,
        }),
        [
            order,
            activeIndex,
            overIndex,
            itemHeight,
            depthWidth,
            gap,
            dragStart,
            toggleIsOpen,
            toggleIsCheck,
        ]
    )

    const value = useMemo(
        () => ({
            overIndex,
            activeDepth,
            itemHeight,
            gap,
            depthWidth,
        }),
        [overIndex, activeDepth, itemHeight, gap, depthWidth]
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
                            // onScroll={e => {
                            //     console.log(e.scrollOffset)
                            // }}
                            style={{
                                backgroundColor: 'orangered',
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
                    console.log(myRef.current.scrollTo(5000))
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
                    />
                ),
                document.body
            )}
        </>
    )
}

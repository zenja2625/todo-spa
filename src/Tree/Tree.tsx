import React, {
    FC,
    useCallback,
    useLayoutEffect,
    useReducer,
    useRef,
    useMemo,
    forwardRef,
    createContext,
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

type ListData = {
    activeIndex: number
    overIndex: number
    itemHeight: number
    gap: number
    depthWidth: number
    order: Array<TreeItem>
    toggle: (id: string) => void
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
    const { dragStart, toggle, order, activeIndex, overIndex, gap, itemHeight, depthWidth } = data

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
            <TodoItem1 todo={{ ...todo, id: Number(todo.id) }} />
            {/* <Item dragStart={dragStart} toggle={toggle} {...order[index]} /> */}
        </div>
    )
}

const innerElementType: ReactElementType = forwardRef<HTMLDivElement, any>(
    ({ children, ...rest }, ref) => {
        return (
            <Context.Consumer>
                {({ overIndex, activeDepth, itemHeight, gap, depthWidth }) => {
                    return (
                        <div ref={ref} {...rest}>
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
                    )
                }}
            </Context.Consumer>
        )
    }
)

export const Tree: FC<TreeProps> = ({ items, itemHeight, gap, depthWidth, maxDepth, setItems }) => {
    
    
    const wrapperRef = useRef<HTMLDivElement>(null)

    const [state, dispatch] = useReducer(reducer, initialState)

    const { activeDepth, activeIndex, initialDepth, initialPosition, order, overIndex } = state

    console.log(items);
    console.log(order);

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

    const dragStart = useDnd(state, dispatch, itemHeight, gap, wrapperRef.current, shift, maxDepth)

    const toggle = useCallback(
        (id: string) => {
            setItems(prev =>
                prev.map(item =>
                    item.id === id
                        ? {
                              ...item,
                              isOpen: !item.isOpen,
                          }
                        : item
                )
            )
        },
        [setItems]
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
            toggle,
        }),
        [order, activeIndex, overIndex, itemHeight, depthWidth, gap, dragStart, toggle]
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
                            height={height}
                            itemCount={order.length}
                            itemSize={itemHeight + gap}
                            width={width}
                            itemData={itemData}
                            innerRef={wrapperRef}
                            overscanCount={30}
                            innerElementType={innerElementType}
                            // onScroll={() => {
                            //     console.log('scroll')
                            // }}
                            style={{ backgroundColor: 'orangered', width: `100%`, willChange: 'auto' }}
                        >
                            {Row}
                        </List>
                    )}
                </AutoSizer>
            </Context.Provider>
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

import { createRef, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { Column, Index, Table } from 'react-virtualized'
import { getTodos } from '../../selectors/getTodos'
import { Tree } from '../../sortableTree/Components/Tree'
import { useListeners } from '../../sortableTree/hooks/useListeners'
import { useAppSelector } from '../../store'
import { TodoItem } from './TodoItem'

export const TodoItems = () => {
    const todos = useAppSelector(getTodos)
    const ref = useRef<Array<HTMLElement | null>>([])


    const [over, setOver] = useState(4)

    // useListeners(true, (coors) => {
    //     // const i = Math.floor(coors.y / 20 % todos.length)

    //     // setOver(i)
    //     console.log(ref.current);
        
    // })

    const rowGetter = useCallback(
        ({ index }: Index) => {
            // const newIndex = index === 0 ? over : index <= over && index > 0 ? index - 1 : index
            const newIndex =
                index === over ? 0 : index <= over && index < todos.length ? index + 1 : index

            return todos[newIndex]
        },
        [over, todos]
    )

    return (
        <Tree
            items={todos}
            depthIndent={40}
            maxDepth={5}
            onDragEnd={() => {}}
            renderItem={(item, listeners) => {
                return <TodoItem todo={item} listeners={listeners} />
            }}
        />
        // <Table
        //     width={500}
        //     height={400}
        //     rowHeight={45}
        //     headerHeight={50}
        //     rowCount={todos.length}
        //     rowGetter={rowGetter}
        //     rowRenderer={({ key, style, className, rowData }) => {
        //         return <TodoItem  key={key} todo={rowData} style={style} className={className} />
        //     }}
        // >
        //     <Column dataKey='todo' width={500} label='Name' />
        // </Table>
    )
}

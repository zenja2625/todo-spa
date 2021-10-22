import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties, FC } from 'react'
import { Todo } from '../../slices/sliceTypes'
import { depthIndent } from '../../slices/todosSlice'
import { getTodoDepth } from '../../utility/getTodoDepth'
import { TodoItem } from './TodoItem'

type SortableTodoPropsType = {
    todo: Todo
    todos: Array<Todo>
    remove: () => void
    style?: CSSProperties
}

export const SortableTodo: FC<SortableTodoPropsType> = ({ todo, remove, todos, style }) => {
    const {
        attributes,
        listeners,
        setDraggableNodeRef,
        setDroppableNodeRef,
        transform,
        active,
        index,
        overIndex,
        isDragging,
    } = useSortable({ id: todo.id.toString() })

    const todoStyle: CSSProperties = {
        scale: '1',
        transform: CSS.Transform.toString(transform),
        userSelect: isDragging ? 'none' : undefined,
        ...style
    }

    const isActive = !!active && active.id === todo.id.toString()

    if (isActive && typeof active?.data?.current?.deltaX === 'number') {
        const actualDepth = getTodoDepth(
            todos,
            index,
            overIndex,
            active.data.current.deltaX,
            depthIndent
        )
        todo = { ...todo, depth: actualDepth }
    }

    return (
        <div ref={setDroppableNodeRef} style={todoStyle}>
            <TodoItem
                todo={todo}
                active={isActive}
                remove={remove}
                dragRef={setDraggableNodeRef}
                handleProps={{
                    ...attributes,
                    ...listeners,
                }}
            />
        </div>
    )
}

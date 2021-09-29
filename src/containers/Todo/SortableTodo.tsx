import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties, FC } from 'react';
import { Todo } from '../../slices/sliceTypes';
import { depthIndent } from '../../slices/todosSlice';
import { getTodoDepth } from '../../utility/getTodoDepth';
import { TodoItem } from '../TodoItem';

type SortableTodoPropsType = {
    todo: Todo
    todos: Array<Todo>
    remove: () => void
}

const animateLayoutChanges: AnimateLayoutChanges = ({
    isSorting,
    wasSorting
}) => (isSorting || wasSorting ? false : true);

export const SortableTodo: FC<SortableTodoPropsType> = ({ todo, remove, todos }) => {
    const sort = useSortable({ id: todo.id.toString(), animateLayoutChanges })

    const {
        attributes,
        listeners,
        setDraggableNodeRef,
        setDroppableNodeRef,
        transform,
        active,
        index,
        overIndex,
        
    } = sort

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform)
    };

    const isActive = !!active && active.id === todo.id.toString()

    if (isActive && typeof active?.data?.current?.deltaX === 'number') {
        const actualDepth = getTodoDepth(todos, index, overIndex, active.data.current.deltaX, depthIndent)
        todo = {...todo, depth: actualDepth}
    }

    return (
        <div ref={setDroppableNodeRef} style={style} >
            <TodoItem
                todo={todo}
                active={isActive}
                remove={remove}
                dragRef={setDraggableNodeRef}
                handleProps={{
                    ...attributes,
                    ...listeners
                }}
            />
        </div>
    )
}
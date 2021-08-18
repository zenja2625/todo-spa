import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties, FC } from 'react';
import { Todo } from '../../slices/sliceTypes';
import { TodoItem } from '../TodoItem';

type SortableTodoPropsType = {
    todo: Todo
    active?: boolean
}

const animateLayoutChanges: AnimateLayoutChanges = ({
    isSorting,
    wasSorting
}) => (isSorting || wasSorting ? false : true);

export const SortableTodo: FC<SortableTodoPropsType> = ({ todo, active }) => {
    const {
        attributes,
        listeners,
        setDraggableNodeRef,
        setDroppableNodeRef,
        transform,
        transition
    } = useSortable({ id: todo.id.toString(), animateLayoutChanges })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        transition: transition || undefined
    };

    return (
        <div ref={setDroppableNodeRef} style={style} >
            <TodoItem
                todo={todo}
                active={active}
                dragRef={setDraggableNodeRef}
                handleProps={{
                    ...attributes,
                    ...listeners
                }}
            />
        </div>
    )
}
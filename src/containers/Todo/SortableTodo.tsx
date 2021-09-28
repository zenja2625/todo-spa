import { AnimateLayoutChanges, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities'
import { CSSProperties, FC } from 'react';
import { Todo } from '../../slices/sliceTypes';
import { TodoItem } from '../TodoItem';

type SortableTodoPropsType = {
    todo: Todo
    active?: boolean
    remove: () => void
    initialDepth: number
}

const animateLayoutChanges: AnimateLayoutChanges = ({
    isSorting,
    wasSorting
}) => (isSorting || wasSorting ? false : true);

export const SortableTodo: FC<SortableTodoPropsType> = ({ todo, remove }) => {
    const {
        attributes,
        listeners,
        setDraggableNodeRef,
        setDroppableNodeRef,
        transform,
        transition,
        active
    } = useSortable({ id: todo.id.toString(), animateLayoutChanges })

    const style: CSSProperties = {
        transform: CSS.Transform.toString(transform),
        // transition: transition || undefined
    };

    const isActive = !!active && active.id === todo.id.toString()
    const activeDepth = isActive && active?.data?.current?.depth ? active.data.current.depth as number : 0

    return (
        <div ref={setDroppableNodeRef} style={style} >
            <TodoItem
                todo={isActive ? {...todo, depth: activeDepth} : todo}
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
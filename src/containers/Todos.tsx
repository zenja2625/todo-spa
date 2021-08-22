import { useEffect, useRef, useState } from 'react'
import { todoStatusDTO } from '../api/apiTypes'
import { useDebounce } from '../hooks/useDebounce'
import { Todo, TodoDTO } from '../slices/sliceTypes'
import { changeTodoPosition, dropTodo, getTodosThunk, moveTodo, toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { MoreOutlined } from '@ant-design/icons'
import { TodoItem } from './TodoItem'
import { getTodos } from '../selectors/getTodos'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTodo } from './Todo/SortableTodo'
import { createPortal } from 'react-dom'
import { TodoEditor } from './TodoEditor'

let renderCount = 1

type statusProperties = 'isDone' | 'isHiddenSubTodo'

const isEmptyStatus = (status: todoStatusDTO) =>
    status.isDone === undefined && status.isHiddenSubTodo === undefined

const setStatus = (statuses: Array<todoStatusDTO>, propertyType: statusProperties, value: boolean, id: number) => {
    const prevStatus = statuses.find(x => x.id === id)

    if (prevStatus) {
        prevStatus[propertyType] = prevStatus[propertyType] === undefined ? value : undefined
        return statuses
            .map(status => status.id === id ? prevStatus : status)
            .filter(status => !isEmptyStatus(status))
    }
    else {
        return [...statuses, { id, [propertyType]: value }]
    }
}

export const Todos = () => {
    const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)
    const [draggedTodoDepth, setDraggedTodoDepth] = useState<number | null>(null)
    const [prevTodoId, setPrevTodoId] = useState<number | null>(null)

    const dispatch = useAppDispatch()
    const selectedCategoryId = useAppSelector(state => state.categories.selectedCategoryId)
    const todos = useAppSelector(getTodos)


    const [statuses, setStatuses] = useState<Array<todoStatusDTO>>([])

    const st = useDebounce(statuses, 1000)

    useEffect(() => {
        if (st.length) {
            setStatuses([])
        }
    }, [st])

    const [consol, setConsol] = useState('')

    useEffect(() => {
        if (selectedCategoryId > 0)
            dispatch(getTodosThunk(selectedCategoryId))
    }, [selectedCategoryId, dispatch])

    useEffect(() => {
        setConsol(JSON.stringify(statuses, null, 2))
    }, [statuses])

    const getDepth = (activeItem: Todo, overId: string, offsetLeft: number) => {
        const activeIndex = todos.findIndex(x => x.id === activeItem.id)
        const overIndex = todos.findIndex((x) => x.id.toString() === overId)

        const prevIndex = activeIndex >= overIndex ? overIndex - 1 : overIndex
        const nextIndex = activeIndex <= overIndex ? overIndex + 1 : overIndex

        const maxDepth = prevIndex >= 0 ? todos[prevIndex].depth + 1 : 0
        const minDepth = nextIndex < todos.length ? todos[nextIndex].depth : 0

        let actualDepth = activeItem.depth + Math.floor(offsetLeft / 40)
        actualDepth = actualDepth < minDepth
            ? minDepth
            : actualDepth > maxDepth
                ? maxDepth
                : actualDepth
        
        const prevTodoId = prevIndex >= 0 ? todos[prevIndex].id : null

        return { actualDepth, prevTodoId }
    }

    const progress = (id: number, isDone: boolean) => {
        dispatch(toggleTodoProgress(id))
        setStatuses(prevStatuses => setStatus(prevStatuses, 'isDone', isDone, id))
    }

    const hiding = (id: number, isHiddenSubTasks: boolean) => {
        dispatch(toggleTodoHiding(id))
        setStatuses(prevStatuses => setStatus(prevStatuses, 'isHiddenSubTodo', isHiddenSubTasks, id))
    }


    const onDragStart = ({ active }: DragStartEvent) => {
        const todo = todos.find(todo => todo.id.toString() === active.id) || null
        setDraggedTodo(todo)
        if (todo && todo.showHideButton && !todo.isHiddenSubTasks) 
            dispatch(toggleTodoHiding(todo.id))
    }

    const onDragMove = ({ delta, active, over }: DragMoveEvent) => {
        const activeId = active.id
        const overId = over?.id || null

        const activeItem = todos.find(todo => todo.id.toString() === activeId)

        if (overId && activeItem) {
            const { actualDepth, prevTodoId } = getDepth(activeItem, overId, delta.x)
            setDraggedTodoDepth(actualDepth)
            setPrevTodoId(prevTodoId)
        }
        else {
            setDraggedTodoDepth(null)
            setPrevTodoId(null)
        }
    }

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        const todo = todos.find(todo => todo.id.toString() === active.id) || null
        if (todo && todo.isHiddenSubTasks !== draggedTodo?.isHiddenSubTasks)
            dispatch(toggleTodoHiding(todo.id))

        if (over && draggedTodoDepth !== null)
            dispatch(moveTodo({ id: active.id, prevTodoId, depth: draggedTodoDepth }))

        onDragCancel()
    }
    

    const onDragCancel = () => {
        setDraggedTodo(null)
        setDraggedTodoDepth(null)
        setPrevTodoId(null)
    }

    const todoItems = todos.map((todo) => {
        return (
            <SortableTodo
                key={todo.id}
                todo={{
                    ...todo,
                    depth:
                        draggedTodo?.id === todo.id &&

                        draggedTodoDepth !== null
                            ? draggedTodoDepth
                            : todo.depth,
                }}
                active={draggedTodo?.id === todo.id}

            />
        )
    })

    return (
        <div>
            <div>Render Count: {renderCount++}</div>
            Todos
            <div style={{ width: '400px' }}>
                <DndContext
                    collisionDetection={closestCenter}
                    onDragStart={onDragStart}
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    onDragCancel={onDragCancel}
                >
                    <SortableContext
                        items={todos.map(x => ({ ...x, id: x.id.toString() }))}
                        strategy={verticalListSortingStrategy}
                    >
                        {todoItems}
                        {createPortal(
                            <DragOverlay>
                                <div>asd</div>
                            </DragOverlay>,
                            document.body
                        )}
                    </SortableContext>
                </DndContext>
            </div>
            <div>
                <input type="button" value="Добавить задачу" />
                {selectedCategoryId && <TodoEditor todo={draggedTodo || undefined} categoryId={selectedCategoryId}/>}

            </div>
            <div >
                <pre>{consol}</pre>
            </div>
        </div>
    )
}
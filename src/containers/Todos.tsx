import { useEffect, useRef, useState } from 'react'
import { TodoStatusDTO } from '../api/apiTypes'
import { useDebounce } from '../hooks/useDebounce'
import { Todo, TodoDTO } from '../slices/sliceTypes'
import { createTodoThunk, deleteTodoThunk, getTodosThunk, moveTodo, toggleTodoHiding, toggleTodoProgress, updateTodoThunk } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { MoreOutlined } from '@ant-design/icons'
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
import { Modal } from 'antd'

import moment, { Moment } from 'moment'
import { useFormik } from 'formik'


import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/ru_RU'
const dateFormat = 'DD.MM.YYYY'
const serverFormat = 'YYYY-MM-DD'



let renderCount = 1
type statusProperties = 'isDone' | 'isHiddenSubTodo'

const isEmptyStatus = (status: TodoStatusDTO) =>
    status.isDone === undefined && status.isHiddenSubTodo === undefined

const setStatus = (statuses: Array<TodoStatusDTO>, propertyType: statusProperties, value: boolean, id: number) => {
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

type TodoPosition = {
    parentId: number
    prevId: number
}

type TodoEditorValues = {
    value: string
    taskEnd?: Moment
}

type TodoModalMode = 'Add' | 'Edit' | 'Close'

export const Todos = () => {
    const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)
    const [draggedTodoDepth, setDraggedTodoDepth] = useState<number | null>(null)
    const [prevTodoId, setPrevTodoId] = useState<number | null>(null)

    const [editTodo, setEditTodo] = useState<Todo | null>(null)
    const [todoPosition, setTodoPosition] = useState<TodoPosition | null>(null)

    //const todoModalMode: TodoModalMode = editTodo ? 'Edit' : todoPosition ? 'Add' : 'Close'

    const formik = useFormik<TodoEditorValues>({
        initialValues: {
            value: '',
            taskEnd: undefined
        },
        onSubmit: async values => {
            setEditTodo(null)
            setTodoPosition(null)
            formik.setValues({ value: '' })

            if (editTodo) {
                dispatch(updateTodoThunk({ 
                    categoryId: selectedCategoryId, 
                    id: editTodo.id, 
                    todoDTO: { 
                        Value: values.value, 
                        TaskEnd: values.taskEnd?.toDate()
                    } 
                }))
            }
            else if (todoPosition) {
                dispatch(createTodoThunk({
                    categoryId:  selectedCategoryId,
                    todoDTO: {
                        ParentId: todoPosition.parentId,
                        PrevToDoId: todoPosition.prevId,
                        Value: values.value, 
                        TaskEnd: values.taskEnd?.toDate()
                    }
                }))
            }
        }
    })


    useEffect(() => {
        if (editTodo)
            formik.setValues({ value: editTodo.value, taskEnd: editTodo.taskEnd ? moment(editTodo.taskEnd, serverFormat) : undefined})
    }, [editTodo])

    const dispatch = useAppDispatch()
    const selectedCategoryId = useAppSelector(state => state.categories.selectedCategoryId)
    const todos = useAppSelector(getTodos)

    const [statuses, setStatuses] = useState<Array<TodoStatusDTO>>([])

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


        setEditTodo(null)
        setTodoPosition(null)
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

    const onEditEnd = () => {

    }

    let todoItems = todos.map(todo => {
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
                edit={(id: number) => setEditTodo(todo)}
                remove={() => dispatch(deleteTodoThunk({ categoryId: selectedCategoryId, id: todo.id }))}
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
                <input type="button" value="Новая задача" onClick={() => {
                    setEditTodo(null)
                    setTodoPosition({
                        parentId: 0,
                        prevId: todos.length > 0 ? todos[todos.length - 1].id : 0
                    })
                }} />
            </div>
            <Modal 
                title={editTodo ? 'Изменить задачу' : "Добавить задачу" }
                visible={!!editTodo || !!todoPosition} 
                onOk={d => { formik.handleSubmit() } } 
                onCancel={() => {
                    setEditTodo(null)
                    setTodoPosition(null)
                    formik.setValues({ value: '' })
                }}
            >
                <input name='value' value={formik.values.value} onChange={formik.handleChange}/>
                <DatePicker 
                    name='taskEnd' 
                    disabledDate={date => date < moment().startOf('day')} 
                    locale={locale} 
                    value={formik.values.taskEnd} 
                    format={dateFormat} 
                    onChange={(date) => formik.setFieldValue('taskEnd', date)}/>
            </Modal>
            <div >
                <pre>{consol}</pre>
            </div>
        </div>
    )
}
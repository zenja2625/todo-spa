import { useEffect, useRef, useState } from 'react'
import { TodoStatusDTO } from '../api/apiTypes'
import { useDebounce } from '../hooks/useDebounce'
import { Todo, TodoDTO } from '../slices/sliceTypes'
import {
    createTodoThunk,
    deleteTodoThunk,
    getTodosThunk,
    moveTodo,
    toggleTodoHiding,
    toggleTodoProgress,
    updateTodoThunk,
} from '../slices/todosSlice'
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
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTodo } from './Todo/SortableTodo'
import { createPortal } from 'react-dom'
import { TodoEditor } from './TodoEditor'
import { Form, Modal, Row } from 'antd'

import moment, { Moment } from 'moment'
import { Formik, useFormik } from 'formik'

import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/ru_RU'
import { useParams } from 'react-router'
import { updateCategoryThunk, createCategoryThunk, deleteCategoryThunk } from '../slices/categoriesSlice'
import { FormItem } from './utility/FormItem'
import confirm from 'antd/lib/modal/confirm'



import { DashOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const dateFormat = 'DD.MM.YYYY'
const serverFormat = 'YYYY-MM-DD'

let renderCount = 1
type statusProperties = 'isDone' | 'isHiddenSubTodo'

const isEmptyStatus = (status: TodoStatusDTO) =>
    status.isDone === undefined && status.isHiddenSubTodo === undefined

const setStatus = (
    statuses: Array<TodoStatusDTO>,
    propertyType: statusProperties,
    value: boolean,
    id: number
) => {
    const prevStatus = statuses.find(x => x.id === id)

    if (prevStatus) {
        prevStatus[propertyType] =
            prevStatus[propertyType] === undefined ? value : undefined
        return statuses
            .map(status => (status.id === id ? prevStatus : status))
            .filter(status => !isEmptyStatus(status))
    } else {
        return [...statuses, { id, [propertyType]: value }]
    }
}

type TodoPosition = {
    ParentId: number
    PrevToDoId: number
}

type TodoEditorValue = {
    value: string
    taskEnd?: Moment
}

const initialValue: TodoEditorValue = {
    value: ''
}

export const Todos = () => {
    const { categoryId } = useParams<{ categoryId?: string }>()

    const [draggedTodo, setDraggedTodo] = useState<Todo | null>(null)
    const [draggedTodoDepth, setDraggedTodoDepth] = useState<number | null>(
        null
    )
    const [prevTodoId, setPrevTodoId] = useState<number | null>(null)


    const [editModalVisable, setEditModalVisable] = useState(false)
    const [editModalId, setEditModalId] = useState<number | null>(null)
    const [editData, setEditData] = useState<TodoPosition | null>(null)
    const [editModalValue, setEditModalValue] =
        useState<TodoEditorValue>(initialValue)



    const [editTodo, setEditTodo_] = useState<Todo | null>(null)
    const [todoPosition, setTodoPosition] = useState<TodoPosition | null>(null)

    const formik = useFormik<TodoEditorValue>({
        initialValues: {
            value: '',
            taskEnd: undefined,
        },
        onSubmit: async values => {
            setEditTodo_(null)
            setTodoPosition(null)
            formik.setValues({ value: '' })

            if (editTodo) {
                dispatch(
                    updateTodoThunk({
                        categoryId: selectedCategoryId,
                        id: editTodo.id,
                        todoDTO: {
                            Value: values.value,
                            TaskEnd: values.taskEnd?.toDate(),
                        },
                    })
                )
            } else if (todoPosition) {
                dispatch(
                    createTodoThunk({
                        categoryId: selectedCategoryId,
                        todoDTO: {
                            ParentId: todoPosition.ParentId,
                            PrevToDoId: todoPosition.PrevToDoId,
                            Value: values.value,
                            TaskEnd: values.taskEnd?.toDate(),
                        },
                    })
                )
            }
        },
    })

    useEffect(() => {
        if (editTodo)
            formik.setValues({
                value: editTodo.value,
                taskEnd: editTodo.taskEnd
                    ? moment(editTodo.taskEnd, serverFormat)
                    : undefined,
            })
    }, [editTodo])

    const dispatch = useAppDispatch()
    const selectedCategoryId = useAppSelector(
        state => state.categories.selectedCategoryId
    )
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
        if (categoryId) dispatch(getTodosThunk(Number(categoryId)))

        setEditTodo_(null)
        setTodoPosition(null)
    }, [categoryId, dispatch])

    useEffect(() => {
        setConsol(JSON.stringify(statuses, null, 2))
    }, [statuses])

    const getDepth = (activeItem: Todo, overId: string, offsetLeft: number) => {
        const activeIndex = todos.findIndex(x => x.id === activeItem.id)
        const overIndex = todos.findIndex(x => x.id.toString() === overId)

        const prevIndex = activeIndex >= overIndex ? overIndex - 1 : overIndex
        const nextIndex = activeIndex <= overIndex ? overIndex + 1 : overIndex

        const maxDepth = prevIndex >= 0 ? todos[prevIndex].depth + 1 : 0
        const minDepth = nextIndex < todos.length ? todos[nextIndex].depth : 0

        let actualDepth = activeItem.depth + Math.floor(offsetLeft / 40)
        actualDepth =
            actualDepth < minDepth
                ? minDepth
                : actualDepth > maxDepth
                    ? maxDepth
                    : actualDepth

        const prevTodoId = prevIndex >= 0 ? todos[prevIndex].id : null

        return { actualDepth, prevTodoId }
    }

    const progress = (id: number, isDone: boolean) => {
        dispatch(toggleTodoProgress(id))
        setStatuses(prevStatuses =>
            setStatus(prevStatuses, 'isDone', isDone, id)
        )
    }

    const hiding = (id: number, isHiddenSubTasks: boolean) => {
        dispatch(toggleTodoHiding(id))
        setStatuses(prevStatuses =>
            setStatus(prevStatuses, 'isHiddenSubTodo', isHiddenSubTasks, id)
        )
    }

    const onDragStart = ({ active }: DragStartEvent) => {
        const todo =
            todos.find(todo => todo.id.toString() === active.id) || null
        setDraggedTodo(todo)
        if (todo && todo.showHideButton && !todo.isHiddenSubTasks)
            dispatch(toggleTodoHiding(todo.id))
    }

    const onDragMove = ({ delta, active, over }: DragMoveEvent) => {
        const activeId = active.id
        const overId = over?.id || null

        const activeItem = todos.find(todo => todo.id.toString() === activeId)

        if (overId && activeItem) {
            const { actualDepth, prevTodoId } = getDepth(
                activeItem,
                overId,
                delta.x
            )
            setDraggedTodoDepth(actualDepth)
            setPrevTodoId(prevTodoId)
        } else {
            setDraggedTodoDepth(null)
            setPrevTodoId(null)
        }
    }

    const onDragEnd = ({ active, over }: DragEndEvent) => {
        const todo =
            todos.find(todo => todo.id.toString() === active.id) || null
        if (todo && todo.isHiddenSubTasks !== draggedTodo?.isHiddenSubTasks)
            dispatch(toggleTodoHiding(todo.id))

        if (over && draggedTodoDepth !== null)
            dispatch(
                moveTodo({ id: active.id, prevTodoId, depth: draggedTodoDepth })
            )

        onDragCancel()
    }

    const onDragCancel = () => {
        setDraggedTodo(null)
        setDraggedTodoDepth(null)
        setPrevTodoId(null)
    }

    const openDeletePopup = (id: number) => {
        //setPopupMenuVisableId(null)
        confirm({
            title: 'Are you sure delete this category?',
            icon: <ExclamationCircleOutlined />,
            content: 'Some descriptions',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                if (categoryId)
                    dispatch(deleteTodoThunk({ categoryId: Number(categoryId), id }))
            },
        })
    }

    const openEditor = (todo: Todo) => {
        setEditModalId(todo.id)
        setEditModalValue({ value: todo.value, taskEnd: todo.taskEnd ? moment(todo.taskEnd, serverFormat) : undefined })
        setEditModalVisable(true)
    }

    const todoItems = todos.map(todo => {
        return (
            <SortableTodo
                key={todo.id}
                todo={{
                    ...todo,
                    depth:
                        draggedTodo?.id === todo.id && draggedTodoDepth !== null
                            ? draggedTodoDepth
                            : todo.depth,
                }}
                active={draggedTodo?.id === todo.id}
                edit={(id: number) => openEditor(todo)}
                remove={() => openDeletePopup(todo.id)}
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
                <input
                    type='button'
                    value='Новая задача'
                    onClick={() => {
                        setEditModalValue(initialValue)
                        setEditModalVisable(true)
                        setEditModalId(null)
                    }}
                />
            </div>
            <Formik
                validateOnMount
                initialValues={editModalValue}
                enableReinitialize
                // validationSchema={CategorySchema}
                onSubmit={({ value, taskEnd }) => {
                    const selectedCategoryId = Number(categoryId)


                    if (
                        editModalId &&
                        todos.find(x => x.id === editModalId)
                    )
                        dispatch(
                            updateTodoThunk({
                                id: editModalId,
                                categoryId: selectedCategoryId,
                                todoDTO: {
                                    Value: value,
                                    TaskEnd: taskEnd?.toDate()
                                },
                            })
                        )
                    else  {
                        const position = editData ? editData : { ParentId: 0, PrevToDoId: 
                            todos.length > 0
                                ? todos[todos.length - 1].id
                                : 0,}

                        dispatch(createTodoThunk({ 
                            categoryId: selectedCategoryId,
                            todoDTO: { 
                                Value: value,
                                TaskEnd: taskEnd?.toDate(),
                                ...position
                            } 
                        }))
                    }

                    setEditModalVisable(false)
                }}
            >
                {({ submitForm, resetForm, isValid, }) => {
                    console.log('Formik Render')
                    return (
                        <Modal
                            title={
                                editModalId
                                    ? 'Изменить задачу'
                                    : 'Добавить новую задачу'
                            }
                            visible={editModalVisable}
                            onCancel={() => setEditModalVisable(false)}
                            afterClose={() => resetForm()}
                            onOk={() => submitForm()}
                            okText={editModalId ? 'Изменить' : 'Сохранить'}
                            cancelText='Отмена'
                            destroyOnClose
                            width={300}
                            bodyStyle={{ paddingBottom: 0 }}
                            okButtonProps={{ disabled: !isValid }}
                        >
                            <Row>
                                <Form style={{ width: '100%' }}>
                                    <FormItem
                                        name='value'
                                        type='text'
                                        placeholder='Название задачи'
                                    />
                                    <FormItem 
                                        name='taskEnd'
                                        type='datepicker'
                                        placeholder='Срок выполнения'
                                    />
                                </Form>
                            </Row>
                        </Modal>
                    )
                }}
            </Formik>
            <Modal
                title={editTodo ? 'Изменить задачу' : 'Добавить задачу'}
                visible={!!editTodo || !!todoPosition}
                onOk={d => {
                    formik.handleSubmit()
                }}
                onCancel={() => {
                    setEditTodo_(null)
                    setTodoPosition(null)
                    formik.setValues({ value: '' })
                }}
            >
                <input
                    name='value'
                    value={formik.values.value}
                    onChange={formik.handleChange}
                />
                <DatePicker
                    name='taskEnd'
                    disabledDate={date => date < moment().startOf('day')}
                    locale={locale}
                    value={formik.values.taskEnd}
                    format={dateFormat}
                    onChange={date => formik.setFieldValue('taskEnd', date)}
                />
            </Modal>
            <div>
                <pre>{consol}</pre>
            </div>
        </div>
    )
}

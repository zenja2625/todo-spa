import { CSSProperties, useEffect, useRef, useState } from 'react'
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
    updateStatusesThunk,
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
import { Col, Form, Modal, Row, Typography } from 'antd'

import moment, { Moment } from 'moment'
import { Formik, useFormik } from 'formik'

import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/ru_RU'
import { useParams } from 'react-router'
import {
    updateCategoryThunk,
    createCategoryThunk,
    deleteCategoryThunk,
} from '../slices/categoriesSlice'
import { FormItem } from './utility/FormItem'
import confirm from 'antd/lib/modal/confirm'

import { DashOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const dateFormat = 'DD.MM.YYYY'
const serverFormat = 'YYYY-MM-DD'

let renderCount = 1
type statusProperties = 'isDone' | 'isHiddenSubTasks'

const isEmptyStatus = (status: TodoStatusDTO) =>
    status.isDone === undefined && status.isHiddenSubTasks === undefined

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
    value: '',
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

    const dispatch = useAppDispatch()
    const selectedCategoryId = useAppSelector(
        state => state.categories.selectedCategoryId
    )
    const todos = useAppSelector(getTodos)
    const todoStatusDTOs = useAppSelector(state => state.todos.todoStatusDTOs)
    const category = useAppSelector(
        state =>
            state.categories.categories.find(
                x => x.id.toString() === categoryId
            )?.name
    )
    const isRequest = useAppSelector(state => state.app.requestCount > 0)

    const [statuses, setStatuses] = useState<Array<TodoStatusDTO>>([])

    const st = useDebounce(todoStatusDTOs, 1000)

    useEffect(() => {
        const statuses = Object.values(st)
        if (statuses.length) {
            dispatch(
                updateStatusesThunk({
                    categoryId: Number(categoryId),
                    todoStatusDTOs: statuses,
                })
            )
        }
    }, [st, categoryId, dispatch])

    const [consol, setConsol] = useState('')

    useEffect(() => {
        if (categoryId) dispatch(getTodosThunk(Number(categoryId)))

        return () => {
            alert(categoryId)
        }
    }, [categoryId, dispatch])

    useEffect(() => {
        setConsol(JSON.stringify(todoStatusDTOs, null, 2))
    }, [todoStatusDTOs])

    if (!Number(categoryId))
        return (
            <Row style={{ height: '100%' }} justify='center' align='middle'>
                <Typography.Title level={2}>
                    Выберите категорию
                </Typography.Title>
            </Row>
        )

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
                    dispatch(
                        deleteTodoThunk({ categoryId: Number(categoryId), id })
                    )
            },
        })
    }

    const openEditor = (todo: Todo) => {
        setEditModalId(todo.id)
        setEditModalValue({
            value: todo.value,
            taskEnd: todo.taskEnd
                ? moment(todo.taskEnd, serverFormat)
                : undefined,
        })
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
        <div className={isRequest ? 'loading' : undefined}>
            <div>Render Count: {renderCount++}</div>
            <Typography.Title level={3}>{category}</Typography.Title>
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

                    if (editModalId && todos.find(x => x.id === editModalId))
                        dispatch(
                            updateTodoThunk({
                                id: editModalId,
                                categoryId: selectedCategoryId,
                                todoDTO: {
                                    Value: value,
                                    TaskEnd: taskEnd?.toDate(),
                                },
                            })
                        )
                    else {
                        const position = editData
                            ? editData
                            : {
                                  ParentId: 0,
                                  PrevToDoId:
                                      todos.length > 0
                                          ? todos[todos.length - 1].id
                                          : 0,
                              }

                        dispatch(
                            createTodoThunk({
                                categoryId: selectedCategoryId,
                                todoDTO: {
                                    Value: value,
                                    TaskEnd: taskEnd?.toDate(),
                                    ...position,
                                },
                            })
                        )
                    }

                    setEditModalVisable(false)
                }}
            >
                {({ submitForm, resetForm, isValid }) => {
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
                            width={350}
                            bodyStyle={{ paddingBottom: 0 }}
                            okButtonProps={{ disabled: !isValid }}
                        >
                            <Form style={{ width: '100%' }}>
                                <Row gutter={10}>
                                    <Col span={14}>
                                        <FormItem
                                            name='value'
                                            type='text'
                                            placeholder='Название задачи'
                                        />
                                    </Col>
                                    <Col span={10}>
                                        <FormItem
                                            name='taskEnd'
                                            type='datepicker'
                                            placeholder='Срок'
                                        />
                                    </Col>
                                </Row>
                            </Form>
                        </Modal>
                    )
                }}
            </Formik>
            <div>
                <pre>{consol}</pre>
            </div>
        </div>
    )
}

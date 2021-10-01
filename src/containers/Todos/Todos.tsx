import React, { CSSProperties, useEffect, useRef, useState } from 'react'
import { TodoPositionDTO, TodoStatusDTO } from '../../api/apiTypes'
import { useDebounce } from '../../hooks/useDebounce'
import { Todo, TodoDTO } from '../../slices/sliceTypes'
import {
    createTodoThunk,
    deleteTodoThunk,
    getTodosThunk,
    moveTodo,
    setTodoEditorState,
    startDragTodo,
    stopDragTodo,
    toggleTodoHiding,
    toggleTodoProgress,
    updatePositionsThunk,
    updateStatusesThunk,
    updateTodoThunk,
} from '../../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../../store'
import { MoreOutlined } from '@ant-design/icons'
import { getTodos } from '../../selectors/getTodos'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableTodo } from '../Todo/SortableTodo'
import { createPortal } from 'react-dom'
import { TodoEditorOld } from '../TodoEditor'
import { Button, Col, Divider, Form, Modal, Row, Space, Typography } from 'antd'

import moment, { Moment } from 'moment'
import { Formik, useFormik } from 'formik'

import { DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/ru_RU'
import { useParams } from 'react-router'
import {
    updateCategoryThunk,
    createCategoryThunk,
    deleteCategoryThunk,
} from '../../slices/categoriesSlice'
import { FormItem } from '../utility/FormItem'
import confirm from 'antd/lib/modal/confirm'

import { DashOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { TodoEditor } from './TodoEditor'
import { TodoEditorValueType } from '../containerTypes'
import { Data, DataRef } from '@dnd-kit/core/dist/store'

const dateFormat = 'DD.MM.YYYY'
const serverFormat = 'YYYY-MM-DD'

let renderCount = 1

type TodoPosition = {
    ParentId: number
    PrevToDoId: number
}

export const Todos = () => {
    const { categoryId } = useParams<{ categoryId?: string }>()

    const dispatch = useAppDispatch()

    const categoryName = useAppSelector(
        state => state.categories.categories.find(x => x.id.toString() === categoryId)?.name
    )

    const todos = useAppSelector(getTodos)
    const actualStatuses = useAppSelector(state => state.todos.todoStatusDTOs)
    const actualPosition = useAppSelector(state => state.todos.todoPositionDTOs)

    const statuses = useDebounce(actualStatuses, 1000)
    const positions = useDebounce(actualPosition, 1000)

    useEffect(() => {
        const statusValues = Object.values(statuses)
        if (statusValues.length) {
            dispatch(
                updateStatusesThunk(Number(categoryId))
            )
        }
    }, [statuses, categoryId, dispatch])

    useEffect(() => {
        if (positions.length) {
            dispatch(
                updatePositionsThunk(Number(categoryId))
            )
        }
    }, [positions, categoryId, dispatch])

    const [consol, setConsol] = useState('')

    useEffect(() => {
        if (categoryId) dispatch(getTodosThunk(Number(categoryId)))

        return () => {
            if (categoryId !== undefined) {
                dispatch(updateStatusesThunk(Number(categoryId)))
                dispatch(updatePositionsThunk(Number(categoryId)))
            }
        }
    }, [categoryId, dispatch])

    useEffect(() => {
        setConsol(
            JSON.stringify(actualStatuses, null, 2) + '\n' + JSON.stringify(actualPosition, null, 2)
        )
    }, [actualStatuses, actualPosition])

    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor)

    const sensors = useSensors(mouseSensor, touchSensor)

    if (!Number(categoryId))
        return (
            <Row style={{ height: '100%' }} justify='center' align='middle'>
                <Typography.Title level={2}>Выберите категорию</Typography.Title>
            </Row>
        )

    const onDragStart = ({ active }: DragStartEvent) => {
        dispatch(updateStatusesThunk(Number(categoryId)))
        dispatch(startDragTodo(active.id))
    }


    const onDragMove = ({ delta, active }: DragMoveEvent) => {
        if (active.data.current) active.data.current.deltaX = delta.x
    }

    const onDragEnd = ({ over, active, delta }: DragEndEvent) => {
        if (over) dispatch(moveTodo({ id: active.id, overId: over.id, deltaX: delta.x }))

        if (active.data.current) active.data.current.deltaX = 0
        dispatch(stopDragTodo())
    }

    const onDragCancel = () => dispatch(stopDragTodo())

    const openDeletePopup = (id: number) => {
        dispatch(updateStatusesThunk(Number(categoryId)))
        dispatch(updatePositionsThunk(Number(categoryId)))
        confirm({
            title: 'Are you sure delete this todo?',
            icon: <ExclamationCircleOutlined />,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: () => {
                if (categoryId) dispatch(deleteTodoThunk({ categoryId: Number(categoryId), id }))
            },
        })
    }

    const todoItems = todos.map(todo => {
        return (
            <SortableTodo
                key={todo.id}
                todos={todos}
                todo={todo}
                remove={() => openDeletePopup(todo.id)}
            />
        )
    })

    return (
        <Space
            style={{
                padding: '15px',
                backgroundColor: 'orchid',
                width: '100%',
            }}
            direction='vertical'
            size='middle'
        >
            {document.getElementById('render') &&
                createPortal(
                    <div>
                        <span>Todos:</span> {renderCount++}
                    </div>,
                    document.getElementById('render') as HTMLElement
                )}

            <Typography.Title level={3} style={{ margin: 0 }}>
                {categoryName}
            </Typography.Title>
            <DndContext
                collisionDetection={closestCenter}
                onDragStart={onDragStart}
                onDragMove={onDragMove}
                onDragEnd={onDragEnd}
                onDragCancel={onDragCancel}
                sensors={sensors}
            >
                <SortableContext
                    items={todos.map(x => ({ id: x.id.toString() }))}
                    strategy={verticalListSortingStrategy}
                >
                    <Space
                        style={{
                            width: '100%',
                            backgroundColor: 'orangered',
                            overflow: 'hidden',
                        }} //****************************** */
                        direction='vertical'
                        size={0}
                        split={<Divider style={{ margin: 0 }} />}
                    >
                        {todoItems}
                    </Space>
                    {createPortal(
                        <DragOverlay>
                            <div>asd</div>
                        </DragOverlay>,
                        document.body
                    )}
                </SortableContext>
            </DndContext>
            <Button
                type='primary'
                onClick={() => dispatch(setTodoEditorState({ isEditorOpen: true }))}
            >
                Новая задача
            </Button>
            <TodoEditor />
            <div>
                <pre>{consol}</pre>
            </div>
        </Space>
    )
}

import { useEffect, useMemo, useState } from 'react'
import {
    clearTodos,
    getTodosThunk,
    moveTodo,
    openTodoEditor,
    startDragTodo,
    stopDragTodo,
    updatePositionsThunk,
    updateStatusesThunk,
} from '../../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../../store'
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    DragMoveEvent,
    DragStartEvent,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { EllipsisOutlined } from '@ant-design/icons'

import { Button, Col, Menu, Popover, Row, Space, Typography } from 'antd'

import { Redirect, useParams } from 'react-router'

import { TodoEditor } from './TodoEditor'
import { TodosList } from './TodosList'
import { openCategoryEditor, toggleShowCompletedTodos } from '../../slices/categoriesSlice'

import './Todos.css'

export const Todos = () => {
    const { categoryId } = useParams<{ categoryId?: string }>()

    const [popoverVisable, setPopoverVisable] = useState(false)

    const dispatch = useAppDispatch()

    const showCompletedTodos = useAppSelector(state => state.categories.showCompletedTodos)
    const categories = useAppSelector(state => state.categories.items)
    const selectedCategory = useMemo(
        () => categories.find(category => category.id.toString() === categoryId),
        [categories, categoryId]
    )

    useEffect(() => {
        if (selectedCategory) {
            dispatch(clearTodos())
            dispatch(getTodosThunk({ categoryId: selectedCategory.id, withCompleted: showCompletedTodos}))
        }

        return () => {
            if (selectedCategory) {
                dispatch(updateStatusesThunk(selectedCategory.id))
                dispatch(updatePositionsThunk(selectedCategory.id))
            }
        }
    }, [selectedCategory, showCompletedTodos, dispatch])

    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor)

    const sensors = useSensors(mouseSensor, touchSensor)

    const popoverMenu = () => {
        return (
            <Menu style={{ border: 0 }}>
                <Menu.Item
                    onClick={() => {
                        setPopoverVisable(false)
                        if (selectedCategory) {
                            dispatch(
                                openCategoryEditor({
                                    editId: selectedCategory.id,
                                    value: selectedCategory.name,
                                })
                            )
                        }
                    }}
                >
                    Изменить
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        setPopoverVisable(false)
                        dispatch(toggleShowCompletedTodos())
                    }}
                >
                    {showCompletedTodos ? 'Скрывать выполненые задачи' : 'Показывать выполненые задачи'}
                </Menu.Item>
            </Menu>
        )
    }

    const onDragStart = ({ active }: DragStartEvent) => {
        if (selectedCategory) dispatch(updateStatusesThunk(selectedCategory.id))
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

    if (!selectedCategory) {
        return (
            <>
                <Row
                    style={{ height: '100%', textAlign: 'center' }}
                    justify='center'
                    align='middle'
                >
                    <Col>
                        <Typography.Title level={2}>Выберите категорию</Typography.Title>
                    </Col>
                </Row>
                <Redirect from='/category/:categoryId' to='/' />
            </>
        )
    } else {
        return (
            <Row gutter={[0, 12]} style={{ height: '100%', overflowY: 'scroll', position: 'sticky', backgroundColor: 'lightsteelblue' }}>
                <Col className='todos-row-wrapper' style={{ position: 'sticky', top: 0, zIndex: 100, backgroundColor: 'darkslateblue' }}>
                    <Row justify='space-between' className='todos-row'>
                        <Col>Row 1.1</Col>
                        <Col>Row 1.2</Col>
                    </Row>
                </Col>
                <Col className='todos-row-wrapper' style={{ backgroundColor: 'lightseagreen' }}>
                    <Row className="todos-row">
                        <Col>
                            <div style={{ height: '1000px', }}>Row 2</div>
                        </Col>
                    </Row>
                </Col>
                <Col className='todos-row-wrapper'>
                    <Row className="todos-row">
                        <Col>
                            <Button type='primary' style={{ width: '100%' }} onClick={() => dispatch(openTodoEditor())}>
                                Новая задача
                            </Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        )
    }
}

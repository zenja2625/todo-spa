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
import AutoSizer from 'react-virtualized-auto-sizer'
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
import { TodosList } from './TodosListNew'
import { openCategoryEditor, toggleShowCompletedTodos } from '../../slices/categoriesSlice'

import './Todos.css'
import { TodoItems } from './TodoItems'
import { Tree } from '../../Tree/Tree'

export const Todos = () => {
    const [isNew, setIsNew] = useState(true)

    const { categoryId } = useParams<{ categoryId?: string }>()

    const [popoverVisable, setPopoverVisable] = useState(false)

    const dispatch = useAppDispatch()

    const showCompletedTodos = useAppSelector(state => state.categories.showCompletedTodos)
    const categories = useAppSelector(state => state.categories.items)
    const selectedCategory = useMemo(
        () => categories.find(category => category.id === categoryId),
        [categories, categoryId]
    )

    useEffect(() => {
        if (selectedCategory) {
            dispatch(clearTodos())
            dispatch(
                getTodosThunk({
                    categoryId: selectedCategory.id,
                    withCompleted: showCompletedTodos,
                })
            )
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
                    {showCompletedTodos
                        ? 'Скрывать выполненые задачи'
                        : 'Показывать выполненые задачи'}
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

    const Header = (
        <Row
            style={{
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backgroundColor: '#f0f2f5',
                padding: '15px 0 15px 45px',
                marginLeft: '-45px',
            }}
            justify='space-between'
        >
            <Col>
                <Typography.Title level={3} style={{ margin: 0 }}>
                    {selectedCategory?.name}
                </Typography.Title>
            </Col>
            <Col>
                <Popover
                    destroyTooltipOnHide={{ keepParent: false }}
                    visible={popoverVisable}
                    onVisibleChange={visable => {
                        if (visable) setPopoverVisable(true)
                        else setPopoverVisable(false)
                    }}
                    placement='bottom'
                    content={() => popoverMenu()}
                    trigger='click'
                >
                    <Button type='text' style={{ height: '100%', paddingTop: 0, paddingBottom: 0 }}>
                        <EllipsisOutlined style={{ fontSize: '2em' }} />
                    </Button>
                </Popover>
            </Col>
        </Row>
    )

    const Footer = (
        <Button
            type='primary'
            style={{ width: '100%', marginBottom: '100px' }}
            onClick={() => dispatch(openTodoEditor())}
        >
            Новая задача
        </Button>
    )

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
            <>
                <div
                    id='ds'
                    style={{
                        width: '100%',
                        height: '100%',
                    }}
                >
                    <TodosList categoryId={categoryId || ''} header={Header} footer={Footer} />
                </div>
            </>
        )
    }
}

import { useEffect, useMemo } from 'react'
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
import { createPortal } from 'react-dom'
import { Button, Col, Row, Space, Typography } from 'antd'

import { Redirect, useParams } from 'react-router'

import { TodoEditor } from './TodoEditor'
import { TodosList } from './TodosList'

let renderCount = 1

export const Todos = () => {
    console.log('Render Todos')
    const { categoryId } = useParams<{ categoryId?: string }>()

    const dispatch = useAppDispatch()

    const categories = useAppSelector(state => state.categories.categories)
    const selectedCategory = useMemo(
        () => categories.find(category => category.id.toString() === categoryId),
        [categories, categoryId]
    )

    useEffect(() => {
        if (selectedCategory) {
            dispatch(clearTodos())
            dispatch(getTodosThunk(selectedCategory.id))
        }

        return () => {
            if (selectedCategory) {
                dispatch(updateStatusesThunk(selectedCategory.id))
                dispatch(updatePositionsThunk(selectedCategory.id))
            }
        }
    }, [selectedCategory, dispatch])

    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor)

    const sensors = useSensors(mouseSensor, touchSensor)

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
            <Row
                justify='center'
                style={{ overflowY: 'auto', height: '100%', padding: '15px 15px' }}
            >
                <Col style={{ maxWidth: '800px', width: '100%' }}>
                    <Space
                        style={{
                            width: '100%',
                            height: '100%',
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
                            {selectedCategory.name}
                        </Typography.Title>
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragStart={onDragStart}
                            onDragMove={onDragMove}
                            onDragEnd={onDragEnd}
                            onDragCancel={onDragCancel}
                            sensors={sensors}
                        >
                            <TodosList categoryId={selectedCategory.id} />
                        </DndContext>
                        <Button type='primary' onClick={() => dispatch(openTodoEditor())}>
                            Новая задача
                        </Button>
                        <TodoEditor categoryId={selectedCategory.id} />
                    </Space>
                </Col>
            </Row>
        )
    }
}

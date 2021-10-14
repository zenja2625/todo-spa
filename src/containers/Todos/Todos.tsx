import { useEffect } from 'react'
import {
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

import { useParams } from 'react-router'

import { TodoEditor } from './TodoEditor'
import { TodosList } from './TodosList'

let renderCount = 1

export const Todos = () => {
    const { categoryId } = useParams<{ categoryId?: string }>()
    console.log('Todos')
    const dispatch = useAppDispatch()

    const categoryName = useAppSelector(
        state => state.categories.categories.find(x => x.id.toString() === categoryId)?.name
    )

    useEffect(() => {
        if (categoryId) dispatch(getTodosThunk(Number(categoryId)))

        return () => {
            if (categoryId !== undefined) {
                dispatch(updateStatusesThunk(Number(categoryId)))
                dispatch(updatePositionsThunk(Number(categoryId)))
            }
        }
    }, [categoryId, dispatch])

    const mouseSensor = useSensor(MouseSensor)
    const touchSensor = useSensor(TouchSensor)

    const sensors = useSensors(mouseSensor, touchSensor)

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

    return (
        <Row justify='center' style={{overflowY: 'scroll', height: '100%', padding: '15px 15px' }}>
            <Col style={{ maxWidth: '800px', width: '100%', }}>
            <Space
            style={{

                width: '100%',
                height: '100%'
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

            <Typography.Title level={3} style={{margin: 0}}>
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
                <TodosList categoryId={Number(categoryId)} />
            </DndContext>
            <Button
                type='primary'
                onClick={() => dispatch(openTodoEditor())}
            >
                Новая задача
            </Button>
            <TodoEditor categoryId={Number(categoryId)}/>
        </Space>
            </Col>
        </Row>
    )
}

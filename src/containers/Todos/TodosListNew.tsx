import { DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Space, Row, Typography, Col } from 'antd'
import { FC, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { getTodos } from '../../selectors/getTodos'
import { updateStatusesThunk, updatePositionsThunk, deleteTodoThunk } from '../../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../../store'
import { SortableTodo } from './SortableTodo'
import confirm from 'antd/lib/modal/confirm'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useDebounce } from '../../hooks/useDebounce'
import { ITodosProps } from './types'
import { TodoItem1 } from './TodoItem1'
import { onUnload } from '../../utility/onUnload'
import { Tree } from '../../Tree/Tree'

export const TodosList: FC<ITodosProps> = ({ categoryId, header, footer }) => {
    const todos = useAppSelector(getTodos)
    const actualStatuses = useAppSelector(state => state.todos.todoStatusDTOs)
    const actualPosition = useAppSelector(state => state.todos.todoPositionDTOs)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)
    const draggedTodoId = useAppSelector(state => state.todos.draggedTodoId)
    const draggedTodo = todos.find(todo => todo.id === draggedTodoId)

    const dispatch = useAppDispatch()

    useEffect(() => {}, [todosRequestId])

    const statuses = useDebounce(actualStatuses, 1000)
    const positions = useDebounce(actualPosition, 1000)

    useEffect(() => {
        if (actualStatuses.length || actualPosition.length)
            window.addEventListener('beforeunload', onUnload)

        return () => window.removeEventListener('beforeunload', onUnload)
    }, [actualStatuses, actualPosition])

    useEffect(() => {
        if (statuses.length) {
            dispatch(updateStatusesThunk(categoryId))
        }
    }, [statuses, categoryId, dispatch])

    useEffect(() => {
        if (positions.length) {
            dispatch(updatePositionsThunk(categoryId))
        }
    }, [positions, categoryId, dispatch])

    const openDeletePopup = (id: string, todoValue: string) => {
        dispatch(updateStatusesThunk(categoryId))
        dispatch(updatePositionsThunk(categoryId))
        confirm({
            title: (
                <>
                    Вы действительно хотите удалить{' '}
                    <Typography.Text strong>{todoValue}</Typography.Text>?
                </>
            ),
            icon: <ExclamationCircleOutlined />,
            okText: 'Да',
            okType: 'danger',
            cancelText: 'Нет',
            maskClosable: true,
            onOk: () => {
                if (categoryId) dispatch(deleteTodoThunk({ categoryId, id }))
            },
        })
    }

    const todoItems = todos.map(todo => {
        return (
            <SortableTodo
                key={todo.id}
                todos={todos}
                todo={todo}
                remove={() => openDeletePopup(todo.id, todo.value)}
            />
        )
    })

    if (todosRequestId && !todos.length) {
        return <div>Загрузка...</div>
    }
    if (!todos.length) {
        return (
            <Row justify='center' style={{ paddingTop: '50px', paddingBottom: '50px' }}>
                <Col>
                    <Typography.Title level={4}>Создайте новую задачу</Typography.Title>
                </Col>
            </Row>
        )
    } else {
        return (
            <div
                style={{
                    height: '100%',
                }}
            >
                <Tree
                    depthWidth={40}
                    gap={10}
                    itemHeight={45}
                    items={todos.map(todo => ({
                        ...todo,
                        isOpen: !todo.isHiddenSubTasks,
                    }))}
                    maxDepth={5}
                    setItems={() => {}}
                    header={header}
                    footer={footer}
                />
            </div>
        )
    }
}

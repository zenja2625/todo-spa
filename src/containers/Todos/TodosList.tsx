import { DragOverlay } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Space, Row, Typography } from 'antd'
import { FC, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { getTodos } from '../../selectors/getTodos'
import { updateStatusesThunk, updatePositionsThunk, deleteTodoThunk } from '../../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../../store'
import { SortableTodo } from '../Todo/SortableTodo'
import confirm from 'antd/lib/modal/confirm'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useDebounce } from '../../hooks/useDebounce'
import { ITodosProps } from './types'
import { TodoItem } from '../TodoItem'

export const TodosList: FC<ITodosProps> = ({ categoryId }) => {
    console.log('Render TodosList')
    const [isLoadingTodos, setIsLoadingTodos] = useState(false)

    const todos = useAppSelector(getTodos)
    const actualStatuses = useAppSelector(state => state.todos.todoStatusDTOs)
    const actualPosition = useAppSelector(state => state.todos.todoPositionDTOs)
    const todosRequestId = useAppSelector(state => state.todos.todosRequestId)
    const draggedTodoId = useAppSelector(state => state.todos.draggedTodoId)
    const draggedTodo = todos.find(todo => todo.id === draggedTodoId)
 
    const dispatch = useAppDispatch()

    useEffect(() => {

    }, [todosRequestId])

    const statuses = useDebounce(actualStatuses, 1000)
    const positions = useDebounce(actualPosition, 1000)

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

    const openDeletePopup = (id: number, todoValue: string) => {
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
                if (!Number.isNaN(categoryId)) dispatch(deleteTodoThunk({ categoryId, id }))
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

    if (Number.isNaN(categoryId)) {
        return (
            <Row style={{ height: '100%' }} justify='center' align='middle'>
                <Typography.Title level={2}>Выберите категорию</Typography.Title>
            </Row>
        )
    } else if (todosRequestId && !todos.length) {
        return <div>Загрузка...</div>
    } else {
        return (
            <SortableContext
                items={todos.map(x => ({ id: x.id.toString() }))}
                strategy={verticalListSortingStrategy}
            >
                <Space
                    style={{
                        width: '100%'
                    }}
                    direction='vertical'

                    size={2}
                    // split={<Divider style={{ margin: 0 }} />}
                >
                    {todoItems}
                </Space>
                {createPortal(
                    <DragOverlay>
                        {draggedTodo && <TodoItem todo={draggedTodo} dragged/>}
                    </DragOverlay>,
                    document.body
                )}
            </SortableContext>
        )
    }
}
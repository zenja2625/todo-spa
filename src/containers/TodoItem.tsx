import { CSSProperties, FC } from 'react'
import { Todo } from '../slices/sliceTypes'
import { MoreOutlined, RightOutlined, DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import {
    depthIndent,
    openTodoEditor,
    toggleTodoHiding,
    toggleTodoProgress,
} from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
<<<<<<< HEAD
import { Button, Popover, Skeleton } from 'antd'
=======
import { Checkbox, Col, Row, Skeleton, Space, Typography } from 'antd'
>>>>>>> 7102bf9975bd81d2f3ff8e51080a3f77e1f4507e
import moment from 'moment'
import { appDateFormat, serverDateFormat } from '../dateFormat'
import './todoItem.css'

type TodoItemPropsType = {
    todo: Todo
    active?: boolean
    dragRef?: (element: HTMLElement | null) => void
    handleProps: any
    remove: () => void
}

export const TodoItem: FC<TodoItemPropsType> = ({
    todo,
    dragRef,
    handleProps,
    remove,
    active,
}) => {
    const dispatch = useAppDispatch()

    const taskEnd = todo.taskEnd ? moment(todo.taskEnd, serverDateFormat) : undefined

    const style: CSSProperties = {
        marginLeft: `${depthIndent * todo.depth}px`
    }

    if (active)
        return (
            <div
                style={{
                    backgroundColor: 'lightgray',
                    marginLeft: `${depthIndent * todo.depth}px`,
                    height: '30px',
                }}
            ></div>
        )

    return (
        <Row justify='space-between' style={style} className='todo-item'>
            <Col>
                <MoreOutlined ref={dragRef} {...handleProps} className='before-todo'/>
                <Space>
                {!todo.showHideButton 
                    ? <div className='empty-icon'/>
                    : todo.isHiddenSubTasks 
                        ? <RightOutlined className='hidden-icon' onClick={() => dispatch(toggleTodoHiding(todo.id))}/>
                        : <DownOutlined className='hidden-icon' onClick={() => dispatch(toggleTodoHiding(todo.id))}/>
                    }

<<<<<<< HEAD
            <input
                type='button'
                value='✎'
                onClick={() =>
                    dispatch(
                        openTodoEditor({
                            editId: todo.id,
                            value: {
                                value: todo.value,
                                taskEnd: taskEnd
                            }
                        })
                    )
                }
            />
            <input type='button' value='❌' onClick={remove} />
            <input
                type='button'
                value='↑'
                onClick={() =>
                    dispatch(
                        openTodoEditor({
                            prevId: todo.id,
                            addBefore: true,
                        })
                    )
                }
            />
            <input
                type='button'
                value='↓'
                onClick={() =>
                    dispatch(
                        openTodoEditor({
                            prevId: todo.id
                        })
                    )
                }
            />
        </div>
=======
                    <Checkbox onChange={() => dispatch(toggleTodoProgress(todo.id))} checked={todo.isDone}/>
                    {todo.value}
                </Space>
            </Col>
            <Col>
                <EllipsisOutlined />
            </Col>
        </Row>
>>>>>>> 7102bf9975bd81d2f3ff8e51080a3f77e1f4507e
    )
}

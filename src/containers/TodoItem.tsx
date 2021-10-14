import { CSSProperties, FC, useState } from 'react'
import { Todo } from '../slices/sliceTypes'
import { MoreOutlined, RightOutlined, DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import {
    depthIndent,
    openTodoEditor,
    toggleTodoHiding,
    toggleTodoProgress,
} from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { Button, Checkbox, Col, Menu, Popover, Row, Skeleton, Space, Typography } from 'antd'
import moment from 'moment'
import { appDateFormat, serverDateFormat } from '../dateFormat'
import './todoItem.css'

type TodoItemPropsType = {
    todo: Todo
    active?: boolean
    dragRef?: (element: HTMLElement | null) => void
    handleProps?: any
    remove?: () => void
    dragged?: boolean
}

export const TodoItem: FC<TodoItemPropsType> = ({
    todo,
    dragRef,
    handleProps,
    remove,
    active,
}) => {
    const [popoverVisable, setPopoverVisable] = useState(false)

    const dispatch = useAppDispatch()

    const taskEnd = todo.taskEnd ? moment(todo.taskEnd, serverDateFormat) : undefined

    const style: CSSProperties = {
        marginLeft: `${depthIndent * todo.depth}px`
    }

    const popoverMenu = () => {

        return (
            <Menu style={{ border: 0 }}>
                <Menu.Item
                    onClick={() => {
                        setPopoverVisable(false)
                        dispatch(openTodoEditor({ editId: todo.id, value: { value: todo.value, taskEnd } }))
                    }}
                >
                    Изменить
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        setPopoverVisable(false)
                        dispatch(openTodoEditor({ overId: todo.id, addBefore: true }))
                    }}
                >
                    Добавить выше
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        setPopoverVisable(false)
                        dispatch(openTodoEditor({ overId: todo.id }))
                    }}
                >
                    Добавить ниже
                </Menu.Item>
                <Menu.Item
                    onClick={() => {
                        setPopoverVisable(false)
                        if (remove)
                            remove()
                    }}
                >
                    Удалить
                </Menu.Item>
            </Menu>
        )
    }

    if (active)
        return (
            <div
                style={{
                    backgroundColor: 'lightgray',
                    marginLeft: `${depthIndent * todo.depth}px`,
                    height: '40px',
                }}
            ></div>
        )

    return (
        <Row justify='space-between' align='middle' style={style} className='todo-item'>
            <Col>
                <MoreOutlined ref={dragRef} {...handleProps} className='before-todo' />
                <Space>
                    {!todo.showHideButton
                        ? <div className='empty-icon' />
                        : todo.isHiddenSubTasks
                            ? <RightOutlined className='hidden-icon' onClick={() => dispatch(toggleTodoHiding(todo.id))} />
                            : <DownOutlined className='hidden-icon' onClick={() => dispatch(toggleTodoHiding(todo.id))} />
                    }

                    <Checkbox onChange={() => dispatch(toggleTodoProgress(todo.id))} checked={todo.isDone} />
                    {todo.value}
                </Space>
            </Col>
            <Col onClick={event => event.stopPropagation()}>
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
                    <Button type='text' style={{ height: '100%' }}>
                        <EllipsisOutlined />
                    </Button>
                </Popover>
            </Col>
        </Row>
    )
}

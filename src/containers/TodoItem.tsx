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
    dragged,
}) => {
    const [popoverVisable, setPopoverVisable] = useState(false)

    const dispatch = useAppDispatch()

    const style: CSSProperties = {
        marginLeft: dragged ? undefined : `${depthIndent * todo.depth}px`,
        boxShadow: dragged ? '2px 2px 7px 1px lightgray' : undefined,
        height: '45px',
    }
    const dateClass =
        todo.taskEnd && moment().isAfter(todo.taskEnd, 'day')
            ? 'todo-taskEnd todo-expired'
            : 'todo-taskEnd'

    const popoverMenu = () => {
        return (
            <Menu style={{ border: 0 }}>
                <Menu.Item
                    onClick={() => {
                        setPopoverVisable(false)
                        dispatch(
                            openTodoEditor({
                                editId: todo.id,
                                value: { value: todo.value, taskEnd: todo.taskEnd },
                            })
                        )
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
                        if (remove) remove()
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
                    ...style,
                }}
            />
        )

    return (
        <Row
            ref={dragRef}
            justify='space-between'
            align='middle'
            style={style}
            className='todo-item'
        >
            <Col>
                <MoreOutlined {...handleProps} className='before-todo' />

                <Space>
                    {!todo.showHideButton || dragged ? (
                        <div className='empty-icon' />
                    ) : todo.isHiddenSubTasks ? (
                        <RightOutlined
                            className='hidden-icon'
                            onClick={() => dispatch(toggleTodoHiding(todo.id))}
                        />
                    ) : (
                        <DownOutlined
                            className='hidden-icon'
                            onClick={() => dispatch(toggleTodoHiding(todo.id))}
                        />
                    )}

                    <Checkbox
                        onChange={() => dispatch(toggleTodoProgress(todo.id))}
                        checked={todo.isDone}
                    />
                    <div>
                        {todo.value}
                        <div className={dateClass}>{todo.taskEnd?.format('DD MMMM YYYY')}</div>
                    </div>
                </Space>
            </Col>
            <Col onClick={event => event.stopPropagation()}>
                {!dragged && (
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
                )}
            </Col>
        </Row>
    )
}

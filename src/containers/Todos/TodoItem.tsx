import { Menu, Row, Col, Space, Checkbox, Popover, Button } from 'antd'
import moment from 'moment'
<<<<<<< HEAD
import { CSSProperties, FC, LegacyRef, useContext, useLayoutEffect, useRef, useState } from 'react'
=======
import { CSSProperties, FC, useState } from 'react'
>>>>>>> 4314e69ce0844ce828107cc03aef8c1da817470b
import { appDateFormat } from '../../dateFormat'
import { Todo } from '../../slices/sliceTypes'
import { MoreOutlined, RightOutlined, DownOutlined, EllipsisOutlined } from '@ant-design/icons'

import { openTodoEditor, toggleTodoHiding, toggleTodoProgress } from '../../slices/todosSlice'
import { SyntheticEvents } from '../../sortableTree/types'
import { useAppDispatch } from '../../store'
<<<<<<< HEAD
import { Context } from '../../sortableTree/Components/Tree'

type TodoItemProps = {
    style?: CSSProperties
    className?: string
=======

type TodoItemProps = {
>>>>>>> 4314e69ce0844ce828107cc03aef8c1da817470b
    todo: Todo
    listeners?: SyntheticEvents | undefined
    remove?: () => void
}

<<<<<<< HEAD
export const TodoItem: FC<TodoItemProps> = ({ todo, listeners, remove, style, className }) => {
=======
export const TodoItem: FC<TodoItemProps> = ({ todo, listeners, remove }) => {
>>>>>>> 4314e69ce0844ce828107cc03aef8c1da817470b
    const [popoverVisable, setPopoverVisable] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    const dispatch = useAppDispatch()

<<<<<<< HEAD
    const cont = useContext(Context)
    
    useLayoutEffect(() => {
        cont.addItem(todo, ref)
        return () => {
            cont.removeItem(todo.id)
        }
    }, [cont, todo])

=======
>>>>>>> 4314e69ce0844ce828107cc03aef8c1da817470b
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

    return (
<<<<<<< HEAD
        <div ref={ref} style={style} className={className}>
            <Row justify='space-between' align='middle' className='todo-item'>
                <Col>
                    {/* <MoreOutlined {...listeners} className='before-todo' /> */}
                    <MoreOutlined {...listeners} />
                    <Space>
                        {!todo.showHideButton ? (
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
                            <div className={dateClass}>{todo.taskEnd?.format(appDateFormat)}</div>
                        </div>
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
        </div>
=======
        <Row justify='space-between' align='middle' className='todo-item'>
            <Col>
                <MoreOutlined {...listeners} className='before-todo' />
                <Space>
                    {!todo.showHideButton ? (
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
                        <div className={dateClass}>{todo.taskEnd?.format(appDateFormat)}</div>
                    </div>
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
>>>>>>> 4314e69ce0844ce828107cc03aef8c1da817470b
    )
}

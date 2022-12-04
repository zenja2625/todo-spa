import { CSSProperties, FC, useEffect, useState } from 'react'
import { Todo } from '../../slices/sliceTypes'
import { MoreOutlined, RightOutlined, DownOutlined, EllipsisOutlined } from '@ant-design/icons'
import {
    depthIndent,
    openTodoEditor,
    toggleTodoHiding,
    toggleTodoProgress,
} from '../../slices/todosSlice'
import { useAppDispatch } from '../../store'
import { Button, Checkbox, Col, Menu, Popover, Row, Space, Typography } from 'antd'
import moment from 'moment'
import { appDateFormat } from '../../dateFormat'
import './todoItem.css'

const { Text } = Typography

type TodoItemPropsType = {
    todo: Todo
    active?: boolean
    dragRef?: (element: HTMLElement | null) => void
    handleProps?: any
    remove?: () => void
    dragged?: boolean
    toggleIsOpen?: (id: string) => void
    toggleIsCheck?: (id: string) => void
}

export const TodoItem1: FC<TodoItemPropsType> = ({
    todo,
    handleProps,
    remove,
    active,
    dragged,
    toggleIsOpen,
    toggleIsCheck,
}) => {
    useEffect(() => {
        console.log(todo.id);
        
    })


    const [popoverVisable, setPopoverVisable] = useState(false)

    const dispatch = useAppDispatch()

    const style: CSSProperties = {
        // marginLeft: dragged ? undefined : `${depthIndent * todo.depth}px`,
        boxShadow: dragged ? '2px 2px 7px 1px lightgray' : undefined,
        height: '45px',
    }
    const dateClass =
        todo.taskEnd && moment().isAfter(todo.taskEnd, 'day')
            ? 'todo-taskEnd todo-expired todo-ellipsis-text'
            : 'todo-taskEnd todo-ellipsis-text'

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
    // console.log(handleProps);

    //<Checkbox onChange={() => toggleIsCheck?.(todo.id)} checked={todo.isDone} />
    return (
        <div className='todo-item'>
            <span {...handleProps} className='anticon anticon-more before-todo'>
                <svg
                    viewBox='64 64 896 896'
                    focusable='false'
                    data-icon='more'
                    width='1em'
                    height='1em'
                    fill='currentColor'
                    aria-hidden='true'
                >
                    <path d='M456 231a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0zm0 280a56 56 0 10112 0 56 56 0 10-112 0z'></path>
                </svg>
            </span>
            {!todo.showHideButton || dragged ? (
                <div className='empty-icon' />
            ) : !todo.isHiddenSubTasks ? (
                <span
                    className='anticon anticon-right hidden-icon'
                    onClick={() => toggleIsOpen?.(todo.id)}
                >
                    <svg
                        viewBox='64 64 896 896'
                        focusable='false'
                        data-icon='right'
                        width='1em'
                        height='1em'
                        fill='currentColor'
                        aria-hidden='true'
                    >
                        <path d='M765.7 486.8L314.9 134.7A7.97 7.97 0 00302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 000-50.4z'></path>
                    </svg>
                </span>
            ) : (
                <span
                    className='anticon anticon-down hidden-icon'
                    onClick={() => toggleIsOpen?.(todo.id)}
                >
                    <svg
                        viewBox='64 64 896 896'
                        focusable='false'
                        data-icon='down'
                        width='1em'
                        height='1em'
                        fill='currentColor'
                        aria-hidden='true'
                    >
                        <path d='M884 256h-75c-5.1 0-9.9 2.5-12.9 6.6L512 654.2 227.9 262.6c-3-4.1-7.8-6.6-12.9-6.6h-75c-6.5 0-10.3 7.4-6.5 12.7l352.6 486.1c12.8 17.6 39 17.6 51.7 0l352.6-486.1c3.9-5.3.1-12.7-6.4-12.7z'></path>
                    </svg>
                </span>
            )}
            <label className='ant-checkbox-wrapper'>
                <span className={'ant-checkbox' + (todo.isDone ? ' ant-checkbox-checked' : '')}>
                    <input className='ant-checkbox-input' type='checkbox' value='' />
                    <span className='ant-checkbox-inner'></span>
                </span>
            </label>
            <div className='todo-text-wrapper'>
                <div className='todo-ellipsis-text'>{todo.value}</div>
                <div className={dateClass}>{todo.taskEnd?.format(appDateFormat)}</div>
            </div>
            {!dragged && (
                <button
                    onClick={() => {
                        !popoverVisable && setPopoverVisable(true)
                    }}
                    type='button'
                    className='ant-btn ant-btn-text'
                >
                    <span role='img' className='anticon anticon-ellipsis'>
                        <svg
                            viewBox='64 64 896 896'
                            focusable='false'
                            data-icon='ellipsis'
                            width='1em'
                            height='1em'
                            fill='currentColor'
                            aria-hidden='true'
                        >
                            <path d='M176 511a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0zm280 0a56 56 0 10112 0 56 56 0 10-112 0z'></path>
                        </svg>
                    </span>
                    {popoverVisable && (
                        <Popover
                            destroyTooltipOnHide={{ keepParent: false }}
                            visible={popoverVisable}
                            onVisibleChange={visable => {
                                setPopoverVisable(visable)
                            }}
                            placement='bottom'
                            content={() => popoverMenu()}
                            trigger='click'
                        >
                            <div
                                style={{
                                    backgroundColor: 'red',
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                }}
                            ></div>
                        </Popover>
                    )}
                </button>
            )}
        </div>
    )
}

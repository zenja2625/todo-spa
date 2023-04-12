import { Menu, Popover, Typography, MenuProps, Checkbox } from 'antd'
import moment from 'moment'
import { FC, memo, useEffect, useState } from 'react'
import { areEqual } from 'react-window'
import { appDateFormat } from '../../dateFormat'
import { Todo } from '../../slices/sliceTypes'
import { openTodoEditor, toggleTodoHiding, toggleTodoProgress } from '../../slices/todosSlice'
import { useAppDispatch } from '../../store'
import './todoItem.css'

type MenuKeys = 'change' | 'up' | 'down' | 'remove'
type MenuItem = Required<MenuProps>['items'][number]
const getItem = (
    label: React.ReactNode,
    key: MenuKeys,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group'
) =>
    ({
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem)

type TodoItemPropsType = {
    todo: Todo
    handleProps?: any
    dragged?: boolean
}

export const TodoItem: FC<TodoItemPropsType> = memo(
    ({
        todo: { id, value, depth, isDone, isOpen, showHideButton, taskEnd },
        handleProps,
        dragged,
    }) => {
        const [isPopoverOpen, setIsPopoverOpen] = useState(false)

        const dispatch = useAppDispatch()

        useEffect(() => {
            // console.log('todo.id')
        })

        const dateClass =
            taskEnd && moment().isAfter(taskEnd, 'day')
                ? 'todo-taskEnd todo-ellipsis-text todo-expired'
                : 'todo-taskEnd todo-ellipsis-text'

        const menuItems: MenuProps['items'] = [
            getItem('Изменить', 'change'),
            getItem('Добавить выше', 'up'),
            getItem('Добавить ниже', 'down'),
            getItem('Удалить', 'remove'),
        ]

        const onClick: MenuProps['onClick'] = e => {
            switch (e.key as MenuKeys) {
                case 'change':
                    break
            }
        }
        const popoverMenu = () => {
            return <Menu theme='light' onClick={onClick} items={menuItems}></Menu>
        }

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
                {!showHideButton || dragged ? (
                    <div className='empty-icon' />
                ) : !isOpen ? (
                    <span
                        className='anticon anticon-right hidden-icon'
                        onClick={() => dispatch(toggleTodoHiding(id))}
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
                        onClick={() => dispatch(toggleTodoHiding(id))}
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
                <label className='ant-checkbox-wrapper css-dev-only-do-not-override-26rdvq'>
                    <span
                        className={
                            'ant-checkbox css-dev-only-do-not-override-26rdvq' +
                            (isDone ? ' ant-checkbox-checked' : '')
                        }
                    >
                        <input
                            type='checkbox'
                            className='ant-checkbox-input'
                            onChange={() => dispatch(toggleTodoProgress(id))}
                        />
                        <span className='ant-checkbox-inner'></span>
                    </span>
                </label>
                <div className='todo-text-wrapper'>
                    <div className='todo-ellipsis-text'>{value}</div>
                    <div className={dateClass}>{taskEnd?.format(appDateFormat)}</div>
                </div>
                {!dragged && (
                    <button
                        onClick={() => {
                            !isPopoverOpen && setIsPopoverOpen(true)
                        }}
                        type='button'
                        className='ant-btn css-dev-only-do-not-override-26rdvq ant-btn-text todo-popmenu-button'
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
                        {isPopoverOpen && (
                            <Popover
                                destroyTooltipOnHide={{ keepParent: false }}
                                open={isPopoverOpen}
                                onOpenChange={open => {
                                    setIsPopoverOpen(open)
                                }}
                                placement='bottom'
                                content={() => popoverMenu()}
                                trigger='click'
                            >
                                <div
                                    style={{
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
    },
    areEqual
)
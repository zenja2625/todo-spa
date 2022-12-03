import { CSSProperties, FC, useState } from 'react'
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
    const [popoverVisable, setPopoverVisable] = useState(false)

    const dispatch = useAppDispatch()

    const style: CSSProperties = {
        // marginLeft: dragged ? undefined : `${depthIndent * todo.depth}px`,
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
    // console.log(handleProps);

    return (
        <Row wrap={false} align={'middle'} className='todo-item'>
            <MoreOutlined {...handleProps} className='before-todo' />
            <Col>
                {!todo.showHideButton || dragged ? (
                    <div className='empty-icon' />
                ) : !todo.isHiddenSubTasks ? (
                    <RightOutlined
                        className='hidden-icon'
                        onClick={() => toggleIsOpen?.(todo.id)}
                    />
                ) : (
                    <DownOutlined className='hidden-icon' onClick={() => toggleIsOpen?.(todo.id)} />
                )}
            </Col>
            <Col>
                <Checkbox onChange={() => toggleIsCheck?.(todo.id)} checked={todo.isDone} />
            </Col>
            <Col
                flex={'1 1 auto'}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    // backgroundColor: 'lime',
                    overflow: 'hidden',
                }}
            >
                <Text ellipsis={true}>{todo.value}</Text>
                <Text className={dateClass} ellipsis={true}>
                    {/* abcdefghijklmnopqestuvwxyz */}
                    {todo.taskEnd?.format(appDateFormat)}
                </Text>
            </Col>
            <Col>
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
        // <Space className='todo-item'>
        //     <div>asd</div>
        //     <div>qwe</div>
        //     <div>zxc</div>
        //     <div style={{ backgroundColor: 'lime', flexShrink: 0 }}>asd</div>
        // </Space>
        // <div style={style} className='ant-row ant-row-space-between ant-row-middle todo-item'>
        //     <div className='ant-col'>
        //         <MoreOutlined {...handleProps} className='before-todo' />

        //         <Space >
        //             {!todo.showHideButton || dragged ? (
        //                 <div className='empty-icon' />
        //             ) : !todo.isHiddenSubTasks ? (
        //                 <RightOutlined
        //                     className='hidden-icon'
        //                     onClick={() => toggleIsOpen?.(todo.id)}
        //                 />
        //             ) : (
        //                 <DownOutlined
        //                     className='hidden-icon'
        //                     onClick={() => toggleIsOpen?.(todo.id)}
        //                 />
        //             )}

        //             <Checkbox onChange={() => toggleIsCheck?.(todo.id)} checked={todo.isDone} />
        //             <div style={{ backgroundColor: 'red'}}>
        //                 {/* <Text ellipsis={true}>{todo.value}</Text> */}
        //                 <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{todo.value}</div>
        //                 {/* <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{todo.value}</div> */}
        //                 <div className={dateClass}>{todo.taskEnd?.format(appDateFormat)}</div>
        //             </div>
        //         </Space>
        //     </div>
        //     <Col style={{ backgroundColor: 'yellowgreen' }} onClick={event => event.stopPropagation()}>
        //         {!dragged && (
        //             <Popover
        //                 destroyTooltipOnHide={{ keepParent: false }}
        //                 visible={popoverVisable}
        //                 onVisibleChange={visable => {
        //                     if (visable) setPopoverVisable(true)
        //                     else setPopoverVisable(false)
        //                 }}
        //                 placement='bottom'
        //                 content={() => popoverMenu()}
        //                 trigger='click'
        //             >
        //                 <Button type='text' style={{ height: '100%' }}>
        //                     <EllipsisOutlined />
        //                 </Button>
        //             </Popover>
        //         )}
        //     </Col>
        // </div>
    )
}

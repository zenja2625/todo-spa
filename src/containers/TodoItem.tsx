import { FC } from 'react'
import { Todo } from '../slices/sliceTypes'
import { MoreOutlined, RightOutlined, DownOutlined } from '@ant-design/icons'
import {
    openTodoEditor,
    toggleTodoHiding,
    toggleTodoProgress,
} from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { Skeleton } from 'antd'
import moment from 'moment'
import { appDateFormat, serverDateFormat } from '../dateFormat'

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

    const taskEnd = todo.taskEnd ? moment(todo.taskEnd, serverDateFormat): undefined

    if (active)
        return (
            <div
                style={{
                    backgroundColor: 'lightgray',
                    marginLeft: `${30 * todo.depth}px`,
                    height: '30px',
                    width: '100%',
                }}
            ></div>
        )

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                marginLeft: `${30 * todo.depth}px`,
                height: '30px',
                width: '100%',
                position: 'relative',
                userSelect: 'none',
            }}
            key={todo.id}
        >
            <MoreOutlined
                ref={dragRef}
                {...handleProps}
                style={{ cursor: 'move' }}
            />
            {todo.showHideButton ? (
                <input
                    type='button'
                    onClick={() => dispatch(toggleTodoHiding(todo.id))}
                    style={{ width: '25px' }}
                    value={todo.isHiddenSubTasks ? '>' : 'ᐯ'}
                />
            ) : (
                <span style={{ marginRight: '25px' }}></span>
            )}
            <input
                type='checkbox'
                onChange={() => dispatch(toggleTodoProgress(todo.id))}
                checked={todo.isDone}
            ></input>
            {todo.value}

            {
                <span style={{ marginLeft: '3px', width: '80px' }}>
                    {todo.taskEnd &&
                        moment(todo.taskEnd, serverDateFormat).format(
                            appDateFormat
                        )}
                </span>
            }

            <input
                type='button'
                value='✎'
                onClick={() =>
                    dispatch(
                        openTodoEditor({
                            editTodoId: todo.id,
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
                            prevTodoId: todo.id,
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
                            prevTodoId: todo.id
                        })
                    )
                }
            />
        </div>
    )
}

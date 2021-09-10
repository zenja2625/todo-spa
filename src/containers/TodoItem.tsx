import { FC } from 'react'
import { Todo } from '../slices/sliceTypes'
import { MoreOutlined } from '@ant-design/icons'
import { toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { Skeleton } from 'antd'
import moment from 'moment'
import { appDateFormat, serverDateFormat } from '../dateFormat'

type TodoItemPropsType = {
    todo: Todo,
    active?: boolean
    edit: (id: number) => void
    dragRef?: (element: HTMLElement | null) => void
    handleProps: any
    remove: () => void
}

export const TodoItem: FC<TodoItemPropsType> = ({ todo, dragRef, handleProps, edit, remove }) => {
    const dispatch = useAppDispatch()

    const progress = (id: number, isDone: boolean) => {
        dispatch(toggleTodoProgress(id))
    }

    const hiding = (id: number, isHiddenSubTasks: boolean) => {
        dispatch(toggleTodoHiding(id))
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: `${30 * todo.depth}px`, height: '30px', width: '100%', position: 'relative', userSelect: 'none' }} key={todo.id}>
            <MoreOutlined
                ref={dragRef}
                {...handleProps}
                style={{ cursor: 'move' }}
            />
            {todo.showHideButton ?
                <input
                    type="button"
                    onClick={() => hiding(todo.id, !todo.isHiddenSubTasks)}
                    style={{ width: '25px' }}
                    value={todo.isHiddenSubTasks ? '>' : 'ᐯ'} /> :
                <span style={{ marginRight: '25px' }}></span>
            }
            <input
                type='checkbox'
                onChange={() => progress(todo.id, !todo.isDone)}
                checked={todo.isDone}></input>
            {todo.value}

           {<span style={{ marginLeft: '3px', width: '80px' }}>
                {todo.taskEnd && moment(todo.taskEnd, serverDateFormat).format(appDateFormat)}
            </span>}

            <input type="button" value='✎' onClick={() => edit(todo.id)}/>
            <input type="button" value="❌" onClick={remove}/>
        </div>
    )
}
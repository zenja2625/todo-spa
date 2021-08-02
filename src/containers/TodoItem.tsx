import { FC } from 'react'
import { Todo } from '../slices/sliceTypes'
import { MoreOutlined } from '@ant-design/icons'
import { changeTodoPosition, dragTodo, toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { Skeleton } from 'antd'

export const TodoItem: FC<Todo> = ({ ...props }) => {
    const dispatch = useAppDispatch()
    const todos = useAppSelector(state => state.todos.todos)

    const progress = (id: number, isDone: boolean) => {
        dispatch(toggleTodoProgress(id))
    }

    const hiding = (id: number, isHiddenSubTasks: boolean) => {
        dispatch(toggleTodoHiding(id))
    }
    enum Direction {
        Up,
        Down,
        Left,
        Right
    }

    const move = (todo: Todo, direction: Direction) => {
        let depth = todo.depth
        let selectedTodoId = todo.id

        switch (direction) {
            case Direction.Left:
                depth--
                break
            case Direction.Right:
                depth++
                break
        }

        dispatch(changeTodoPosition({ todoId: 0, depth, selectedTodoId }))
    }

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginLeft: `${30 * props.depth}px`, height: '30px', width: '100%', position: 'relative', userSelect: 'none' }} key={props.id}>
            <Skeleton loading={props.id === -1} paragraph={false}>
                <MoreOutlined style={{ cursor: 'move' }} onClick={() => dispatch(dragTodo(props.id))} />
                {props.showHideButton ?
                    <input
                        type="button"
                        onClick={() => hiding(props.id, !props.isHiddenSubTasks)}
                        style={{ width: '25px' }}
                        value={props.isHiddenSubTasks ? '>' : 'ᐯ'} /> :
                    <span style={{ marginRight: '25px' }}></span>
                }
                <input
                    type='checkbox'
                    onChange={() => progress(props.id, !props.isDone)}
                    checked={props.isDone}></input>
                {props.value}

            </Skeleton>
            <input type="button" value="←" onClick={() => move(props, Direction.Left)} />
            <input type="button" value="-" onClick={() => move(props, Direction.Up)} />
            <input type="button" value="→" onClick={() => move(props, Direction.Right)} />
        </div>
    )
}
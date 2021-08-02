import { FC } from 'react'
import { Todo } from '../slices/sliceTypes'
import { MoreOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { changeTodoPosition, dragTodo, toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { Skeleton } from 'antd'


type TodoItemType = {
    todo: Todo,
    showHideButton: boolean
}

export const TodoItem: FC<TodoItemType> = ({ todo, showHideButton }) => {
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
        <div style={{ marginLeft: `${30 * todo.depth}px`, height: '30px', width: '100%', position: 'relative', userSelect: 'none' }} key={todo.id}>
            <Skeleton loading={todo.id === -1} paragraph={false}>
                <MoreOutlined style={{ cursor: 'move' }} onClick={() => dispatch(dragTodo(todo.id))} />
                {showHideButton ?
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
                <input type="button" value="←" onClick={() => move(todo, Direction.Left)} />
                <input type="button" value="-" onClick={() => move(todo, Direction.Up)} />
                <input type="button" value="→" onClick={() => move(todo, Direction.Right)} />
            </Skeleton>

        </div>
    )
}
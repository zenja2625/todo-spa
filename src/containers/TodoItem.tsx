import { FC } from 'react'
import { Todo } from '../slices/sliceTypes'
import { MoreOutlined } from '@ant-design/icons'


type TodoItemType = {
    todo: Todo,
    showHideButton: boolean
}

export const TodoItem: FC<TodoItemType> = ({ todo, showHideButton }) => {

    return (
        <div style={{ marginLeft: `${30 * todo.depth}px`, height: '30px', position: 'relative', userSelect: 'none' }} key={todo.id}>
                <MoreOutlined style={{ cursor: 'move' }}/>
                {showHideButton ?
                <input 
                    type="button" 
                    onClick={() => true/*hiding(todo.id, !todo.isHiddenSubTasks)*/} 
                    style={{ width: '25px' }} 
                    value={todo.isHiddenSubTasks ? '>' : 'ᐯ'} /> : 
                <span style={{ marginRight: '25px' }}></span>
                }
                <input 
                    type='checkbox' 
                    onChange={() => true/*progress(todo.id, !todo.isDone)*/} 
                    checked={todo.isDone}></input>
                {todo.value}
            </div>
    )
}
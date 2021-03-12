import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkToDo, deleteToDo, addToDo } from '../store/todoReducer';
import { ApplicationState } from '../store/types';

export const Todos = () => {
    const todos = useSelector(((state: ApplicationState) => state.todos.todos))

    const dispatch = useDispatch()

    const onCheck = (id: number) => {
        dispatch(checkToDo(id))
    }
    const deleteClick = (id: number) => {
        dispatch(deleteToDo(id))
    }
    const addClick = () => {
        dispatch(addToDo())
    }

    const todosItems = todos.map(todo => <li key={todo.Id}>
        <h3><input type='checkbox' checked={todo.IsDone} disabled={todo.IsDone} onChange={() => onCheck(todo.Id)} />
            {todo.Value}
            <input type='button' value='Удалить' onClick={() => deleteClick(todo.Id)} />
        </h3>
    </li>)

    return (
        <div>
            <ul>
                {todosItems}
            </ul>
            <div><input type="button" value='Добавить' onClick={addClick} /></div>
        </div>
    );
}

import { ToDoState, ADD_TODO, DELETE_TODO, ToDoActionTypes, CHECK_TODO } from './types'

const initialState: ToDoState = {
    todos: [ 
        { Id: 1, Value: 'Task 1', IsDone: false },
        { Id: 2, Value: 'Task 2', IsDone: false },
        { Id: 3, Value: 'Task 3', IsDone: false },
    ],
    todoId: 4
}

export const addToDo = (): ToDoActionTypes => {
    return {
        type: ADD_TODO
    }
}

export const deleteToDo = (todoId: number): ToDoActionTypes => {
    return {
        type: DELETE_TODO,
        todoId: todoId
    }
}

export const checkToDo = (todoId: number): ToDoActionTypes => {
    return {
        type: CHECK_TODO,
        todoId: todoId
    }
}


export const toDoReducer = (state = initialState, action: ToDoActionTypes): ToDoState => {
    switch (action.type) {
        case ADD_TODO:
            return {
                todos: [...state.todos, { Id: state.todoId, Value: 'Task ' + state.todoId, IsDone: false }],
                todoId: state.todoId + 1
            }
        case DELETE_TODO:
            return {
                todos: state.todos.filter(
                    todo => todo.Id !== action.todoId
                ),
                todoId: state.todoId
            }
        case CHECK_TODO:
            return {
                todos: state.todos.map(todo => todo.Id === action.todoId ? {...todo, IsDone: !todo.IsDone} : todo),
                todoId: state.todoId
            }
        default:
            return state
    }
}

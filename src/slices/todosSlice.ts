import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { TodoPostDTO, TodoPutDTO, TodoStatusDTO } from '../api/apiTypes'
import { TodoDTO, TodoMoveType, TodosType, UpdateStatusesType } from './sliceTypes'

const initialState: TodosType = {
    todos: [],
    todoStatusDTOs: [],
    draggedTodos: []
}

type CreateTodoProps = {
    categoryId: number
    todoDTO: TodoPostDTO
}


type UpdateTodoProps = {
    id: number
    categoryId: number
    todoDTO: TodoPutDTO
}

export const getTodosThunk = createAsyncThunk(
    'todos/getTodosThunk',
    async (categoryId: number, thunkAPI) => {
        try {
            const response = await API.todos.getTodos(categoryId, true)
            return response.data as Array<TodoDTO>
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const updateStatusesThunk = createAsyncThunk(
    'todos/updateStatusesThunk',
    async (payload: UpdateStatusesType, thunkAPI) => {
        try {
            await API.todos.updateStatuses(payload.categoryId, payload.todoStatusDTOs)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const createTodoThunk = createAsyncThunk(
    'todos/createTodoThunk',
    async (payload: CreateTodoProps, thunkAPI) => {
        try {
            await API.todos.createTodo(payload.categoryId, payload.todoDTO)
            await thunkAPI.dispatch(getTodosThunk(payload.categoryId))
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const updateTodoThunk = createAsyncThunk(
    'todos/updateTodoThunk',
    async (payload: UpdateTodoProps, thunkAPI) => {
        try {
            await API.todos.updateTodo(payload.categoryId, payload.id, payload.todoDTO)
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        toggleTodoProgress: (state, action: PayloadAction<number>) => {
            state.todos = state.todos.map(todo => todo.id === action.payload ? { ...todo, isDone: !todo.isDone } : todo)
        },
        toggleTodoHiding: (state, action: PayloadAction<number>) => {
            state.todos = state.todos.map(todo => todo.id === action.payload ? { ...todo, isHiddenSubTasks: !todo.isHiddenSubTasks } : todo)
        },
        moveTodo: (state, action: PayloadAction<TodoMoveType>) => {
            console.log('Move')
            const todoIndex = state.todos.findIndex(todo => todo.id.toString() === action.payload.id) 
            
            let todosCount = 1

            for (let i = todoIndex + 1; i < state.todos.length; i++) {
                if (state.todos[i].depth > state.todos[todoIndex].depth) {
                    todosCount++       
                    state.todos[i].depth += action.payload.depth - state.todos[todoIndex].depth 
                }
                else 
                    break         
            }
            state.todos[todoIndex].depth = action.payload.depth

            const todos = state.todos.splice(todoIndex, todosCount)
            const prevTodoIndex = state.todos.findIndex(todo => todo.id === action.payload.prevTodoId)
            state.todos.splice(prevTodoIndex + 1, 0, ...todos)
        },
        toggleTodoStatusDTOs: (state, action: PayloadAction<TodoStatusDTO>) => {
            const todoStatus = state.todoStatusDTOs.find(x => action.payload.id)
            
            if (todoStatus) {
                // if (action.payload.isDone === undefined && todoStatus.isDone !== undefined)
                   

            }
        }
    },
    extraReducers: builder => {
        builder.addCase(getTodosThunk.fulfilled, (state, action) => {
            state.todos = action.payload
            state.draggedTodos = []
        })
    }
})

export const { toggleTodoProgress, toggleTodoHiding, moveTodo } = todosSlice.actions

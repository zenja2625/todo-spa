import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { Todo, TodosType, UpdateStatusesType } from './sliceTypes'

const initialState: TodosType = {
    todos: []
}

export const getTodosThunk = createAsyncThunk(
    'todos/getTodosThunk',
    async (categoryId: number, thunkAPI) => {
        try {
            const response = await API.todos.getTodos(categoryId, true)
            return response.data as Array<Todo>
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


export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        toggleTodoProgress: (state, action: PayloadAction<number>) => {
            state.todos = state.todos.map(todo => todo.id === action.payload ? {...todo, isDone: !todo.isDone} : todo)
        },
        toggleTodoHiding: (state, action: PayloadAction<number>) => {
            state.todos = state.todos.map(todo => todo.id === action.payload ? {...todo, isHiddenSubTasks: !todo.isHiddenSubTasks} : todo)
        }
    },
    extraReducers: builder => {
        builder.addCase(getTodosThunk.fulfilled, (state, action) => {
            state.todos = action.payload
        })
    }
})

export const { toggleTodoProgress, toggleTodoHiding } = todosSlice.actions

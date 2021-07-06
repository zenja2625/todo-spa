import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { Todo, TodosType } from './sliceTypes'

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

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(getTodosThunk.fulfilled, (state, action) => {
            state.todos = action.payload
        })
    }
})

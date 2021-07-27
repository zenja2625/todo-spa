import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { todoStatusDTO } from '../api/apiTypes'
import { ChangeTodoPositionType, Todo, TodosType, UpdateStatusesType } from './sliceTypes'

const initialState: TodosType = {
    todos: [],
    todoStatusDTOs: []
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
            state.todos = state.todos.map(todo => todo.id === action.payload ? { ...todo, isDone: !todo.isDone } : todo)
        },
        toggleTodoHiding: (state, action: PayloadAction<number>) => {
            state.todos = state.todos.map(todo => todo.id === action.payload ? { ...todo, isHiddenSubTasks: !todo.isHiddenSubTasks } : todo)
        },
        changeTodoPosition: (state, action: PayloadAction<ChangeTodoPositionType>) => {
            const todoIndex = state.todos.findIndex(x => x.id === action.payload.todo.id)
            const todoParentIndex = state.todos.findIndex(x => x.id === action.payload.toParentDoId)
            state.todos.splice(todoIndex, 1)
            state.todos.splice(todoParentIndex + 1, 0, action.payload.todo)
        },
        toggleTodoStatusDTOs: (state, action: PayloadAction<todoStatusDTO>) => {
            const todoStatus = state.todoStatusDTOs.find(x => action.payload.id)
            
            if (todoStatus) {
                // if (action.payload.isDone === undefined && todoStatus.isDone !== undefined)
                   

            }
        }
    },
    extraReducers: builder => {
        builder.addCase(getTodosThunk.fulfilled, (state, action) => {
            state.todos = action.payload
        })
    }
})

export const { toggleTodoProgress, toggleTodoHiding, changeTodoPosition } = todosSlice.actions

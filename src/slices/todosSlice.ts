import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { string } from 'yup/lib/locale'
import { API } from '../api/api'
import { todoStatusDTO } from '../api/apiTypes'
import { ChangeTodoPositionType, Todo, TodosType, UpdateStatusesType } from './sliceTypes'

const initialState: TodosType = {
    todos: [],
    todoStatusDTOs: [],
    draggedTodos: []
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
        //todo: delete id
        changeTodoPosition: (state, action: PayloadAction<ChangeTodoPositionType>) => {
            // alert(JSON.stringify(state.draggedTodos, null, 4))
            if (state.draggedTodos.length === 0)
                return

            let minDepth = 0
            let maxDepth = 0
            let insertIndex = 0

            if (action.payload.selectedTodoId < 0) {
                maxDepth = state.todos.length ? state.todos[state.todos.length - 1].depth + 1 : 0
                insertIndex = state.todos.length
            }
            else {
                const selectedIndex = state.todos.findIndex(x => x.id === action.payload.selectedTodoId)
                if (selectedIndex === -1)
                    return

                minDepth = state.todos[selectedIndex].depth
                insertIndex = selectedIndex

                const prevIndex = selectedIndex - 1

                if (prevIndex >= 0)
                    maxDepth = state.todos[prevIndex].depth + 1
            }


            const depth = action.payload.depth <= minDepth ? minDepth :
                          action.payload.depth >= maxDepth ? maxDepth :
                          action.payload.depth

            const todo = {...state.draggedTodos[0], depth }
            
            // state.todos.splice(todoIndex, 1)
            state.todos.splice(insertIndex, 0, todo)
            state.draggedTodos = []
        },
        dragTodo: (state, action: PayloadAction<number>) => {
            if (state.draggedTodos.length === 0) {
                const todoIndex = state.todos.findIndex(x => x.id === action.payload)
                state.draggedTodos = [...state.draggedTodos, ...state.todos.splice(todoIndex, 1)]
                state.todos.splice(todoIndex, 0, { id: -1, depth: 0, isDone: false, isHiddenSubTasks: false, value: '' })
            }
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

export const { toggleTodoProgress, toggleTodoHiding, changeTodoPosition, dragTodo } = todosSlice.actions

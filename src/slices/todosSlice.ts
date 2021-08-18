import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { todoStatusDTO } from '../api/apiTypes'
import { ChangeTodoPositionType, TodoDTO, TodoMoveType, TodosType, UpdateStatusesType } from './sliceTypes'

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
        //todo: delete id
        changeTodoPosition: (state, action: PayloadAction<ChangeTodoPositionType>) => {
            if (state.draggedTodos.length === 0)
                return

            let minDepth = 0
            let maxDepth = 0
            let insertIndex = 0

            const sceletonIndex = state.todos.findIndex(x => x.id === -1)
            const selectedIndex = state.todos.findIndex(x => x.id === action.payload.prevTodoId)

            if (selectedIndex === -1 || sceletonIndex === -1)
                return

            //todo
            if (sceletonIndex < selectedIndex) {
                insertIndex = selectedIndex
                if (selectedIndex + 1 < state.todos.length)
                    minDepth = state.todos[selectedIndex + 1].depth
                maxDepth = state.todos[selectedIndex].depth + 1
            }
            else if (sceletonIndex > selectedIndex) {
                insertIndex = selectedIndex
                minDepth = state.todos[selectedIndex].depth
                if (selectedIndex - 1 >= 0)
                    maxDepth = state.todos[selectedIndex - 1].depth + 1
            }
            else {
                insertIndex = selectedIndex
                if (selectedIndex + 1 < state.todos.length)
                    minDepth = state.todos[selectedIndex + 1].depth
                if (selectedIndex - 1 >= 0)
                    maxDepth = state.todos[selectedIndex - 1].depth + 1
            }
            
            const depth = action.payload.depth <= minDepth ? minDepth :
                          action.payload.depth >= maxDepth ? maxDepth :
                          action.payload.depth


            if (selectedIndex === sceletonIndex) {
                state.todos[selectedIndex].depth = depth
            }
            else {
                const sceleton = {...state.todos[sceletonIndex], depth }
            
                state.todos.splice(sceletonIndex, 1)
                state.todos.splice(insertIndex, 0, sceleton)
            }
        },
        dragTodo: (state, action: PayloadAction<number>) => {
            if (state.draggedTodos.length === 0) {
                const todoIndex = state.todos.findIndex(x => x.id === action.payload)

                let dragCount = 1
                for (let i = todoIndex + 1; i < state.todos.length; i++) 
                    if (state.todos[todoIndex].depth < state.todos[i].depth)
                        dragCount++
                    else 
                        break
            

                state.draggedTodos = [...state.draggedTodos, ...state.todos.splice(todoIndex, dragCount)]
                state.todos.splice(todoIndex, 0, { id: -1, depth: state.draggedTodos[0].depth, isDone: false, isHiddenSubTasks: false, value: '' })
            }
        },
        dropTodo: state => {
            const sceletonIndex = state.todos.findIndex(x => x.id === -1)
            if (sceletonIndex === -1)
                return

            const depthDifference  = state.todos[sceletonIndex].depth - state.draggedTodos[0].depth

            for (let i = 0; i < state.draggedTodos.length; i++) {
                state.draggedTodos[i].depth += depthDifference
            }

            state.todos.splice(sceletonIndex, 1)
            state.todos.splice(sceletonIndex, 0, ...state.draggedTodos)
            state.draggedTodos = []
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
            state.draggedTodos = []
        })
    }
})

export const { toggleTodoProgress, toggleTodoHiding, changeTodoPosition, dragTodo, dropTodo, moveTodo } = todosSlice.actions

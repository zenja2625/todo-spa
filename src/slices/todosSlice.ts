import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'
import { API } from '../api/api'
import { TodoPositionDTO, TodoPostDTO, TodoPutDTO, TodoStatusDTO } from '../api/apiTypes'
import {
    Todo,
    TodoDTO,
    TodoMoveType,
    TodosType,
    UpdateStatusesType,
} from './sliceTypes'

const initialState: TodosType = {
    todos: [],
    todoStatusDTOs: {},
    todoPositionDTOs: [],
    draggedTodo: null
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

type DeleteTodoProps = {
    id: number
    categoryId: number
}

export const getTodosThunk = createAsyncThunk(
    'todos/getTodosThunk',
    async (categoryId: number, thunkAPI) => {
        try {
            const response = await API.todos.getTodos(categoryId, true)
            return response.data as Array<TodoDTO>
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const updateStatusesThunk = createAsyncThunk(
    'todos/updateStatusesThunk',
    async (payload: UpdateStatusesType, thunkAPI) => {
        try {
            await API.todos.updateStatuses(
                payload.categoryId,
                payload.todoStatusDTOs
            )

            await thunkAPI.dispatch(getTodosThunk(payload.categoryId))
            
            thunkAPI.dispatch(clearStatuses())
        } catch (error: any) {
            thunkAPI.dispatch(clearStatuses())
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
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const updateTodoThunk = createAsyncThunk(
    'todos/updateTodoThunk',
    async (payload: UpdateTodoProps, thunkAPI) => {
        try {
            await API.todos.updateTodo(
                payload.categoryId,
                payload.id,
                payload.todoDTO
            )
            await thunkAPI.dispatch(getTodosThunk(payload.categoryId))
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const deleteTodoThunk = createAsyncThunk(
    'todos/deleteTodoThunk',
    async (payload: DeleteTodoProps, thunkAPI) => {
        try {
            await API.todos.deleteTodo(payload.categoryId, payload.id)
            await thunkAPI.dispatch(getTodosThunk(payload.categoryId))
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

const toggleProperty = (
    state: WritableDraft<TodosType>,
    id: number,
    propName: 'isDone' | 'isHiddenSubTasks'
) => {
    if (state.todoStatusDTOs[id])
        state.todoStatusDTOs[id][propName] =
            state.todoStatusDTOs[id]?.[propName] === undefined
                ? !state.todos.find(x => x.id === id)?.[propName]
                : undefined
    else
        state.todoStatusDTOs[id] = {
            id: id,
            [propName]:
                state.todoStatusDTOs[id]?.[propName] === undefined
                    ? !state.todos.find(x => x.id === id)?.[propName]
                    : undefined,
        }

    if (
        state.todoStatusDTOs[id].isDone === undefined &&
        state.todoStatusDTOs[id].isHiddenSubTasks === undefined
    ) {
        delete state.todoStatusDTOs[id]
    }
}

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        toggleTodoProgress: (state, action: PayloadAction<number>) => {
            toggleProperty(state, action.payload, 'isDone')

            // state.todos = state.todos.map(todo =>
            //     todo.id === action.payload
            //         ? { ...todo, isDone: !todo.isDone }
            //         : todo
            // )
        },
        toggleTodoHiding: (state, action: PayloadAction<number>) => {
            toggleProperty(state, action.payload, 'isHiddenSubTasks')

            state.todos = state.todos.map(todo =>
                todo.id === action.payload
                    ? { ...todo, isHiddenSubTasks: !todo.isHiddenSubTasks }
                    : todo
            )
        },
        pushTodoPosition: (state, action: PayloadAction<TodoPositionDTO>) => {
            state.todoPositionDTOs.push(action.payload)
        },
        clearStatuses: state => {
            state.todoStatusDTOs = {}
        },
        moveTodo: (state, action: PayloadAction<TodoMoveType>) => {
            const todoIndex = state.todos.findIndex(
                todo => todo.id.toString() === action.payload.id
            )

            let todosCount = 1

            for (let i = todoIndex + 1; i < state.todos.length; i++) {
                if (state.todos[i].depth > state.todos[todoIndex].depth) {
                    todosCount++
                    state.todos[i].depth +=
                        action.payload.depth - state.todos[todoIndex].depth
                } else break
            }
            state.todos[todoIndex].depth = action.payload.depth

            const todos = state.todos.splice(todoIndex, todosCount)
            const prevTodoIndex = state.todos.findIndex(
                todo => todo.id === action.payload.prevTodoId
            )
            state.todos.splice(prevTodoIndex + 1, 0, ...todos)
        },
        toggleTodoStatusDTOs: (state, action: PayloadAction<TodoStatusDTO>) => {
            // const todoStatus = state.todoStatusDTOs.find(x => action.payload.id)
            // if (todoStatus) {
            //     // if (action.payload.isDone === undefined && todoStatus.isDone !== undefined)
            // }
        },
        setDraggedTodo: (state, action: PayloadAction<Todo | null>) => {
            state.draggedTodo = action.payload
        }
    },
    extraReducers: builder => {
        builder.addCase(getTodosThunk.fulfilled, (state, action) => {
            state.todos = action.payload
            // state.todoPositionDTOs = []
        })
    },
})

export const { toggleTodoProgress, toggleTodoHiding, moveTodo, clearStatuses, pushTodoPosition, setDraggedTodo } =
    todosSlice.actions

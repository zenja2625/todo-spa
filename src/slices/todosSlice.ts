import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'
import { API } from '../api/api'
import { TodoPositionDTO, TodoPostDTO, TodoPutDTO, TodoStatusDTO } from '../api/apiTypes'
import { TodoEditorValueType } from '../containers/containerTypes'
import { serverDateFormat } from '../dateFormat'
import { getTodoChildCount, getTodoDepth, ITodo } from '../utility/getTodoDepth'
import { getTodoPosition } from '../utility/getTodoPosition'
import { deinitialization } from './appSlice'
import {
    CreateTodoProps,
    IState,
    RejectValueType,
    Todo,
    TodoDTO,
    TodoEditorType,
    TodosType,
    UpdatePositionsType,
    UpdateStatusesType,
    updateTodoDragDepthProps,
} from './sliceTypes'

const initialState: TodosType = {
    todos: [],
    todoStatusDTOs: [],
    todoPositionDTOs: [],
    todoEditor: {
        isEditorOpen: false,
        value: { value: '' },
    },
    draggedTodoId: null,
    todosRequestId: null,
}

let isDelay = true

function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
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

export const depthIndent = 40

export const getTodosThunk = createAsyncThunk(
    'todos/getTodosThunk',
    async (categoryId: number, { rejectWithValue }) => {
        try {
            const response = await API.todos.getTodos(categoryId, true)
            return response.data as Array<TodoDTO>
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const updatePositionsThunk = createAsyncThunk<void, number, IState & RejectValueType>(
    'todos/updatePositionsThunk',
    async (payload, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState()
            const positions = state.todos.todoPositionDTOs

            if (positions.length) {
                dispatch(clearTodoPositions())
                await API.todos.updatePositions(payload, positions)
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const updateStatusesThunk = createAsyncThunk<void, number, IState & RejectValueType>(
    'todos/updateStatusesThunk',
    async (payload, { getState, dispatch, rejectWithValue }) => {
        try {
            const state = getState()
            const statuses = state.todos.todoStatusDTOs

            if (statuses.length) {
                dispatch(clearTodoStatuses())
                await API.todos.updateStatuses(payload, statuses)
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const createTodoThunk = createAsyncThunk<void, CreateTodoProps, IState & RejectValueType>(
    'todos/createTodoThunk',
    async (payload, { getState, rejectWithValue, dispatch }) => {
        try {
            const todos = getState().todos.todos

            let depth = 0
            let prevIndex: number

            if (payload.overTodoId) {
                const overIndex = todos.findIndex(todo => todo.id === payload.overTodoId)

                if (overIndex === -1) {
                    dispatch(deinitialization())
                    return
                }

                prevIndex = payload.addBefore ? overIndex - 1 : overIndex

                if (prevIndex !== -1) {
                    depth = todos[overIndex].depth
                }
            } else {
                prevIndex = todos.length - 1
            }

            await API.todos.createTodo(payload.categoryId, {
                value: payload.todoValue.value,
                taskEnd: payload.todoValue.taskEnd?.toDate(),
                ...getTodoPosition(todos, prevIndex, depth),
            })
            await dispatch(getTodosThunk(payload.categoryId))
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const updateTodoThunk = createAsyncThunk(
    'todos/updateTodoThunk',
    async (payload: UpdateTodoProps, thunkAPI) => {
        try {
            await API.todos.updateTodo(payload.categoryId, payload.id, payload.todoDTO)
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

const getParentIndex = (todos: Array<ITodo>, index: number) => {
    for (let i = index - 1; i >= 0; i--) {
        if (todos[index].depth > todos[i].depth) {
            return i
        }
    }

    return -1
}

export const todosSlice = createSlice({
    name: 'todos',
    initialState,
    reducers: {
        clearTodoStatuses: state => {
            state.todoStatusDTOs = []
        },
        clearTodoPositions: state => {
            state.todoPositionDTOs = []
        },
        toggleTodoProgress: (state, action: PayloadAction<number>) => {
            const todos = state.todos
            const index = todos.findIndex(todo => todo.id === action.payload)

            if (index !== -1) {
                const isDone = !todos[index].isDone

                if (isDone) {
                    const childrenCount = getTodoChildCount(todos, index)

                    for (let i = index + 1; i < todos.length && i <= index + childrenCount; i++) {
                        todos[i].isDone = true
                    }
                } else {
                    let parentIndex = getParentIndex(todos, index)

                    while (parentIndex !== -1) {
                        todos[parentIndex].isDone = false
                        parentIndex = getParentIndex(todos, parentIndex)
                    }
                }

                todos[index].isDone = isDone
                state.todoStatusDTOs.push({
                    id: todos[index].id,
                    isDone,
                })
            }
        },
        toggleTodoHiding: (state, action: PayloadAction<number>) => {
            const todos = state.todos
            const index = todos.findIndex(todo => todo.id === action.payload)

            if (index !== -1) {
                const isHiddenSubTasks = !todos[index].isHiddenSubTasks

                todos[index].isHiddenSubTasks = isHiddenSubTasks
                state.todoStatusDTOs.push({
                    id: todos[index].id,
                    isHiddenSubTasks,
                })
            }
        },
        startDragTodo: (state, action: PayloadAction<string>) => {
            state.draggedTodoId =
                state.todos.find(todo => todo.id.toString() === action.payload)?.id || null
        },
        moveTodo: (
            state,
            action: PayloadAction<{ id: string; overId: string; deltaX: number }>
        ) => {
            const todos = state.todos
            const { id, overId, deltaX } = action.payload

            const activeIndex = todos.findIndex(todo => todo.id.toString() === id)
            const overIndex = todos.findIndex(todo => todo.id.toString() === overId)

            const depth = getTodoDepth(todos, activeIndex, overIndex, deltaX, depthIndent)
            const prevIndex = activeIndex >= overIndex ? overIndex - 1 : overIndex

            if (
                todos[prevIndex]?.id === todos[activeIndex - 1]?.id &&
                todos[activeIndex].depth === depth
            )
                return

            state.todoPositionDTOs.push({
                id: todos[activeIndex].id,
                ...getTodoPosition(todos, prevIndex, depth, activeIndex),
            })

            let todoChildrenCount = 0

            for (let i = activeIndex + 1; i < todos.length; i++) {
                if (todos[i].depth > todos[activeIndex].depth) {
                    todoChildrenCount++
                    todos[i].depth += depth - todos[activeIndex].depth
                } else break
            }

            todos[activeIndex].depth = depth

            const spliceTodos = todos.splice(activeIndex, todoChildrenCount + 1)

            if (activeIndex < overIndex) {
                const toIndex = overIndex - todoChildrenCount
                todos.splice(toIndex < 0 ? -1 : toIndex, 0, ...spliceTodos)
            } else {
                todos.splice(overIndex, 0, ...spliceTodos)
            }
        },
        stopDragTodo: state => {
            state.draggedTodoId = null
        },
        openTodoEditor: (state, action: PayloadAction<{ 
                                                value?: TodoEditorValueType,    
                                                editTodoId?: number,
                                                prevTodoId?: number,
                                                addBefore?: boolean } | undefined>) => 
        {
            const { value, ...payload } = action.payload || {}
            
            state.todoEditor = {
                isEditorOpen: true,
                value: value ? value : { value: '' },
                ...payload
            }
        },
        closeTodoEditor: state => {
            state.todoEditor = {
                isEditorOpen: false,
                value: state.todoEditor.value
            }
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getTodosThunk.pending, (state, action) => {
                state.todosRequestId = action.meta.requestId
            })
            .addCase(getTodosThunk.rejected, state => {
                state.todosRequestId = null
            })
            .addCase(getTodosThunk.fulfilled, (state, action) => {
                if (state.todosRequestId === action.meta.requestId) {
                    state.todos = action.payload
                    state.todosRequestId = null
                }
            })
    },
})

export const {
    toggleTodoProgress,
    toggleTodoHiding,
    moveTodo,
    openTodoEditor,
    closeTodoEditor,
    startDragTodo,
    stopDragTodo,
    clearTodoPositions,
    clearTodoStatuses,
} = todosSlice.actions

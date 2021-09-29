import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WritableDraft } from 'immer/dist/internal'
import { API } from '../api/api'
import { TodoPositionDTO, TodoPostDTO, TodoPutDTO, TodoStatusDTO } from '../api/apiTypes'
import { TodoEditorValueType } from '../containers/containerTypes'
import { serverDateFormat } from '../dateFormat'
import { getTodoDepth } from '../utility/getTodoDepth'
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
    todoStatusDTOs: {},
    todoPositionDTOs: [],
    draggedTodo: null,
    todoEditor: {
        isEditorOpen: false,
    },
    todoDrag: {},
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

const getTodoPosition = (
    todos: Array<TodoDTO>,
    actualPrevTodoId?: number,
    actualTodoId: number = 0,
    actualTodoDepth: number = 0
) => {
    const todoIndex = actualPrevTodoId ? todos.findIndex(todo => todo.id === actualPrevTodoId) : -1
    let parentId = 0
    let prevTodoId = 0

    for (let i = todoIndex; i >= 0; i--) {
        const todo = todos[i]

        if (todo.id === actualTodoId) continue
        if (actualTodoDepth === 0 && prevTodoId) break
        if (todo.depth < actualTodoDepth) {
            parentId = todos[i].id
            break
        } else if (todo.depth === actualTodoDepth && !prevTodoId) prevTodoId = todo.id
    }

    return { parentId, prevTodoId }
}

const getPrevTodoId = (todos: Array<TodoDTO>, id: number) => {
    const index = todos.findIndex(todo => todo.id === id) - 1
    return index < 0 ? undefined : todos[index].id
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

export const updatePositionsThunk = createAsyncThunk(
    'todos/updatePositionsThunk',
    async (payload: UpdatePositionsType, { dispatch, rejectWithValue }) => {
        try {
            await API.todos.updatePositions(payload.categoryId, payload.todoPositionDTOs)

            // await dispatch(getTodosThunk(payload.categoryId))
        } catch (error: any) {
            return rejectWithValue(error.response?.status)
        }
    }
)

export const updateStatusesThunk = createAsyncThunk(
    'todos/updateStatusesThunk',
    async (payload: UpdateStatusesType, thunkAPI) => {
        try {
            await API.todos.updateStatuses(payload.categoryId, payload.todoStatusDTOs)

            await thunkAPI.dispatch(getTodosThunk(payload.categoryId))
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const createTodoThunk = createAsyncThunk<void, CreateTodoProps, IState & RejectValueType>(
    'todos/createTodoThunk',
    async (payload, thunkAPI) => {
        try {
            const todos = thunkAPI.getState().todos.todos

            const prevTodoId = !payload.prevTodoId
                ? todos.length
                    ? todos[todos.length - 1].id
                    : undefined
                : !payload.addBefore
                ? payload.prevTodoId
                : getPrevTodoId(todos, payload.prevTodoId)

            const prevTodoDepth = prevTodoId ? todos.find(todo => todo.id === prevTodoId)?.depth : 0

            await API.todos.createTodo(payload.categoryId, {
                value: payload.todoValue.value,
                taskEnd: payload.todoValue.taskEnd?.toDate(),
                ...getTodoPosition(todos, prevTodoId, undefined, prevTodoDepth),
            })
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

            state.todos = state.todos.map(todo =>
                todo.id === action.payload ? { ...todo, isDone: !todo.isDone } : todo
            )
        },
        toggleTodoHiding: (state, action: PayloadAction<number>) => {
            toggleProperty(state, action.payload, 'isHiddenSubTasks')

            state.todos = state.todos.map(todo =>
                todo.id === action.payload
                    ? { ...todo, isHiddenSubTasks: !todo.isHiddenSubTasks }
                    : todo
            )
        },
        startDragTodo: (state, action: PayloadAction<number>) => {
            const todo = state.todos.find(todo => todo.id === action.payload)

            if (todo) {
                state.todoDrag = {
                    draggedTodo: todo,
                    draggedTodoDepth: todo.depth,
                }
            }
        },
        updateTodoDragDepth: (state, action: PayloadAction<updateTodoDragDepthProps>) => {
            const dragId = state.todoDrag.draggedTodo?.id

            if (dragId) {
                const todos = state.todos
                const overId = action.payload.overTodoId

                const activeIndex = todos.findIndex(x => x.id === dragId)
                const overIndex = todos.findIndex(x => x.id === overId)

                const prevIndex = activeIndex >= overIndex ? overIndex - 1 : overIndex
                const nextIndex = activeIndex <= overIndex ? overIndex + 1 : overIndex

                const maxDepth = prevIndex >= 0 ? todos[prevIndex].depth + 1 : 0
                const minDepth = nextIndex < todos.length ? todos[nextIndex].depth : 0

                const depth = todos[activeIndex].depth + Math.floor(action.payload.offsetLeft / 40)
                const actualDepth =
                    depth < minDepth
                        ? minDepth
                        : depth > maxDepth
                        ? maxDepth
                        : depth

                if (actualDepth !== state.todoDrag.draggedTodoDepth)
                    state.todoDrag.draggedTodoDepth = actualDepth
            }
        },
        moveTodo: (state, action: PayloadAction<{ id: string, overId: string, deltaX: number }>) => {
            const todos = state.todos
            const { id, overId, deltaX } = action.payload

            const activeIndex = todos.findIndex(todo => todo.id.toString() === id)
            const overIndex = todos.findIndex(todo => todo.id.toString() === overId)

            const depth = getTodoDepth(todos, activeIndex, overIndex, deltaX, depthIndent)
            const prevId = activeIndex >= overIndex ? todos[overIndex - 1].id : todos[overIndex].id

            state.todoPositionDTOs.push({
                id: todos[activeIndex].id,
                ...getTodoPosition(todos, prevId, todos[activeIndex].id, depth)
            })

            let todosCount = 1

            for (let i = activeIndex + 1; i < todos.length; i++) {
                if (todos[i].depth > todos[activeIndex].depth) {
                    todosCount++
                    todos[i].depth += depth - todos[activeIndex].depth
                } else break
            }
            
            todos[activeIndex].depth = depth

            const spliceTodos = todos.splice(activeIndex, todosCount)
            // console.log(spliceTodos)
            const prevIndex = todos.findIndex(todo => todo.id === prevId)
            todos.splice(prevIndex + 1, 0, ...spliceTodos)

            state.todoDrag = {}
        },
        setTodoEditorState: (state, action: PayloadAction<TodoEditorType>) => {
            state.todoEditor = action.payload
        },
    },
    extraReducers: builder => {
        builder.addCase(updateStatusesThunk.pending, state => {
            state.todoStatusDTOs = {}
        })
        builder.addCase(updatePositionsThunk.pending, state => {
            state.todoPositionDTOs = []
        })
        builder.addCase(getTodosThunk.fulfilled, (state, action) => {
            state.todos = action.payload
        })
    },
})

export const {
    toggleTodoProgress,
    toggleTodoHiding,
    moveTodo,
    setTodoEditorState,
    startDragTodo,
    updateTodoDragDepth,
} = todosSlice.actions

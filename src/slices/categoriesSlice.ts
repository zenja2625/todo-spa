import { Action, AnyAction, createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { message } from 'antd'
import { API } from '../api/api'
import { CategoriesType, Category } from './sliceTypes'

const initialState: CategoriesType = {
    categories: [],
    selectedCategoryId: 0
}

export const getCategoriesThunk = createAsyncThunk(
    'categories/getCategories',
    async (_, _thunkAPI) => {
        const response = await API.categories.getCategories()
        return response.data as Array<Category>
    }
)

export const createCategoryThunk = createAsyncThunk(
    'categories/createCategory',
    async (payload: string, thunkAPI) => {
        try {
            await API.categories.createCategory({ Name: payload })
            thunkAPI.dispatch(getCategoriesThunk())
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const deleteCategoryThunk = createAsyncThunk(
    'categories/deleteCategoryThunk',
    async (payload: number, thunkAPI) => {
        try {
            await API.categories.deleteCategory(payload)
            return payload
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const updateCategoryThunk = createAsyncThunk(
    'categories/updateCategoryThunk',
    async (payload: Category, thunkAPI) => {
        try {
            await API.categories.updateCategory(payload.id, { Name: payload.name })
            return payload
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

interface RejectedAction extends Action { payload: number }
function isRejectedAction(action: AnyAction): action is RejectedAction { return action.type.endsWith('rejected') }

export const categoriesSlice = createSlice({
    name: 'categories',
    initialState,
    reducers: {
        selectCategory: (state, action: PayloadAction<number>) => {
            state.selectedCategoryId = action.payload
        },
        clearCategories: (state) => {
            state.categories = []
        }
    },
    extraReducers: builder => {
        builder.addCase(getCategoriesThunk.fulfilled, (state, action) => {
            state.categories = action.payload
        })
        builder.addCase(deleteCategoryThunk.fulfilled, (state, action) => {
            state.categories = state.categories.filter(c => c.id !== action.payload)
        })
        builder.addCase(updateCategoryThunk.fulfilled, (state, action) => {
            state.categories = state.categories.map(x => x.id === action.payload.id ? action.payload : x)
        })
        builder.addMatcher(isRejectedAction, (_state, action) => {
            if (action.payload === 404) {
                message.error('Ошибка синхронизации')
            }
            else {
                message.error('Ошибка сервера')
            }
        })
    }
})

export const { selectCategory, clearCategories } = categoriesSlice.actions
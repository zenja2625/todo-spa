import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { API } from '../api/api'
import { UserLoginDTO, UserRegisterDTO } from '../api/apiTypes'
import { AccountType, RejectValueType } from './sliceTypes'

export const userInfoThunk = createAsyncThunk(
    'account/userInfoThunk',
    async (_payload, thunkAPI) => {
        try {
            const response = await API.account.userInfo()
            return response.data
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const loginThunk = createAsyncThunk<void, UserLoginDTO, RejectValueType>(
    'account/loginThunk',
    async (payload, thunkAPI) => {
        try {
            await API.account.login(payload)
            thunkAPI.dispatch(userInfoThunk())
        } 
        catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

export const logoutThunk = createAsyncThunk('account/logoutThunk', async (_payload, thunkAPI) => {
    try {
        await API.account.logout()
    } catch (error) {
        return thunkAPI.rejectWithValue(error.response?.status)
    }
    
})

export const registerThunk = createAsyncThunk<void, UserRegisterDTO, RejectValueType>(
    'account/registerThunk',
    async (payload, thunkAPI) => {
        try {
            await API.account.register(payload)
            thunkAPI.dispatch(userInfoThunk())
        } catch (error) {
            return thunkAPI.rejectWithValue(error.response?.status)
        }
    }
)

const initialState: AccountType = {
    username: '',
    isAuth: false,
}

export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(logoutThunk.fulfilled, (state) => {
            state.username = initialState.username
            state.isAuth = initialState.isAuth
        })
        builder.addCase(userInfoThunk.fulfilled, (state, action) => {
            state.username = action.payload
            state.isAuth = true
        })
    },
})

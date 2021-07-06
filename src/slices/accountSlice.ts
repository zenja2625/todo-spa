import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { AxiosError } from 'axios'
import { API } from '../api/api'
import { UserLoginDTO, UserRegisterDTO } from '../api/apiTypes'
import { AccountType, RejectValueType } from './sliceTypes'

export const userInfoThunk = createAsyncThunk(
    'account/userInfoThunk',
    async () => {
        const response = await API.account.userInfo()
        return response.data
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
            const err = error as AxiosError

            if (err.response?.status === 404)
                return thunkAPI.rejectWithValue('Неверный логин или пароль')
        }
    }
)

export const logoutThunk = createAsyncThunk('account/logoutThunk', async () => {
    await API.account.logout()
})

export const registerThunk = createAsyncThunk<void, UserRegisterDTO, RejectValueType>(
    'account/registerThunk',
    async (payload, thunkAPI) => {
        try {
            await API.account.register(payload)
            thunkAPI.dispatch(userInfoThunk())
        } catch (error) {
            const err = error as AxiosError

            if (err.response?.status === 409)
                return thunkAPI.rejectWithValue('Данное имя занято')
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

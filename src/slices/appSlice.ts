import { Action, AnyAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { message } from 'antd'
import { loginThunk, userInfoThunk } from './accountSlice'
import { getCategoriesThunk } from './categoriesSlice'
import { AppType, IState } from './sliceTypes'

const initialState: AppType = {
    initialized: false,
    requestCount: 0,
    siderCollapsed: true
}

interface RejectedAction extends Action {
    payload: number
    type: string
}

const isRejectedAction = (action: AnyAction): action is RejectedAction =>
    action.type.endsWith('rejected')

const isStartLoading = (action: AnyAction) => action.type.endsWith('pending')

const isEndLoading = (action: AnyAction) =>
    action.type.endsWith('fulfilled') || action.type.endsWith('rejected')


export const initializeApp = createAsyncThunk<void, void, IState>(
    'app/initializeApp',
    async (_, { dispatch, getState }) => {
        await dispatch(userInfoThunk())
        if (getState().account.isAuth)
            await dispatch(getCategoriesThunk())
    }
)

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        deinitialization: state => {
            state.initialized = false
        },
        toggleSider: state => {
            state.siderCollapsed = !state.siderCollapsed
        }
    },
    extraReducers: builder => {
        builder.addCase(initializeApp.fulfilled, state => {
            state.initialized = true
        })
        builder.addMatcher(isStartLoading, state => {
            state.requestCount++
        })
        builder.addMatcher(isEndLoading, state => {
            state.requestCount--
        })
        builder.addMatcher(isRejectedAction, (state, action) => {
            switch (action.payload) {
                case 404:
                    if (action.type.startsWith(loginThunk.typePrefix))
                        message.error('Неверный логин или пароль')
                    else {
                        message.error('Ошибка синхронизации')
                        state.initialized = false
                    }
                    break
                case 401:
                    break
                case 409:
                    message.error('Данное имя занято')
                    break
                default:
                    message.error('Ошибка сервера')
                    break
            }
        })
    },
})

export const { deinitialization, toggleSider } = appSlice.actions

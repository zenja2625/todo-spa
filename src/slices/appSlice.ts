import { Action, AnyAction, createSlice } from '@reduxjs/toolkit'
import { message } from 'antd'
import { loginThunk } from './accountSlice'
import { AppType } from './sliceTypes'

const initialState: AppType = {
    initialized: false,
    requestCount: 0
}

interface RejectedAction extends Action { payload: number, type: string }
function isRejectedAction(action: AnyAction): action is RejectedAction { return action.type.endsWith('rejected') }

const isStartLoading = (action: AnyAction) => 
    action.type.endsWith('pending')

const isEndLoading = (action: AnyAction) => 
    action.type.endsWith('fulfilled') || action.type.endsWith('rejected') 

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        initialization: state => {
            state.initialized = true
        },
        toggleLoadingStatus: state => {
            state.requestCount += state.requestCount ? -1 : 1
        }
    },
    extraReducers: builder => {
        builder.addMatcher(isStartLoading, state => {
            state.requestCount++
        })
        builder.addMatcher(isEndLoading, state => {
            state.requestCount--
        })
        builder.addMatcher(isRejectedAction, (_state, action) => {
            if (action.type.startsWith(loginThunk.typePrefix) && action.payload === 404) {
                message.error('Неверный логин или пароль')
                return
            }

            switch (action.payload) {
                case 404:
                    message.error('Ошибка синхронизации')
                    break;
                case 401:
                    break
                case 409:
                    message.error('Данное имя занято')
                    break
                default:
                    message.error('Ошибка сервера')
                    break;
            }
        })
    }
    
})

export const { initialization, toggleLoadingStatus } = appSlice.actions

import { AnyAction, createSlice } from '@reduxjs/toolkit'
import { AppType } from './sliceTypes'

const initialState: AppType = {
    initialized: false,
    requestCount: 0
}

const isStartLoading = (action: AnyAction) => 
    action.type.endsWith('pending')

const isEndLoading = (action: AnyAction) => 
    action.type.endsWith('fulfilled') || action.type.endsWith('rejected') 

export const appSlice = createSlice({
    name: 'app',
    initialState,
    reducers: {
        initialization: (state) => {
            state.initialized = true
        },
        toggleLoadingStatus: (state) => {
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
    }
    
})

export const { initialization, toggleLoadingStatus } = appSlice.actions

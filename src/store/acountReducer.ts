import { AccountState, AccoutnActionTypes, AUTH_APP, LOGOUT_APP } from "./types";

const initialState: AccountState = {
    isAuth: false,
    name: ''
}

export const authApp = (username: string): AccoutnActionTypes => {
    return {
        type: AUTH_APP,
        name: username
    }
}

export const loguotApp = (): AccoutnActionTypes => {
    return {
        type: LOGOUT_APP
    }
}

export const accountReducer = (state = initialState, action: AccoutnActionTypes): AccountState => {
    switch (action.type) {
        case AUTH_APP:
            return {
                isAuth: true,
                name: action.name
            }
        case LOGOUT_APP:
            return {...initialState}
        default:
            return state
    }
    
}
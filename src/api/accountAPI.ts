import { instance } from "./api";
import { UserLoginDTO, UserRegisterDTO } from './apiTypes';

export const accountAPI = {
    login: (payload: UserLoginDTO) =>
        instance.post('account/login', payload),
    register: (payload: UserRegisterDTO) =>
        instance.post('account/register', payload),
    logout: () =>
        instance.post('account/logout'),
    userInfo: () => 
        instance.get('account')
}


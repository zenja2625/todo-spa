import {  useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { UserLoginDTO } from '../../api/apiTypes'
import { loginThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../store'

const LoginSchema = Yup.object().shape({
    Name: Yup.string()
        .required('Это поле обязательно'),
    Password: Yup.string()
        .required('Это поле обязательно')
        .min(4, 'Не менее 4 символов')
})

export const Login = () => {
    const dispatch = useAppDispatch()
    const [error, setError] = useState('')
    const formik = useFormik<UserLoginDTO>({
        initialValues: {
            Name: '',
            Password: ''
        },
        validationSchema: LoginSchema,
        onSubmit: async values => {
            const response = await dispatch(loginThunk(values))
            
            if (response.meta.requestStatus === 'rejected' && response.payload)
                setError(response.payload)
            else
                setError('')
        }
    })


    return (
        <form onSubmit={formik.handleSubmit}>
            <div>
                <input name='Name' placeholder='Логин' onChange={formik.handleChange} value={formik.values.Name}/>
                {formik.errors.Name}
            </div>
            <div>
                <input name='Password' placeholder='Регистрация' onChange={formik.handleChange} value={formik.values.Password}/>
                {formik.errors.Password}
            </div>
            <input type='submit' disabled={formik.isSubmitting}/>
            <div style={{color: 'red'}}>
                {error}
            </div>
        </form>
    )
}
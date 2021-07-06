import {  useFormik } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { UserRegisterDTO } from '../../api/apiTypes'
import { registerThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../store'

const LoginSchema = Yup.object().shape({
    Name: Yup.string()
        .required('Это поле обязательно'),
    Password: Yup.string()
        .required('Это поле обязательно')
        .min(4, 'Не менее 4 символов'),
    ConfirmPassword: Yup.string()
        .oneOf([Yup.ref('Password'), null], 'Пароли должны совпадать')
})

export const Register = () => {
    const dispatch = useAppDispatch()
    const [error, setError] = useState('')
    const formik = useFormik<UserRegisterDTO>({
        initialValues: {
            Name: '',
            Password: '',
            ConfirmPassword: ''
        },
        validationSchema: LoginSchema,
        onSubmit: async values => {
            const response = await dispatch(registerThunk(values))
            
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
                <input name='Password' placeholder='Пароль' onChange={formik.handleChange} value={formik.values.Password}/>
                {formik.errors.Password}
            </div>
            <div>
                <input name='ConfirmPassword' placeholder='Повторите пароль' onChange={formik.handleChange} value={formik.values.ConfirmPassword}/>
                {formik.errors.ConfirmPassword}
            </div>
            <input type='submit' disabled={formik.isSubmitting}/>
            <div style={{color: 'red'}}>
                {error}
            </div>
        </form>
    )
}
import { Row, Col, Button } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Formik, Form as FormWrapper } from 'formik'
import { useHistory } from 'react-router'
import * as Yup from 'yup'
import { UserRegisterDTO } from '../../api/apiTypes'
import { registerThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../store'
import { FormItem } from '../utility/FormItem'

const LoginSchema = Yup.object().shape({
    Name: Yup.string().required('Это поле обязательно'),
    Password: Yup.string()
        .required('Это поле обязательно')
        .min(4, 'Не менее 4 символов'),
    ConfirmPassword: Yup.string()
        .required('Это поле обязательно')
        .oneOf([Yup.ref('Password'), null], 'Пароли должны совпадать'),
})

const initialValues: UserRegisterDTO = {
    name: '',
    password: '',
    confirmPassword: '',
}

export const Register = () => {
    const dispatch = useAppDispatch()

    const { push } = useHistory()

    const onSubmit = async (values: UserRegisterDTO) => {
        await dispatch(registerThunk(values))
    }

    return (
        <Row justify='center' align='middle' style={{ height: '100%' }}>
            <Col>
                <Title level={2} style={{ textAlign: 'center' }}>
                    Регистрация
                </Title>
                <Formik
                    initialValues={initialValues}
                    onSubmit={onSubmit}
                    validationSchema={LoginSchema}
                >
                    {({ isSubmitting }) => (
                        <FormWrapper style={{ width: '250px' }}>
                            <FormItem
                                type='login'
                                name='Name'
                                placeholder='Логин'
                            />
                            <FormItem
                                type='password'
                                name='Password'
                                placeholder='Пароль'
                            />
                            <FormItem
                                type='password'
                                name='ConfirmPassword'
                                placeholder='Повторите пароль'
                            />
                            <Button
                                type='primary'
                                htmlType='submit'
                                style={{ width: '100%' }}
                                disabled={isSubmitting}
                            >
                                Зарегистрироваться
                            </Button>
                            Или{' '}
                            <Button
                                style={{ padding: 0 }}
                                type='link'
                                onClick={() => push('/login')}
                            >
                                войдите!
                            </Button>
                        </FormWrapper>
                    )}
                </Formik>
            </Col>
        </Row>
    )
}

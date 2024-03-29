import { Button, Col, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import { Form as FormWrapper, Formik } from 'formik'
import { useHistory } from 'react-router-dom'
import * as Yup from 'yup'
import { UserLoginDTO } from '../../api/apiTypes'
import { loginThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../store'
import { FormItem } from '../utility/FormItem'

const LoginSchema = Yup.object().shape({
    Name: Yup.string().required('Это поле обязательно'),
    Password: Yup.string()
        .required('Это поле обязательно')
        .min(4, 'Не менее 4 символов'),
})

const initialValues: UserLoginDTO = {
    name: '',
    password: '',
}

export const Login = () => {
    const dispatch = useAppDispatch()

    const { push, location } = useHistory<{ from: string } | undefined>()
    
    const onSubmit = async (values: UserLoginDTO) => {
        await dispatch(loginThunk(values))
        if (location.state)
            push(location.state.from)
    }

    return (
        <Row justify='center' align='middle' style={{ height: '100%' }}>
            <Col>
                <Title level={2} style={{ textAlign: 'center' }}>
                    Вход
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
                            <Button
                                type='primary'
                                htmlType='submit'
                                style={{ width: '100%' }}
                                disabled={isSubmitting}
                            >
                                Войти
                            </Button>
                            Или{' '}
                            <Button
                                style={{ padding: 0 }}
                                type='link'
                                onClick={() => push('/register')}
                            >
                                зарегистрируйтесь!
                            </Button>
                        </FormWrapper>
                    )}
                </Formik>
            </Col>
        </Row>
    )
}

import {
    Input,
    Checkbox,
    Button,
    Col,
    Form,
    Row,
    FormItemProps,
    DatePicker,
} from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import {
    Formik,
    useFormik,
    Form as FormWrapper,
    FormikProps,
    useField,
    FieldInputProps,
} from 'formik'
import { FC, useState } from 'react'
import * as Yup from 'yup'
import { UserLoginDTO } from '../../api/apiTypes'
import { loginThunk } from '../../slices/accountSlice'
import { useAppDispatch } from '../../store'
import { useHistory } from 'react-router-dom'
import { ValidateStatus } from 'antd/lib/form/FormItem'
import moment, { Moment } from 'moment'
import Title from 'antd/lib/typography/Title'

const LoginSchema = Yup.object().shape({
    Name: Yup.string().required('Это поле обязательно'),
    Password: Yup.string()
        .required('Это поле обязательно')
        .min(4, 'Не менее 4 символов'),
})

const initialValues: UserLoginDTO = {
    Name: '',
    Password: '',
}

let count = 0

type InputTypes = 'text' | 'password' | 'login' | 'datepicker'

const getInput = (
    type: InputTypes,
    props: FieldInputProps<any>,
    setValue: (value: any) => void
) => {
    switch (type) {
        case 'text':
            return <Input {...props} />
        case 'password':
            return (
                <Input.Password
                    {...props}
                    prefix={<LockOutlined />}
                    placeholder='Пароль'
                />
            )
        case 'login':
            return (
                <Input
                    {...props}
                    prefix={<UserOutlined />}
                    placeholder='Логин'
                />
            )
        case 'datepicker':
            const { onChange, ...prop } = props
            const picherChange = (date: Moment | null) => {
                setValue(date)
            }
            return (
                <DatePicker
                    onChange={picherChange}
                    {...prop}
                    style={{ width: '100%' }}
                />
            )
    }
}

type FormItemType = {
    type: InputTypes
    name: string
}

const FormItem: FC<FormItemType> = ({ type, name }) => {
    const [field, { touched, error }, { setValue }] = useField(name)

    const showError = touched && error

    return (
        <Form.Item
            validateStatus={showError ? 'error' : 'success'}
            help={showError && error}
        >
            {getInput(type, field, setValue)}
        </Form.Item>
    )
}

export const Login = () => {
    const dispatch = useAppDispatch()

    const { push } = useHistory()

    const [error, setError] = useState(false)

    const onSubmit = async (values: any) => {
        const response = await dispatch(loginThunk(values))
        setError(
            response.meta.requestStatus === 'rejected' && !!response.payload
        )
    }

    return (
        <Row justify='center' align='middle' style={{ height: '100%' }}>
            <div style={{ position: 'absolute', bottom: 0 }}>{++count}</div>
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
                            <FormItem type='login' name='Name' />
                            <FormItem type='password' name='Password' />
                            <Button
                                type='primary'
                                htmlType='submit'
                                style={{ width: '100%' }}
                                disabled={isSubmitting}
                            >
                                Войти
                            </Button>
                            <Form.Item
                                validateStatus='error'
                                help={
                                    error && (
                                        <div style={{ textAlign: 'center' }}>
                                            Неверный логин или пароль
                                        </div>
                                    )
                                }
                            >
                                Или{' '}
                                <Button
                                    style={{ padding: 0 }}
                                    type='link'
                                    onClick={() => push('/register')}
                                >
                                    зарегистрируйтесь!
                                </Button>
                            </Form.Item>
                        </FormWrapper>
                    )}
                </Formik>
            </Col>
        </Row>
    )
}

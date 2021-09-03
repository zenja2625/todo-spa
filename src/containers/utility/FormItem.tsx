import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { DatePicker, Form, Input } from 'antd'
import { FieldInputProps, useField } from 'formik'
import { Moment } from 'moment'
import { FC } from 'react'

type InputTypes = 'text' | 'password' | 'login' | 'datepicker'
type FormItemType = {
    type: InputTypes
    name: string
}

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

export const FormItem: FC<FormItemType> = ({ type, name }) => {
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
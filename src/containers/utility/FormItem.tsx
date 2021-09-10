import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { DatePicker, Form, Input } from 'antd'
import { FieldInputProps, useField } from 'formik'
import { Moment } from 'moment'
import { FC } from 'react'
import locale from 'antd/es/date-picker/locale/ru_RU'
import { appDateFormat } from '../../dateFormat'

type InputTypes = 'text' | 'password' | 'login' | 'datepicker'
type FormItemType = {
    type: InputTypes
    name: string
    placeholder?: string
}

const getInput = (
    type: InputTypes,
    props: FieldInputProps<any>,
    setValue: (value: any) => void,
    placeholder?: string
) => {
    switch (type) {
        case 'text':
            return <Input {...props} placeholder={placeholder}/>
        case 'password':
            return (
                <Input.Password
                    {...props}
                    prefix={<LockOutlined />}
                    placeholder={placeholder}
                />
            )
        case 'login':
            return (
                <Input
                    {...props}
                    prefix={<UserOutlined />}
                    placeholder={placeholder}
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
                    placeholder={placeholder}
                    locale={locale}
                    format={appDateFormat}
                />
            )
    }
}

export const FormItem: FC<FormItemType> = ({ type, name, placeholder }) => {
    const [field, { touched, error }, { setValue }] = useField(name)

    const showError = touched && error

    return (
        <Form.Item
            validateStatus={showError ? 'error' : 'success'}
            help={showError && error}
        >
            {getInput(type, field, setValue, placeholder)}
        </Form.Item>
    )
}
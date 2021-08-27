import { FormikComputedProps, FormikFormProps, FormikProps, FormikState, useFormik } from 'formik'
import { CustomForm } from './CustomForm'
import * as Yup from 'yup'
import { useState } from 'react'
import { Button, Checkbox, DatePicker, Input } from 'antd'
import moment, { Moment } from 'moment'


let renderCount = 0


const dateFormat = 'YYYY-MM-DD'

type ValuesType = {
    Login: string
    Password: string
    StayInSystem: boolean
    FavoriteDate?: string
}

const initialValues: ValuesType = {
    Login: '',
    Password: '',
    StayInSystem: false
}

const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
}




type StringKeys<T> = { [k in keyof T]: T[k] extends string | undefined ? k : never }[keyof T]
type OnlyString<T> = { [k in StringKeys<T>]: string }

type BooleanKeys<T> = { [k in keyof T]: T[k] extends boolean | undefined ? k : never }[keyof T]
type OnlyBoolean<T> = { [k in BooleanKeys<T>]: boolean }


type FormSchemaItem<T> = {
    name: Extract<keyof OnlyString<T>, string>
    placeholder?: string
    type: 'text' | 'date' | 'checkbox'
}

type BoolItem = {
    name: Extract<keyof OnlyBoolean<ValuesType>, string>
    type: 'checkbox'
    value?: string
}

type StringItem = {
    name: Extract<keyof OnlyString<ValuesType>, string>
    placeholder?: string
    type: 'text'
}

type DateItem = {
    name: Extract<keyof OnlyString<ValuesType>, string>
    type: 'date'
}

type GroupItem = {
    items: Array<BoolItem | StringItem | DateItem | SumbitItem>
    name: string
    type: 'group'
}

type SumbitItem = {
    name: string
    value: string
    type: 'submit'
}

type FormSchemaType = Array<BoolItem | StringItem | DateItem | SumbitItem | GroupItem>

const LoginSchema: Yup.SchemaOf<ValuesType> = Yup.object().shape({
    Login: Yup.string()
        .required('Это поле обязательно'),
    Password: Yup.string()
        .required('Это поле обязательно')
        .min(4, 'Не менее 4 символов'),
    StayInSystem: Yup.boolean().required(),
    FavoriteDate: Yup.string()
        .notRequired()
        .matches(/^\d{4}-\d{2}-\d{2}/, 'YYYY-MM-DD')
})

const FormSchema: FormSchemaType = [
    {
        name: 'Login',
        placeholder: 'Логин',
        type: 'text'
    },
    {
        name: 'Password',
        placeholder: 'Пароль',
        type: 'text'
    },
    {
        name: 'FavoriteDate',
        type: 'date'
    },
    {
        name: 'My Group',
        type: 'group',
        items: [
            {
                name: 'StayInSystem',
                type: 'checkbox',
                value: 'Hellop'
            },
            {
                name: 'loginSubmit',
                type: 'submit',
                value: 'Логин'
            }
        ]
    }
]


const createForm = (formShema: FormSchemaType, formik: FormikProps<ValuesType>) => {
    return  formShema.map(item => { 
        switch (item.type) {
            case 'text':
                return  <Input key={item.name} {...item} onChange={formik.handleChange} value={formik.values[item.name]}/>
            case 'date':
                return <DatePicker 
                    key={item.name}
                    {...item}
                    onChange={date => formik.setFieldValue('FavoriteDate', date?.format(dateFormat))}
                    value={formik.values[item.name] ? moment(formik.values[item.name], dateFormat) : undefined}
                />
            case 'checkbox':
                return <Checkbox key={item.name} {...item} onChange={formik.handleChange} checked={formik.values[item.name]}>{item.value}</Checkbox>
            case 'group':
                return <div key={item.name}>{createForm(item.items, formik)}</div>
            case 'submit': 
                return <Button key={item.name} type='primary' htmlType='submit' disabled={formik.isSubmitting}>{item.value}</Button>
        }
    })

}

export const Temporarily = () => {
    const formik = useFormik<ValuesType>({
        initialValues,
        validationSchema: LoginSchema,
        onSubmit: async values => {
            await sleep(1000)
            // alert(JSON.stringify(values, null, 2))
            formik.setValues(initialValues)
        }
    })
    

    

    // const formItems = FormSchema.map(item => { 
    //     switch (item.type) {
    //         case 'text':
    //             return  <Input {...item} onChange={formik.handleChange} value={formik.values[item.name]}/>
    //         case 'date':
    //             return <DatePicker 
    //                 {...item}
    //                 onChange={date => formik.setFieldValue('FavoriteDate', date?.format(dateFormat))}
    //                 value={formik.values[item.name] ? moment(formik.values[item.name], dateFormat) : undefined}
    //             />
    //         case 'checkbox':
    //             return <Checkbox {...item} onChange={formik.handleChange} checked={formik.values[item.name]}>{item.value}</Checkbox>

    //     }
    // })

    return (
        <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ marginBottom: '50px' }}>Универсальная форма</h1>
            <h3>Количество рендеров: {++renderCount}</h3>
            {/* <CustomForm /> */}

            <h2>Вход</h2>
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={formik.handleSubmit}>
                {/* {formItems} */}
                {/* {createForm(FormSchema, formik)} */}
                <Input name='Login' placeholder='Логин' onChange={formik.handleChange} value={formik.values.Login}/>
                <Input name='Password' placeholder='Пароль' onChange={formik.handleChange} value={formik.values.Password}/>
                <Checkbox name="StayInSystem" onChange={formik.handleChange} checked={formik.values.StayInSystem}>Запомнить?</Checkbox>
                <DatePicker 
                    name='FavoriteDate'  
                    onChange={date => formik.setFieldValue('FavoriteDate', date?.format(dateFormat))}
                    value={formik.values.FavoriteDate ? moment(formik.values.FavoriteDate, dateFormat) : undefined}
                />

                {/* <input name='FavoriteDate' type="date"  onChange={formik.handleChange} value={formik.values.FavoriteDate}/>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ alignSelf: 'center' }}>
                        <Checkbox name="StayInSystem" onChange={formik.handleChange} checked={formik.values.StayInSystem}>Запомнить?</Checkbox>
                    </div>
                    <input type="submit" value="Вход" disabled={formik.isSubmitting}/>
                </div> */}
            </form>


            <div style={{ position: 'absolute', bottom: 0,  whiteSpace: 'pre-line' }}>
                <div>{JSON.stringify(formik.errors, null, 2)}</div>
                <div>{JSON.stringify(formik.values, null, 2)}</div>
            </div>

        </div>
    )
}

/*
            <form style={{ display: 'flex', flexDirection: 'column' }} onSubmit={formik.handleSubmit}>
                <input name='Login' placeholder='Логин' onChange={formik.handleChange} value={formik.values.Login}/>
                <input name='Password' placeholder='Пароль' onChange={formik.handleChange} value={formik.values.Password}/>
                <input name='FavoriteDate' type="date"  onChange={formik.handleChange} value={formik.values.FavoriteDate}/>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <div style={{ alignSelf: 'center' }}>
                        <input type="checkbox" name="StayInSystem" onChange={formik.handleChange} checked={formik.values.StayInSystem} /> Запомнить?
                    </div>
                    <input type="submit" value="Вход" disabled={formik.isSubmitting}/>
                </div>
            </form>
*/
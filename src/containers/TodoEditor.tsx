import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { ChangeEvent, FC, useEffect, useState } from 'react'
import { Todo } from '../slices/sliceTypes'
import locale from 'antd/es/date-picker/locale/ru_RU'



type TodoEditorPropsType = {
    categoryId: number
    date?: string
    value?: string
    todo?: Todo
    onEnd: (value: string, date?: Date) => void
}



const dateFormat = 'DD.MM.YYYY'
const serverFormat = 'YYYY-MM-DD'

export const TodoEditor: FC<TodoEditorPropsType> = ({ todo, categoryId, onEnd }) => {
    const [value, setValue] = useState('')
    const [date, setDate] = useState<Moment | null>(null)


    useEffect(() => {
        if (todo) {
            setValue(todo.value)
            setDate(todo.taskEnd ? moment(todo.taskEnd, serverFormat) : null)
        }
        else {
            setValue('')
            setDate(null)
        }
    }, [todo])


    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    const onDateChange = (date: moment.Moment | null) => {
        setDate(date)
    }


    const save = () => {
        // onEnd(value, date?.format(dateFormat))
        onEnd(value, date?.toDate())
    }

    return (
        <div>
            <div>
                <input type='text' value={value} onChange={onChange}/>
                <DatePicker disabledDate={date => date < moment().startOf('day')} locale={locale} value={date} format={dateFormat} onChange={onDateChange}/>
            </div>
            <input type='button' value={todo ? 'Сохранить' : 'Добавить задачу'} onClick={save}/>
            <input type="button" value="Отмена" />
        </div>
    )
}
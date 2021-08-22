import { DatePicker } from 'antd'
import moment, { Moment } from 'moment'
import { ChangeEvent, FC, useEffect, useState } from "react"
import { Todo } from "../slices/sliceTypes"

type TodoEditorPropsType = {
    categoryId: number
    todo?: Todo
}

const dateFormat = 'DD.MM.YYYY'

export const TodoEditor: FC<TodoEditorPropsType> = ({ todo, categoryId }) => {
    const [value, setValue] = useState('')
    const [date, setDate] = useState<Moment | null>(null)

    useEffect(() => {
        if (todo) {
            setValue(todo.value)
            setDate(todo.taskEnd ? moment(todo.taskEnd, dateFormat) : null)
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

    return (
        <div>
            <div>
                <input type="text" value={value} onChange={onChange}/>
                <DatePicker value={date} format={dateFormat} onChange={onDateChange}/>
            </div>
            <input type="button" value="Добавить задачу" />
        </div>
    )
}
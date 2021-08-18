import { ChangeEvent, FC, useState } from "react"
import { Todo } from "../slices/sliceTypes"

type TodoEditorPropsType = {
    initialTodo?: Todo
}

export const TodoEditor: FC<TodoEditorPropsType> = ({ initialTodo }) => {
    const [value, setValue] = useState(initialTodo?.value || '')
    const [date, setDate] = useState(initialTodo?.taskEnd ||  '2018-07-22')

    //const date1 = new Date().getDate()
    console.log(new Date().toLocaleDateString('ru'))

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        setValue(event.target.value)
    }

    return (
        <div>
            <input type="text" value={value} onChange={onChange}/>
            <input type="date" value={date}/>
        </div>
    )
}
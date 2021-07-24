import { useEffect, useState } from 'react'
import { todoStatusDTO } from '../api/apiTypes'
import { useDebounce } from '../hooks/useDebounce'
import { getTodosThunk, toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'

type statusProperties = 'isDone' | 'isHiddenSubTodo'

const isEmptyStatus = (status: todoStatusDTO) =>
    status.isDone === undefined && status.isHiddenSubTodo === undefined

const setStatus = (statuses: Array<todoStatusDTO>, propertyType: statusProperties, value: boolean, id: number) => {
    const prevStatus = statuses.find(x => x.id === id)

    if (prevStatus) {
        prevStatus[propertyType] = prevStatus[propertyType] === undefined ? value : undefined
        return statuses
            .map(status => status.id === id ? prevStatus : status)
            .filter(status => !isEmptyStatus(status))
    }
    else {
        return [...statuses, { id, [propertyType]: value }]
    }
}

export const Todos = () => {
    const dispatch = useAppDispatch()
    const selectedCategoryId = useAppSelector(state => state.categories.selectedCategoryId)
    const todos = useAppSelector(state => state.todos.todos)

    const [statuses, setStatuses] = useState<Array<todoStatusDTO>>([])

    const st = useDebounce(statuses, 1000)

    useEffect(() => {
        if (st.length) {
            setStatuses([])
        }
    }, [st])

    const [consol, setConsol] = useState('')

    useEffect(() => {
        if (selectedCategoryId > 0) 
            dispatch(getTodosThunk(selectedCategoryId))
    }, [selectedCategoryId, dispatch])

    useEffect(() => {
        setConsol(JSON.stringify(statuses, null, 2))
    }, [statuses])


    const progress = (id: number, isDone: boolean) => {
        dispatch(toggleTodoProgress(id))
        setStatuses(prevStatuses => setStatus(prevStatuses, 'isDone', isDone, id))
    }
    
    const hiding = (id: number, isHiddenSubTasks: boolean) => {
        dispatch(toggleTodoHiding(id))
        setStatuses(prevStatuses => setStatus(prevStatuses, 'isHiddenSubTodo', isHiddenSubTasks, id))
    }

    const todoItems = todos.map((t, i, array) => {
        const nextIndex = i + 1;

        return (
            <div style={{ marginLeft: `${30 * t.depth}px` }} key={t.id}>
                {array.length > nextIndex && t.depth < array[nextIndex].depth ? <input type="button" onClick={() => hiding(t.id, !t.isHiddenSubTasks)} style={{ width: '25px' }} value={t.isHiddenSubTasks ? '>' : 'ᐯ'} /> : <span style={{ marginRight: '25px' }}></span>}
                <input type='checkbox' onChange={() => progress(t.id, !t.isDone)} checked={t.isDone}></input>
                {t.value}
            </div>
        )
    })

    return (
        <div>
            Todos
            <div>
                {todoItems}
            </div>
            <div >
                <pre>{consol}</pre>
            </div>
        </div>
    )
}
import { useEffect, useRef, useState } from 'react'
import { todoStatusDTO } from '../api/apiTypes'
import { useDebounce } from '../hooks/useDebounce'
import { Todo } from '../slices/sliceTypes'
import { changeTodoPosition, getTodosThunk, toggleTodoHiding, toggleTodoProgress } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'
import { MoreOutlined } from '@ant-design/icons'
import { TodoItem } from './TodoItem'


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

const useDragAndDrop = () => {
    const ref = useRef<HTMLDivElement>(null)



    return { ref }
}

export const Todos = () => {
    console.log('Render')
    const dispatch = useAppDispatch()
    const selectedCategoryId = useAppSelector(state => state.categories.selectedCategoryId)
    const todos = useAppSelector(state => state.todos.todos)

    const { ref } = useDragAndDrop()

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

    let todoItems = todos.map((t, i, array) => {
        const nextIndex = i + 1;

        return <TodoItem 
                    key={t.id}
                    todo={t} 
                    showHideButton={array.length > nextIndex && t.depth < array[nextIndex].depth}
                />
    })

    // todoItems.splice(1, 0, (<div key='Skeleton'>Skeleton</div>))

    return (
        <div>
            Todos
            <div ref={ref} style={{overflow: 'hidden', width: '400px'}}>
                {todoItems}
            </div>
            <div >
                <pre>{consol}</pre>
            </div>
        </div>
    )
}
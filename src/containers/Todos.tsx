import { useEffect } from 'react'
import { getTodosThunk } from '../slices/todosSlice'
import { useAppDispatch, useAppSelector } from '../store'

export const Todos = () => {
    const dispatch = useAppDispatch()
    const selectedCategoryId = useAppSelector(state => state.categories.selectedCategoryId)
    const todos = useAppSelector(state => state.todos.todos)

    useEffect(() => {
        if (selectedCategoryId > 0)
            dispatch(getTodosThunk(selectedCategoryId))
    }, [selectedCategoryId, dispatch])

    const todoItems = todos.map((t, i, array) => {
        const nextIndex = i + 1;

        return (
            <div style={{ marginLeft: `${30 * t.depth}px` }} key={t.id}>
                {array.length > nextIndex && t.depth < array[i + 1].depth ? <input type="button" style={{width: '25px'}} value={t.isHiddenSubTasks ? '>' : 'ᐯ'} /> : <span style={{marginRight: '25px'}}></span> }
                <input type='checkbox' checked={t.isDone}></input>
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
        </div>
    )
}
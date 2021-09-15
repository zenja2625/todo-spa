import { Todo } from '../slices/sliceTypes'
import { RootState } from '../store'

export const getTodos = (state: RootState) => {
    const todos = state.todos.todos
    const statuses = state.todos.todoStatusDTOs
    const draggedTodoId = state.todos.draggedTodo?.id

    let newTodos: Array<Todo> = []

    let todoIndex = -1

    for (let i = 0; i < todos.length; i++) {
        if (todoIndex !== -1) {
            if (todos[todoIndex].depth < todos[i].depth) continue
            else todoIndex = -1
        }

        if (
            todos[i].isHiddenSubTasks ||
            statuses[todos[i].id]?.isHiddenSubTasks ||
            todos[i].id === draggedTodoId
        )
            todoIndex = i

        newTodos.push({
            ...todos[i],
            ...statuses[todos[i].id],
            showHideButton:
                i + 1 < todos.length && todos[i].depth < todos[i + 1].depth,
        })
    }

    return newTodos
}

import { createDraftSafeSelector } from '@reduxjs/toolkit'
import { Todo } from '../slices/sliceTypes'
import { RootState } from '../store'

export const getTodos = createDraftSafeSelector(
    (state: RootState) => state.todos.items,
    state => state.todos.draggedTodo.dragId,
    state => state.categories.showCompletedTodos,
    (todos, draggedTodoId, showCompletedTodos) => {
        let newTodos: Array<Todo> = []

        let todoIndex = -1

        for (let i = 0; i < todos.length; i++) {
            if (todoIndex !== -1) {
                if (todos[todoIndex].depth < todos[i].depth) continue
                else todoIndex = -1
            }

            if (!showCompletedTodos && todos[i].isDone) {
                todoIndex = i
                continue
            }

            if (!todos[i].isOpen || todos[i].id === draggedTodoId) todoIndex = i

            if (newTodos.length && newTodos[newTodos.length - 1].depth < todos[i].depth)
                newTodos[newTodos.length - 1].showHideButton = true
                
            newTodos.push({
                ...todos[i],
                showHideButton: !todos[i].isOpen,
            })
        }

        return newTodos
    }
)

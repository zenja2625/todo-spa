import { createDraftSafeSelector } from '@reduxjs/toolkit'
import { Todo } from '../slices/sliceTypes'
import { RootState } from '../store'

export const getTodos = createDraftSafeSelector(
    (state: RootState) => state.todos.todos,
    state => state.todos.draggedTodoId,
    (todos, draggedTodoId) => {
        let newTodos: Array<Todo> = []

        let todoIndex = -1

        for (let i = 0; i < todos.length; i++) {
            if (todoIndex !== -1) {
                if (todos[todoIndex].depth < todos[i].depth) continue
                else todoIndex = -1
            }

            if (todos[i].isHiddenSubTasks || todos[i].id === draggedTodoId) todoIndex = i

            newTodos.push({
                ...todos[i],
                showHideButton: i + 1 < todos.length && todos[i].depth < todos[i + 1].depth,
            })
        }

        return newTodos
    }
)

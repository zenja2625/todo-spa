import { createDraftSafeSelector } from '@reduxjs/toolkit'
import { TodoEditorValueType } from '../containers/containerTypes'
import { serverDateFormat } from '../dateFormat'
import { TodoDTO } from '../slices/sliceTypes'
import { RootState } from '../store'
import moment from 'moment'

export const getEditTodoValue = createDraftSafeSelector<
    RootState,
    TodoDTO[],
    number | undefined,
    TodoEditorValueType
>(
    state => state.todos.todos,
    state => state.todos.todoEditor.editTodoId,
    (todos, todoId) => {
        const todo = todoId ? todos.find(todo => todo.id === todoId) : null

        if (todo)
            return {
                value: todo.value,
                taskEnd: todo.taskEnd
                    ? moment(todo.taskEnd, serverDateFormat)
                    : undefined,
            }
        else return { value: '' }
    }
)

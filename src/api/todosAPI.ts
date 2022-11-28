import { instance } from './api'
import { TodoPositionDTO, TodoPostDTO, TodoPutDTO, TodoStatusDTO } from './apiTypes'

export const todosAPI = {
    getTodos: (categoryId: string, withCompleted: boolean = false) =>
        instance.get(`categories/${categoryId}/todos`, { params: { withCompleted } }),
    createTodo: (categoryId: string, payload: TodoPostDTO) => 
        instance.post(`categories/${categoryId}/todos`, payload),
    updateTodo: (categoryId: string, todoId: string, payload: TodoPutDTO) =>
        instance.put(`categories/${categoryId}/todos/${todoId}`, payload),
    deleteTodo: (categoryId: string, todoId: string) =>
        instance.delete(`categories/${categoryId}/todos/${todoId}`),
    updateStatuses: (categoryId: string, payload: TodoStatusDTO[]) =>
        instance.patch(`categories/${categoryId}/todos/statuses`, payload),
    updatePositions: (categoryId: string, payload: TodoPositionDTO[]) =>
        instance.patch(`categories/${categoryId}/todos/positions`, payload),
}


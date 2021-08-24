import { instance } from './api'
import { TodoPositionDTO, TodoPostDTO, TodoPutDTO, TodoStatusDTO } from './apiTypes'

export const todosAPI = {
    getTodos: (categoryId: number, withCompleted: boolean = false) =>
        instance.get(`categories/${categoryId}/todos`, { params: { withCompleted } }),
    createTodo: (categoryId: number, payload: TodoPostDTO) => 
        instance.post(`categories/${categoryId}/todos`, payload),
    updateTodo: (categoryId: number, todoId: number, payload: TodoPutDTO) =>
        instance.put(`categories/${categoryId}/todos/${todoId}`, payload),
    deleteTodo: (categoryId: number, todoId: number) =>
        instance.delete(`categories/${categoryId}/todos/${todoId}`),
    updateStatuses: (categoryId: number, payload: TodoStatusDTO[]) =>
        instance.patch(`categories/${categoryId}/todos/statuses`, payload),
    updatePositions: (categoryId: number, payload: TodoPositionDTO[]) =>
        instance.patch(`categories/${categoryId}/todos/positions`, payload),
}


import { instance } from './api'
import { todoPositionDTO, todoPostDTO, todoPutDTO, todoStatusDTO } from './apiTypes'

export const todosAPI = {
    getTodos: (categoryId: number, withCompleted: boolean = false) =>
        instance.get(`categories/${categoryId}/todos`, { params: { withCompleted } }),
    createTodo: (categoryId: number, payload: todoPostDTO) => 
        instance.post(`categories/${categoryId}/todos`, payload),
    updateTodo: (categoryId: number, todoId: number, payload: todoPutDTO) =>
        instance.put(`categories/${categoryId}/todos/${todoId}`, payload),
    deleteTodo: (categoryId: number, todoId: number) =>
        instance.delete(`categories/${categoryId}/todos/${todoId}`),
    updateStatuses: (categoryId: number, payload: todoStatusDTO[]) =>
        instance.patch(`categories/${categoryId}/todos/statuses`, payload),
    updatePositions: (categoryId: number, payload: todoPositionDTO[]) =>
        instance.patch(`categories/${categoryId}/todos/positions`, payload),
}


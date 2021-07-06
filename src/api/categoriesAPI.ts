import { instance } from './api';
import { categoryRequestDTO } from './apiTypes';

export const categoriesAPI = {
    getCategories: () => 
        instance.get('categories'),
    createCategory: (payload: categoryRequestDTO) =>
        instance.post('categories', payload),
    updateCategory: (categoryId: number, payload: categoryRequestDTO) =>
        instance.put(`categories/${categoryId}`, payload),
    deleteCategory: (categoryId: number) =>
        instance.delete(`categories/${categoryId}`)
}
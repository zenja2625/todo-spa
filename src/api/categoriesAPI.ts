import { instance } from './api';
import { CategoryRequestDTO } from './apiTypes';

export const categoriesAPI = {
    getCategories: () => 
        instance.get('categories'),
    createCategory: (payload: CategoryRequestDTO) =>
        instance.post('categories', payload),
    updateCategory: (categoryId: number, payload: CategoryRequestDTO) =>
        instance.put(`categories/${categoryId}`, payload),
    deleteCategory: (categoryId: number) =>
        instance.delete(`categories/${categoryId}`)
}
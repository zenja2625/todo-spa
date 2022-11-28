import { instance } from './api';
import { CategoryRequestDTO } from './apiTypes';

export const categoriesAPI = {
    getCategories: () => 
        instance.get('categories'),
    createCategory: (payload: CategoryRequestDTO) =>
        instance.post('categories', payload),
    updateCategory: (categoryId: string, payload: CategoryRequestDTO) =>
        instance.put(`categories/${categoryId}`, payload),
    deleteCategory: (categoryId: string) =>
        instance.delete(`categories/${categoryId}`)
}
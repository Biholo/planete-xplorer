import { categoryService } from '@/api/categoryService';

import { CreateCategory, GetAllCategories, UpdateCategory } from '@shared/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllCategories = (params?: GetAllCategories) => {
    return useQuery({
        queryKey: ['categories', params],
        queryFn: () => categoryService.getAllCategories(params).then((res) => res.data),
        refetchOnWindowFocus: false,
    });
};

export const useGetCategoryById = (id: string) => {
    return useQuery({
        queryKey: ['category', id],
        queryFn: () => categoryService.getCategoryById(id).then((res) => res.data)  ,
        enabled: !!id,
        refetchOnWindowFocus: false,
    });
};

export const useCreateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (category: CreateCategory) => categoryService.createCategory(category).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            console.log('Category created successfully');
        },
        onError: (error) => {
            console.error('Failed to create category:', error);
        },
    });
};

export const useUpdateCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, category }: { id: string; category: UpdateCategory }) => 
            categoryService.updateCategory(id, category).then((res) => res.data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['category', id] });
            console.log('Category updated successfully');
        },
        onError: (error) => {
            console.error('Failed to update category:', error);
        },
    });
};

export const useDeleteCategory = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => categoryService.deleteCategory(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            console.log('Category deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete category:', error);
        },
    });
}; 
import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';

import { CategoryDto, CreateCategory, GetAllCategories, UpdateCategory } from '@shared/dto';

class CategoryService {
    private apiUrl = '/api/categories';

    public async getAllCategories(params?: GetAllCategories): Promise<ApiResponse<CategoryDto[]>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.sort) queryParams.append('sort', params.sort);
        
        const queryString = queryParams.toString();
        const url = queryString ? `${this.apiUrl}?${queryString}` : this.apiUrl;
        
        return api.fetchRequest(url, 'GET', null, true);
    }

    public async getCategoryById(id: string): Promise<ApiResponse<CategoryDto>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'GET', null, true);
    }

    public async createCategory(category: CreateCategory): Promise<ApiResponse<CategoryDto>> {
        return api.fetchRequest(this.apiUrl, 'POST', category, true);
    }

    public async updateCategory(id: string, category: UpdateCategory): Promise<ApiResponse<CategoryDto>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'PATCH', category, true);
    }

    public async deleteCategory(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'DELETE', null, true);
    }
}

export const categoryService = new CategoryService(); 
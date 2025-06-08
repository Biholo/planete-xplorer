import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';

import { CreateSystem, GetAllSystems, SystemDto, UpdateSystem } from '@shared/dto';

class SystemService {
    private apiUrl = '/api/systems';

    public async getAllSystems(params?: GetAllSystems): Promise<ApiResponse<SystemDto[]>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.sort) queryParams.append('sort', params.sort);
        
        const queryString = queryParams.toString();
        const url = queryString ? `${this.apiUrl}?${queryString}` : this.apiUrl;
        
        return api.fetchRequest(url, 'GET', null, true);
    }

    public async getSystemById(id: string): Promise<ApiResponse<SystemDto>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'GET', null, true);
    }

    public async createSystem(system: CreateSystem): Promise<ApiResponse<SystemDto>> {
        return api.fetchRequest(this.apiUrl, 'POST', system, true);
    }

    public async updateSystem(id: string, system: UpdateSystem): Promise<ApiResponse<SystemDto>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'PATCH', system, true);
    }

    public async deleteSystem(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'DELETE', null, true);
    }
}

export const systemService = new SystemService(); 
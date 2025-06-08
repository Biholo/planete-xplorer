import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';

import { CelestialObjectDto, CreateCelestialObject, GetAllCelestialObjects, UpdateCelestialObject } from '@shared/dto';

class CelestialObjectService {
    private apiUrl = '/api/celestial-objects';

    public async getAllCelestialObjects(params?: GetAllCelestialObjects): Promise<ApiResponse<CelestialObjectDto[]>> {
        const queryParams = new URLSearchParams();
        if (params?.page) queryParams.append('page', params.page);
        if (params?.limit) queryParams.append('limit', params.limit);
        if (params?.search) queryParams.append('search', params.search);
        if (params?.sort) queryParams.append('sort', params.sort);
        if (params?.categoryId) queryParams.append('categoryId', params.categoryId);
        if (params?.systemId) queryParams.append('systemId', params.systemId);
        if (params?.type) queryParams.append('type', params.type);
        
        const queryString = queryParams.toString();
        const url = queryString ? `${this.apiUrl}?${queryString}` : this.apiUrl;
        
        return api.fetchRequest(url, 'GET', null, true);
    }

    public async getCelestialObjectById(id: string): Promise<ApiResponse<CelestialObjectDto>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'GET', null, true);
    }

    public async createCelestialObject(celestialObject: CreateCelestialObject): Promise<ApiResponse<CelestialObjectDto>> {
        return api.fetchRequest(this.apiUrl, 'POST', celestialObject, true);
    }

    public async updateCelestialObject(id: string, celestialObject: UpdateCelestialObject): Promise<ApiResponse<CelestialObjectDto>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'PATCH', celestialObject, true);
    }

    public async deleteCelestialObject(id: string): Promise<ApiResponse<void>> {
        return api.fetchRequest(`${this.apiUrl}/${id}`, 'DELETE', null, true);
    }
}

export const celestialObjectService = new CelestialObjectService(); 
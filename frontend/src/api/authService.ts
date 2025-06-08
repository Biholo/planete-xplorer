import { api } from '@/api/interceptor';
import { ApiResponse } from '@/types';

import { AuthResponse, Login, Register, User } from '@shared/dto';
import Cookies from 'js-cookie';

class AuthService {
    private apiUrl = '/api/auth';

    public async registerUser(user: Register): Promise<ApiResponse<AuthResponse>> {
        const response = await api.fetchRequest(`${this.apiUrl}/register`, 'POST', user);
        if (response.accessToken) {
            Cookies.set('accessToken', response.accessToken, { expires: 1 });
            Cookies.set('refreshToken', response.refreshToken, { expires: 7 });
        }
        return response;
    }

    public async loginUser(credentials: Login): Promise<ApiResponse<AuthResponse>> {
        console.log('Attempting login with credentials:', credentials);
        try {
            const response = await api.fetchRequest(`${this.apiUrl}/login`, 'POST', credentials);
            if (response.data.accessToken) {
                Cookies.set('accessToken', response.data.accessToken, { expires: 1 });
                Cookies.set('refreshToken', response.data.refreshToken, { expires: 7 });
            }
            return response;
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    }

    public async getUserByToken(): Promise<ApiResponse<User>> {
        return api.fetchRequest(`${this.apiUrl}/me`, 'GET', null, true);
    }

    public async refreshToken(refreshToken: string): Promise<AuthResponse> {
        const response = await api.fetchRequest(`${this.apiUrl}/refresh`, 'POST', { refreshToken });
        if (response.accessToken) {
            Cookies.set('accessToken', response.accessToken, { expires: 1 });
            Cookies.set('refreshToken', response.refreshToken, { expires: 7 });
        }
        return response;
    }

    public async logout(refreshToken: string): Promise<void> {
        return api.fetchRequest(`${this.apiUrl}/logout`, 'POST', { refreshToken });
    }
}

export const authService = new AuthService();

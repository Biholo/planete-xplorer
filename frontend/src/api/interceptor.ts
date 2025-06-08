import { AuthResponse } from '@shared/dto';
import Cookies from 'js-cookie';

class Interceptor {
    private url: string;

    constructor() {
        this.url = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        console.log('API Base URL:', this.url);
    }

    public getUrl(): string {
        return this.url;
    }

    private createHeaders(includeAuth: boolean = false, isFormData: boolean = false): HeadersInit {
        const headers: HeadersInit = {};

        if (!isFormData) {
            headers['Content-Type'] = 'application/json';
        }

        if (includeAuth) {
            const token = Cookies.get('accessToken');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    }

    public async fetchMultipartRequest(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        body: any = null,
        includeAuth: boolean = false
    ): Promise<any> {
        const isFormData = body instanceof FormData;
        const fullUrl = `${this.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        console.log('Making request to:', fullUrl);

        const options: RequestInit = {
            method,
            headers: {
                ...this.createHeaders(includeAuth, isFormData),
            },
        };

        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        try {
            const response = await fetch(fullUrl, options);

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                } catch (jsonError) {
                    errorData = { message: response.statusText };
                }
                throw new Error(
                    errorData.message || `${method} request failed: ${response.statusText}`
                );
            }

            try {
                return await response.json();
            } catch (jsonError) {
                return { success: true };
            }
        } catch (error: any) {
            console.error('Request error:', error);
            throw new Error(error.message || 'Une erreur est survenue lors de la requête');
        }
    }

    // Fonction générique pour gérer toutes les requêtes HTTP
    public async fetchRequest(
        endpoint: string,
        method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
        body: any = null,
        includeAuth: boolean = false
    ): Promise<any> {
        const isFormData = body instanceof FormData;
        const fullUrl = `${this.url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        console.log('🚀 Making API request:', { method, fullUrl, includeAuth, body });

        const options: RequestInit = {
            method,
            headers: this.createHeaders(includeAuth, isFormData),
        };

        if (body) {
            options.body = isFormData ? body : JSON.stringify(body);
        }

        console.log('📡 Request options:', options);

        try {
            console.log('⏳ Sending request...');
            const response = await fetch(fullUrl, options);
            console.log('📥 Response received:', { 
                status: response.status, 
                statusText: response.statusText, 
                ok: response.ok,
                headers: Object.fromEntries(response.headers.entries())
            });

            if (!response.ok) {
                let errorData;
                try {
                    errorData = await response.json();
                    console.error('❌ Error response data:', errorData);
                } catch (jsonError) {
                    errorData = { message: response.statusText };
                    console.error('❌ Failed to parse error response:', jsonError);
                }
                throw new Error(
                    errorData.message || `${method} request failed: ${response.statusText}`
                );
            }

            try {
                const responseData = await response.json();
                console.log('✅ Response data:', responseData);
                return responseData;
            } catch (jsonError) {
                console.log('⚠️ Empty response body, returning success');
                return { success: true };
            }
        } catch (error: any) {
            console.error('💥 Request error:', error);
            console.error('💥 Error details:', {
                name: error.name,
                message: error.message,
                stack: error.stack
            });
            throw new Error(error.message || 'Une erreur est survenue lors de la requête');
        }
    }

    // Récupération d'un nouveau token via le refresh token
    public async getNewAccessToken(refreshToken: string): Promise<AuthResponse | null> {
        const response = await this.fetchRequest('/api/auth/refresh', 'POST', {
            token: refreshToken,
        });

        if (response.token) {
            Cookies.set('accessToken', response.token, { expires: 1 }); // expire dans 1 jour
        }

        if (response.refreshToken) {
            Cookies.set('refreshToken', response.refreshToken, { expires: 30 }); // expire dans 30 jours
        }

        return response || null;
    }
}

export const api = new Interceptor();

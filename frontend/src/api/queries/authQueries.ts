import { authService } from '@/api/authService';

import { AuthResponse, Login, Register } from '@shared/dto';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import { useAuthStore } from '@/stores/authStore';

export const useRegister = () => {
    const { login } = useAuthStore();

    return useMutation({
        mutationFn: async (userData: Register) => {
            const response = await authService.registerUser(userData);
            if (response.data.accessToken && response.data.refreshToken) {
                login(response.data.accessToken, response.data.refreshToken);
                return {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                };
            } else {
                throw new Error('Registration failed');
            }
        },
        onSuccess: async (response: AuthResponse) => {
            login(response.accessToken, response.refreshToken);
        },
    });
};

export const useLogin = () => {
    const { login } = useAuthStore();

    return useMutation<{ accessToken: string; refreshToken: string }, Error, Login>({
        mutationFn: async (credentials: Login) => {
            const response = await authService.loginUser(credentials);
            if (response.data.accessToken && response.data.refreshToken) {
                // Mettre à jour le store avec les tokens
                login(response.data.accessToken, response.data.refreshToken);

                return {
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken,
                };
            } else {
                throw new Error('Login failed');
            }
        },

        onSuccess: async (response: AuthResponse) => {
            login(response.accessToken, response.refreshToken);
            console.log('Login successful');
        },
    });
};

export const useAutoLogin = () => {
    const { initialize } = useAuthStore();

    return useQuery({
        queryKey: ['autoLogin'],
        queryFn: async () => {
            await initialize();
            return useAuthStore.getState().isAuthenticated;
        },
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        retry: false,
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                await authService.logout(refreshToken);
                handleLogout();
            }
        },
    });
};

const handleLogout = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    useAuthStore.getState().logout();
};

// src/stores/authStore.ts
import { authService } from '@/api/authService';

import { User } from '@shared/dto';
import Cookies from 'js-cookie';
import { create } from 'zustand';

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    accessToken: string | null;
    refreshToken: string | null;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (value: boolean) => void;
    login: (accessToken: string, refreshToken: string) => void;
    logout: () => void;
    initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    accessToken: null,
    refreshToken: null,
    setUser: (user) => set({ user }),
    setIsAuthenticated: (value) => set({ isAuthenticated: value }),
    login: (accessToken, refreshToken) =>
        set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
        }),
    logout: () =>
        set({
            user: null,
            isAuthenticated: false,
            accessToken: null,
            refreshToken: null,
        }),
    initialize: async () => {
        const accessToken = Cookies.get('accessToken');
        const refreshToken = Cookies.get('refreshToken');

        if (accessToken && refreshToken) {
            try {
                const response = await authService.getUserByToken();
                if (
                    !useAuthStore.getState().isAuthenticated ||
                    useAuthStore.getState().accessToken !== accessToken
                ) {
                    set({
                        user: response?.data || null,
                        isAuthenticated: true,
                        accessToken: accessToken,
                        refreshToken: refreshToken,
                    });
                }
            } catch (error) {
                console.error('Failed to initialize auth:', error);
                set({
                    user: null,
                    isAuthenticated: false,
                    accessToken: null,
                    refreshToken: null,
                });
            }
        }
    },
}));

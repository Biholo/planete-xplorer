import { systemService } from '@/api/systemService';

import { CreateSystem, GetAllSystems, UpdateSystem } from '@shared/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllSystems = (params?: GetAllSystems) => {
    return useQuery({
        queryKey: ['systems', params],
        queryFn: () => systemService.getAllSystems(params).then((res) => res.data),
        refetchOnWindowFocus: false,
    });
};

export const useGetSystemById = (id: string) => {
    return useQuery({
        queryKey: ['system', id],
        queryFn: () => systemService.getSystemById(id).then((res) => res.data),
        enabled: !!id,
        refetchOnWindowFocus: false,
    });
};

export const useCreateSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (system: CreateSystem) => systemService.createSystem(system).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systems'] });
            console.log('System created successfully');
        },
        onError: (error) => {
            console.error('Failed to create system:', error);
        },
    });
};

export const useUpdateSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, system }: { id: string; system: UpdateSystem }) => 
            systemService.updateSystem(id, system).then((res) => res.data),
        onSuccess: (_, { id }) => {
            queryClient.invalidateQueries({ queryKey: ['systems'] });
            queryClient.invalidateQueries({ queryKey: ['system', id] });
            console.log('System updated successfully');
        },
        onError: (error) => {
            console.error('Failed to update system:', error);
        },
    });
};

export const useDeleteSystem = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => systemService.deleteSystem(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['systems'] });
            console.log('System deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete system:', error);
        },
    });
}; 
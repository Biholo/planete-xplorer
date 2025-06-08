import { celestialObjectService } from '@/api/celestialObjectService';

import { CreateCelestialObject, GetAllCelestialObjects, UpdateCelestialObject } from '@shared/dto';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useGetAllCelestialObjects = (params?: GetAllCelestialObjects) => {
    return useQuery({
        queryKey: ['celestialObjects', params],
        queryFn: () => celestialObjectService.getAllCelestialObjects(params).then((res) => res.data),
        refetchOnWindowFocus: false,
    });
};

export const useGetCelestialObjectById = (id: string) => {
    return useQuery({
        queryKey: ['celestialObject', id],
        queryFn: () => celestialObjectService.getCelestialObjectById(id).then((res) => res.data),
        enabled: !!id,
        refetchOnWindowFocus: false,
    });
};

export const useCreateCelestialObject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (celestialObject: CreateCelestialObject) => 
            celestialObjectService.createCelestialObject(celestialObject).then((res) => res.data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['celestialObjects'] });
            // Invalidate related category and system queries
            if (variables.categoryId) {
                queryClient.invalidateQueries({ queryKey: ['category', variables.categoryId] });
            }
            if (variables.systemId) {
                queryClient.invalidateQueries({ queryKey: ['system', variables.systemId] });
            }
            console.log('Celestial object created successfully');
        },
        onError: (error) => {
            console.error('Failed to create celestial object:', error);
        },
    });
};

export const useUpdateCelestialObject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, celestialObject }: { id: string; celestialObject: UpdateCelestialObject }) => 
            celestialObjectService.updateCelestialObject(id, celestialObject).then((res) => res.data),
        onSuccess: (_, { id, celestialObject }) => {
            queryClient.invalidateQueries({ queryKey: ['celestialObjects'] });
            queryClient.invalidateQueries({ queryKey: ['celestialObject', id] });
            // Invalidate related category and system queries
            if (celestialObject.categoryId) {
                queryClient.invalidateQueries({ queryKey: ['category', celestialObject.categoryId] });
            }
            if (celestialObject.systemId) {
                queryClient.invalidateQueries({ queryKey: ['system', celestialObject.systemId] });
            }
            console.log('Celestial object updated successfully');
        },
        onError: (error) => {
            console.error('Failed to update celestial object:', error);
        },
    });
};

export const useDeleteCelestialObject = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => celestialObjectService.deleteCelestialObject(id).then((res) => res.data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['celestialObjects'] });
            // Invalidate all categories and systems as we don't know which ones were affected
            queryClient.invalidateQueries({ queryKey: ['categories'] });
            queryClient.invalidateQueries({ queryKey: ['systems'] });
            console.log('Celestial object deleted successfully');
        },
        onError: (error) => {
            console.error('Failed to delete celestial object:', error);
        },
    });
}; 
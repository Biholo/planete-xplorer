import { systemRepository } from '@/repositories';
import { systemTransformer } from '@/transformers';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { jsonResponse, notFoundResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';

import {
    CreateSystem,
    GetAllSystems,
    IdParams,
    SystemDto,
    UpdateSystem,
    idSchema
} from '@shared/dto';

class SystemController {
    private logger = logger.child({
        module: '[App][System]',
    });

    public getAllSystems = asyncHandler<unknown, GetAllSystems, unknown, SystemDto[]>({
        querySchema: GetAllSystems,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<SystemDto[] | void> | void> => {
            const { page = 1, limit = 10, search, sort } = request.query;
            const skip = (Number(page) - 1) * Number(limit);

            const filters = {
                search,
                sort,
            };

            const result = await systemRepository.findAll(filters, skip, Number(limit));

            const systems = result.data.map((system) => systemTransformer.toSystemDto(system));

            return jsonResponse(reply, 'Systems fetched successfully', systems, 200, result.pagination);
        },
    });

    public getSystemById = asyncHandler<unknown, unknown, IdParams, SystemDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<SystemDto | void> | void> => {
            const { id } = request.params;
            const system = await systemRepository.findById(id);

            if (!system) {
                return notFoundResponse(reply, 'System not found');
            }

            const systemDto = systemTransformer.toSystemDto(system);

            return jsonResponse(reply, 'System fetched successfully', systemDto, 200);
        },
    });

    public createSystem = asyncHandler<CreateSystem, unknown, unknown, SystemDto>({
        bodySchema: CreateSystem,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<SystemDto | void> | void> => {
            // Check if system with same name already exists
            const existingSystem = await systemRepository.findByName(request.body.name);
            if (existingSystem) {
                return jsonResponse(reply, 'System with this name already exists', undefined, 409);
            }

            const system = await systemRepository.create(request.body);
            const systemDto = systemTransformer.toSystemDto(system);

            return jsonResponse(reply, 'System created successfully', systemDto, 201);
        },
    });

    public updateSystem = asyncHandler<UpdateSystem, unknown, IdParams, SystemDto>({
        bodySchema: UpdateSystem,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<SystemDto | void> | void> => {
            const { id } = request.params;
            const systemExists = await systemRepository.findById(id);

            if (!systemExists) {
                return notFoundResponse(reply, 'System not found');
            }

            // Check if name is being updated and if it conflicts with existing system
            if (request.body.name && request.body.name !== systemExists.name) {
                const existingSystem = await systemRepository.findByName(request.body.name);
                if (existingSystem) {
                    return jsonResponse(reply, 'System with this name already exists', undefined, 409);
                }
            }

            const system = await systemRepository.update(id, request.body);
            const systemDto = systemTransformer.toSystemDto(system);

            return jsonResponse(reply, 'System updated successfully', systemDto, 200);
        },
    });

    public deleteSystem = asyncHandler<unknown, unknown, IdParams>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<void> | void> => {
            const { id } = request.params;
            const systemExists = await systemRepository.findById(id);

            if (!systemExists) {
                return notFoundResponse(reply, 'System not found');
            }

            await systemRepository.delete(id);

            return jsonResponse(reply, 'System deleted successfully', undefined, 204);
        },
    });
}

export const systemController = new SystemController(); 
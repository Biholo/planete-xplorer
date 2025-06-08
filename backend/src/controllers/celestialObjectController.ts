import { celestialObjectRepository } from '@/repositories';
import { celestialObjectTransformer } from '@/transformers';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { jsonResponse, notFoundResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';

import {
    CelestialObjectDto,
    CreateCelestialObject,
    GetAllCelestialObjects,
    IdParams,
    idSchema,
    UpdateCelestialObject
} from '@shared/dto';

class CelestialObjectController {
    private logger = logger.child({
        module: '[App][CelestialObject]',
    });

    public getAllCelestialObjects = asyncHandler<unknown, GetAllCelestialObjects, unknown, CelestialObjectDto[]>({
        querySchema: GetAllCelestialObjects,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CelestialObjectDto[] | void> | void> => {
            const { page = 1, limit = 10, search, sort, categoryId, systemId, type } = request.query;
            const skip = (Number(page) - 1) * Number(limit);

            const filters = {
                search,
                sort,
                categoryId,
                systemId,
                type,
            };

            const result = await celestialObjectRepository.findAll(filters, skip, Number(limit));

            const celestialObjects = result.data.map((celestialObject) => 
                celestialObjectTransformer.toCelestialObjectDto(celestialObject)
            );

            return jsonResponse(reply, 'Celestial objects fetched successfully', celestialObjects, 200, result.pagination);
        },
    });

    public getCelestialObjectById = asyncHandler<unknown, unknown, IdParams, CelestialObjectDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CelestialObjectDto | void> | void> => {
            const { id } = request.params;
            const celestialObject = await celestialObjectRepository.findById(id);

            if (!celestialObject) {
                return notFoundResponse(reply, 'Celestial object not found');
            }

            const celestialObjectDto = celestialObjectTransformer.toCelestialObjectDto(celestialObject);

            return jsonResponse(reply, 'Celestial object fetched successfully', celestialObjectDto, 200);
        },
    });

    public createCelestialObject = asyncHandler<CreateCelestialObject, unknown, unknown, CelestialObjectDto>({
        bodySchema: CreateCelestialObject,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CelestialObjectDto | void> | void> => {
            // Get creator ID from authenticated user
            const creatorId = request.user?.id;
            if (!creatorId) {
                return jsonResponse(reply, 'User not authenticated', undefined, 401);
            }

            // Check if celestial object with same name already exists
            const existingCelestialObject = await celestialObjectRepository.findByName(request.body.name);
            if (existingCelestialObject) {
                return jsonResponse(reply, 'Celestial object with this name already exists', undefined, 409);
            }

            const celestialObject = await celestialObjectRepository.create(request.body, creatorId);
            const celestialObjectDto = celestialObjectTransformer.toCelestialObjectDto(celestialObject);

            return jsonResponse(reply, 'Celestial object created successfully', celestialObjectDto, 201);
        },
    });

    public updateCelestialObject = asyncHandler<UpdateCelestialObject, unknown, IdParams, CelestialObjectDto>({
        bodySchema: UpdateCelestialObject,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CelestialObjectDto | void> | void> => {
            const { id } = request.params;
            const celestialObjectExists = await celestialObjectRepository.findById(id);

            if (!celestialObjectExists) {
                return notFoundResponse(reply, 'Celestial object not found');
            }

            // Check if name is being updated and if it conflicts with existing celestial object
            if (request.body.name && request.body.name !== celestialObjectExists.name) {
                const existingCelestialObject = await celestialObjectRepository.findByName(request.body.name);
                if (existingCelestialObject) {
                    return jsonResponse(reply, 'Celestial object with this name already exists', undefined, 409);
                }
            }

            const celestialObject = await celestialObjectRepository.update(id, request.body);
            const celestialObjectDto = celestialObjectTransformer.toCelestialObjectDto(celestialObject);

            return jsonResponse(reply, 'Celestial object updated successfully', celestialObjectDto, 200);
        },
    });

    public deleteCelestialObject = asyncHandler<unknown, unknown, IdParams>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<void> | void> => {
            const { id } = request.params;
            const celestialObjectExists = await celestialObjectRepository.findById(id);

            if (!celestialObjectExists) {
                return notFoundResponse(reply, 'Celestial object not found');
            }

            await celestialObjectRepository.delete(id);

            return jsonResponse(reply, 'Celestial object deleted successfully', undefined, 204);
        },
    });
}

export const celestialObjectController = new CelestialObjectController(); 
import { categoryRepository } from '@/repositories';
import { categoryTransformer } from '@/transformers';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { jsonResponse, notFoundResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';

import {
    CategoryDto,
    CreateCategory,
    GetAllCategories,
    IdParams,
    idSchema,
    UpdateCategory
} from '@shared/dto';

class CategoryController {
    private logger = logger.child({
        module: '[App][Category]',
    });

    public getAllCategories = asyncHandler<unknown, GetAllCategories, unknown, CategoryDto[]>({
        querySchema: GetAllCategories,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CategoryDto[] | void> | void> => {
            const { page = 1, limit = 10, search, sort } = request.query;
            const skip = (Number(page) - 1) * Number(limit);

            const filters = {
                search,
                sort,
            };

            const result = await categoryRepository.findAll(filters, skip, Number(limit));

            const categories = result.data.map((category) => categoryTransformer.toCategoryDto(category));



            return jsonResponse(reply, 'Categories fetched successfully', categories, 200, result.pagination);
        },
    });

    public getCategoryById = asyncHandler<unknown, unknown, IdParams, CategoryDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CategoryDto | void> | void> => {
            const { id } = request.params;
            const category = await categoryRepository.findById(id);

            if (!category) {
                return notFoundResponse(reply, 'Category not found');
            }

            const categoryDto = categoryTransformer.toCategoryDto(category);

            return jsonResponse(reply, 'Category fetched successfully', categoryDto, 200);
        },
    });

    public createCategory = asyncHandler<CreateCategory, unknown, unknown, CategoryDto>({
        bodySchema: CreateCategory,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CategoryDto | void> | void> => {
            // Check if category with same name already exists
            const existingCategory = await categoryRepository.findByName(request.body.name);
            if (existingCategory) {
                return jsonResponse(reply, 'Category with this name already exists', undefined, 409);
            }

            const category = await categoryRepository.create(request.body);
            const categoryDto = categoryTransformer.toCategoryDto(category);

            return jsonResponse(reply, 'Category created successfully', categoryDto, 201);
        },
    });

    public updateCategory = asyncHandler<UpdateCategory, unknown, IdParams, CategoryDto>({
        bodySchema: UpdateCategory,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<CategoryDto | void> | void> => {
            const { id } = request.params;
            const categoryExists = await categoryRepository.findById(id);

            if (!categoryExists) {
                return notFoundResponse(reply, 'Category not found');
            }

            // Check if name is being updated and if it conflicts with existing category
            if (request.body.name && request.body.name !== categoryExists.name) {
                const existingCategory = await categoryRepository.findByName(request.body.name);
                if (existingCategory) {
                    return jsonResponse(reply, 'Category with this name already exists', undefined, 409);
                }
            }

            const category = await categoryRepository.update(id, request.body);
            const categoryDto = categoryTransformer.toCategoryDto(category);

            return jsonResponse(reply, 'Category updated successfully', categoryDto, 200);
        },
    });

    public deleteCategory = asyncHandler<unknown, unknown, IdParams>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<void> | void> => {
            const { id } = request.params;
            const categoryExists = await categoryRepository.findById(id);

            if (!categoryExists) {
                return notFoundResponse(reply, 'Category not found');
            }

            await categoryRepository.delete(id);

            return jsonResponse(reply, 'Category deleted successfully', undefined, 204);
        },
    });
}

export const categoryController = new CategoryController(); 
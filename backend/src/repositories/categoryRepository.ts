import { Category, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { FilterService } from '@/services';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';

import { CreateCategoryDto, UpdateCategoryDto } from '@shared/dto';

class CategoryRepository {
    private logger = logger.child({
        class: '[App][CategoryRepository]',
    });

    /**
     * Create a new category
     * @param category - The category to create
     * @returns The created category
     */
    async create(category: CreateCategoryDto): Promise<Category> {
        return prisma.category.create({
            data: category,
        });
    }

    /**
     * Update a category
     * @param id - The id of the category to update
     * @param category - The category to update
     * @returns The updated category
     */
    async update(id: string, category: UpdateCategoryDto): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data: category,
        });
    }

    /**
     * Delete a category
     * @param id - The id of the category to delete
     * @returns The deleted category
     */
    async delete(id: string): Promise<Category> {
        return prisma.category.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /**
     * Find all categories
     * @param filters - The filters to apply
     * @param skip - The number of categories to skip
     * @param take - The number of categories to take
     * @returns The categories
     */
    async findAll(
        filters: any = {},
        skip: number = 0,
        take: number = 10
    ): Promise<{
        data: Category[];
        pagination: PaginationMeta;
    }> {
        const { search, ...otherFilters } = filters;

        const where: Prisma.CategoryWhereInput = {
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const include: Prisma.CategoryInclude = {
            celestialObjects: {
                where: { deletedAt: null },
                select: { id: true, name: true },
            },
        };

        const baseQuery = FilterService.buildQuery(otherFilters);
        Object.assign(where, baseQuery);

        // Apply the sorting
        let orderBy: Prisma.CategoryOrderByWithRelationInput = { createdAt: 'desc' };
        if (filters.sort) {
            const [field, order] = filters.sort.split(':');
            const trimmedField = field.trim();
            const trimmedOrder = (order || 'asc').trim();
            orderBy = { [trimmedField]: trimmedOrder };
        }

        // Execute the queries
        const [data, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
            }),
            prisma.category.count({ where }),
        ]);

        const currentPage = Math.floor(skip / take) + 1;
        const totalPages = Math.ceil(total / take);

        return {
            data: data,
            pagination: {
                currentPage,
                totalPages,
                totalItems: total,
                nextPage: currentPage < totalPages ? currentPage + 1 : 0,
                previousPage: currentPage > 1 ? currentPage - 1 : 0,
                perPage: take,
            },
        };
    }

    /**
     * Find a category by its id
     * @param id - The id of the category to find
     * @returns The category found or null if no category is found
     */
    async findById(id: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { id, deletedAt: null },
            include: {
                celestialObjects: {
                    where: { deletedAt: null },
                    select: { id: true, name: true },
                },
            },
        });
    }

    /**
     * Find a category by its name
     * @param name - The name of the category
     * @returns The category found or null if no category is found
     */
    async findByName(name: string): Promise<Category | null> {
        return prisma.category.findUnique({
            where: { name, deletedAt: null },
        });
    }
}

export const categoryRepository = new CategoryRepository(); 
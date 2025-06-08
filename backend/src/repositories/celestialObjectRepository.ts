import { CelestialObject, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { FilterService } from '@/services';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';

import { CreateCelestialObjectDto, UpdateCelestialObjectDto } from '@shared/dto';

class CelestialObjectRepository {
    private logger = logger.child({
        class: '[App][CelestialObjectRepository]',
    });

    /**
     * Create a new celestial object
     * @param celestialObject - The celestial object to create
     * @param creatorId - The id of the user creating the object
     * @returns The created celestial object
     */
    async create(celestialObject: CreateCelestialObjectDto, creatorId: string): Promise<CelestialObject> {
        return prisma.celestialObject.create({
            data: {
                ...celestialObject,
                creatorId,
            },
        });
    }

    /**
     * Update a celestial object
     * @param id - The id of the celestial object to update
     * @param celestialObject - The celestial object to update
     * @returns The updated celestial object
     */
    async update(id: string, celestialObject: UpdateCelestialObjectDto): Promise<CelestialObject> {
        return prisma.celestialObject.update({
            where: { id },
            data: celestialObject,
        });
    }

    /**
     * Delete a celestial object
     * @param id - The id of the celestial object to delete
     * @returns The deleted celestial object
     */
    async delete(id: string): Promise<CelestialObject> {
        return prisma.celestialObject.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /**
     * Find all celestial objects
     * @param filters - The filters to apply
     * @param skip - The number of celestial objects to skip
     * @param take - The number of celestial objects to take
     * @returns The celestial objects
     */
    async findAll(
        filters: any = {},
        skip: number = 0,
        take: number = 10
    ): Promise<{
        data: CelestialObject[];
        pagination: PaginationMeta;
    }> {
        const { search, categoryId, systemId, type, ...otherFilters } = filters;

        const where: Prisma.CelestialObjectWhereInput = {
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { description: { contains: search } },
                { type: { contains: search } },
                { discoverer: { contains: search } },
            ];
        }

        if (categoryId) {
            where.categoryId = categoryId;
        }

        if (systemId) {
            where.systemId = systemId;
        }

        if (type) {
            where.type = { contains: type };
        }

        const include: Prisma.CelestialObjectInclude = {
            category: {
                select: { id: true, name: true, color: true, icon: true },
            },
            system: {
                select: { id: true, name: true, mainStar: true },
            },
            creator: {
                select: { id: true, firstName: true, lastName: true, email: true },
            },
        };

        const baseQuery = FilterService.buildQuery(otherFilters);
        Object.assign(where, baseQuery);

        // Apply the sorting
        let orderBy: Prisma.CelestialObjectOrderByWithRelationInput = { createdAt: 'desc' };
        if (filters.sort) {
            const [field, order] = filters.sort.split(':');
            const trimmedField = field.trim();
            const trimmedOrder = (order || 'asc').trim();
            orderBy = { [trimmedField]: trimmedOrder };
        }

        // Execute the queries
        const [data, total] = await Promise.all([
            prisma.celestialObject.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
            }),
            prisma.celestialObject.count({ where }),
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
     * Find a celestial object by its id
     * @param id - The id of the celestial object to find
     * @returns The celestial object found or null if no celestial object is found
     */
    async findById(id: string): Promise<CelestialObject | null> {
        return prisma.celestialObject.findUnique({
            where: { id, deletedAt: null },
            include: {
                category: {
                    select: { id: true, name: true, color: true, icon: true },
                },
                system: {
                    select: { id: true, name: true, mainStar: true, distanceFromEarth: true },
                },
                creator: {
                    select: { id: true, firstName: true, lastName: true, email: true },
                },
            },
        });
    }

    /**
     * Find a celestial object by its name
     * @param name - The name of the celestial object
     * @returns The celestial object found or null if no celestial object is found
     */
    async findByName(name: string): Promise<CelestialObject | null> {
        return prisma.celestialObject.findUnique({
            where: { name, deletedAt: null },
        });
    }

    /**
     * Find celestial objects by category
     * @param categoryId - The id of the category
     * @returns The celestial objects found
     */
    async findByCategory(categoryId: string): Promise<CelestialObject[]> {
        return prisma.celestialObject.findMany({
            where: { categoryId, deletedAt: null },
            include: {
                system: {
                    select: { id: true, name: true, mainStar: true },
                },
            },
        });
    }

    /**
     * Find celestial objects by system
     * @param systemId - The id of the system
     * @returns The celestial objects found
     */
    async findBySystem(systemId: string): Promise<CelestialObject[]> {
        return prisma.celestialObject.findMany({
            where: { systemId, deletedAt: null },
            include: {
                category: {
                    select: { id: true, name: true, color: true, icon: true },
                },
            },
        });
    }
}

export const celestialObjectRepository = new CelestialObjectRepository(); 
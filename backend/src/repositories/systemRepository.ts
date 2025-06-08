import { Prisma, System } from '@/config/client';
import prisma from '@/config/prisma';
import { FilterService } from '@/services';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';

import { CreateSystemDto, UpdateSystemDto } from '@shared/dto';

class SystemRepository {
    private logger = logger.child({
        class: '[App][SystemRepository]',
    });

    /**
     * Create a new system
     * @param system - The system to create
     * @returns The created system
     */
    async create(system: CreateSystemDto): Promise<System> {
        return prisma.system.create({
            data: system,
        });
    }

    /**
     * Update a system
     * @param id - The id of the system to update
     * @param system - The system to update
     * @returns The updated system
     */
    async update(id: string, system: UpdateSystemDto): Promise<System> {
        return prisma.system.update({
            where: { id },
            data: system,
        });
    }

    /**
     * Delete a system
     * @param id - The id of the system to delete
     * @returns The deleted system
     */
    async delete(id: string): Promise<System> {
        return prisma.system.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }

    /**
     * Find all systems
     * @param filters - The filters to apply
     * @param skip - The number of systems to skip
     * @param take - The number of systems to take
     * @returns The systems
     */
    async findAll(
        filters: any = {},
        skip: number = 0,
        take: number = 10
    ): Promise<{
        data: System[];
        pagination: PaginationMeta;
    }> {
        const { search, ...otherFilters } = filters;

        const where: Prisma.SystemWhereInput = {
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { mainStar: { contains: search } },
                { description: { contains: search } },
            ];
        }

        const include: Prisma.SystemInclude = {
            celestialObjects: {
                where: { deletedAt: null },
                select: { id: true, name: true, type: true },
            },
        };

        const baseQuery = FilterService.buildQuery(otherFilters);
        Object.assign(where, baseQuery);

        // Apply the sorting
        let orderBy: Prisma.SystemOrderByWithRelationInput = { createdAt: 'desc' };
        if (filters.sort) {
            const [field, order] = filters.sort.split(':');
            const trimmedField = field.trim();
            const trimmedOrder = (order || 'asc').trim();
            orderBy = { [trimmedField]: trimmedOrder };
        }

        // Execute the queries
        const [data, total] = await Promise.all([
            prisma.system.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
            }),
            prisma.system.count({ where }),
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
     * Find a system by its id
     * @param id - The id of the system to find
     * @returns The system found or null if no system is found
     */
    async findById(id: string): Promise<System | null> {
        return prisma.system.findUnique({
            where: { id, deletedAt: null },
            include: {
                celestialObjects: {
                    where: { deletedAt: null },
                    select: { id: true, name: true, type: true },
                },
            },
        });
    }

    /**
     * Find a system by its name
     * @param name - The name of the system
     * @returns The system found or null if no system is found
     */
    async findByName(name: string): Promise<System | null> {
        return prisma.system.findUnique({
            where: { name, deletedAt: null },
        });
    }
}

export const systemRepository = new SystemRepository(); 
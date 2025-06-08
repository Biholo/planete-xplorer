import { Prisma, User } from '@/config/client';
import prisma from '@/config/prisma';
import { FilterService } from '@/services';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';

import { RegisterDto, UpdateUserDto, UserRole } from '@shared/dto';

class UserRepository {
    private logger = logger.child({
        class: '[App][UserRepository]',
    });

    /**
     * Create a new user
     * @param user - The user to create
     * @returns The created user
     */
    async create(user: RegisterDto): Promise<User> {
        const { confirmPassword, acceptPrivacy, acceptTerms, ...userData } = user;
        return prisma.user.create({
            data: {
                ...userData,
                roles: [UserRole.USER],
                acceptNewsletter: true,
            },
        });
    }

    /**
     * Update a user
     * @param id - The id of the user to update
     * @param user - The user to update
     * @returns The updated user
     */
    async update(id: string, user: UpdateUserDto): Promise<User> {
        return prisma.user.update({
            where: { id },
            data: user,
        });
    }

    /**
     * Delete a user
     * @param id - The id of the user to delete
     * @returns The deleted user
     */
    async delete(id: string): Promise<User> {
        return prisma.user.delete({
            where: { id },
        });
    }

    /**
     * Find all users
     * @param filters - The filters to apply
     * @param skip - The number of users to skip
     * @param take - The number of users to take
     * @returns The users
     */
    async findAll(
        filters: any = {},
        skip: number = 0,
        take: number = 10
    ): Promise<{
        data: User[];
        pagination: PaginationMeta;
    }> {
        const { search, ...otherFilters } = filters;

        const where: Prisma.UserWhereInput = {
            deletedAt: null,
        };

        if (search) {
            where.OR = [
                { firstName: { contains: search } },
                { lastName: { contains: search } },
                { email: { contains: search } },
            ];
        }

        const include: Prisma.UserInclude = {
            posts: true,
        };

        const baseQuery = FilterService.buildQuery(otherFilters);
        Object.assign(where, baseQuery);

        // Apply the sorting
        let orderBy: Prisma.UserOrderByWithRelationInput = { createdAt: 'desc' };
        if (filters.sort) {
            const [field, order] = filters.sort.split(':');
            const trimmedField = field.trim();
            const trimmedOrder = (order || 'asc').trim();
            orderBy = { [trimmedField]: trimmedOrder };
        }

        // Execute the queries
        const [data, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take,
                orderBy,
                include,
            }),
            prisma.user.count({ where }),
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
     * Find a user by its email
     * @param email - The email of the user
     * @returns The user found or null if no user is found
     */
    async findByEmail(email: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: {
                email,
            },
        });
    }

    /**
     * Find a user by its id
     * @param id - The id of the user to find
     * @returns The user found or null if no user is found
     */
    async findById(id: string): Promise<User | null> {
        return prisma.user.findUnique({
            where: { id },
        });
    }
}

export const userRepository = new UserRepository();

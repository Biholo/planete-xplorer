import { Post, Prisma } from '@/config/client';
import prisma from '@/config/prisma';
import { FilterService } from '@/services';
import { PaginationMeta } from '@/types';
import { logger } from '@/utils/logger';

import { CreatePostDto, UpdatePostDto } from '@shared/dto';

class PostRepository {
    private logger = logger.child({
        class: '[App][PostRepository]',
    });

    /**
     * Create a new post
     * @param post - The post to create
     * @returns The created post
     */
    async create(post: CreatePostDto): Promise<Post> {
        const { authorId, ...postData } = post;
        return prisma.post.create({
            data: {
                ...postData,
                author: {
                    connect: {
                        id: authorId,
                    },
                },
            },
        });
    }

    /**
     * Update a post
     * @param id - The id of the post to update
     * @param post - The post to update
     * @returns The updated post
     */
    async update(id: string, post: UpdatePostDto): Promise<Post> {
        return prisma.post.update({
            where: { id },
            data: post,
        });
    }

    /**
     * Delete a post
     * @param id - The id of the post to delete
     * @returns The deleted post
     */
    async delete(id: string): Promise<Post> {
        return prisma.post.delete({
            where: { id },
        });
    }

    /**
     * Find all posts
     * @param filters - The filters to apply
     * @param skip - The number of posts to skip
     * @param take - The number of posts to take
     * @returns The posts
     */
    async findAll(
        filters: any = {},
        skip: number = 0,
        take: number = 10
    ): Promise<{
        data: Post[];
        pagination: PaginationMeta;
    }> {
        const { search, includeAuthor, ...otherFilters } = filters;

        const where: Prisma.PostWhereInput = {
            deletedAt: null,
        };

        if (search) {
            where.title = { contains: search };
            where.content = { contains: search };
        }

        const include: Prisma.PostInclude = {};

        if (includeAuthor) {
            include.author = true;
        }

        const baseQuery = FilterService.buildQuery(otherFilters);
        Object.assign(where, baseQuery);

        // Apply the sorting
        let orderBy: Prisma.PostOrderByWithRelationInput = { createdAt: 'desc' };
        if (filters.sort) {
            const [field, order] = filters.sort.split(':');
            const trimmedField = field.trim();
            const trimmedOrder = (order || 'asc').trim();

            if (trimmedField === 'author') {
                orderBy = {
                    author: {
                        firstName: trimmedOrder,
                    },
                };
            } else if (trimmedField === 'total') {
            } else {
                orderBy = { [trimmedField]: trimmedOrder };
            }
        }

        // Execute the queries
        const [data, total] = await Promise.all([
            prisma.post.findMany({
                where,
                skip,
                take,
                orderBy,
                include: Object.keys(include).length > 0 ? include : undefined,
            }),
            prisma.post.count({ where }),
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
     * Find a post by its id
     * @param id - The id of the post to find
     * @returns The post found or null if no post is found
     */
    async findPostById(id: string): Promise<Post | null> {
        return prisma.post.findUnique({
            where: { id },
        });
    }
}

export const postRepository = new PostRepository();

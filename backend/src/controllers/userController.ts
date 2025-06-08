import { userRepository } from '@/repositories';
import { userTransformer } from '@/transformers';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import { jsonResponse, notFoundResponse } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';

import { GetAllUsers, IdParams, UpdateUser, UserDto, idSchema } from '@shared/dto';

class UserController {
    private logger = logger.child({
        module: '[App][Auth]',
    });

    public getAllUsers = asyncHandler<unknown, GetAllUsers, unknown, UserDto[]>({
        querySchema: GetAllUsers,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<UserDto[] | void> | void> => {
            const { page = 1, limit = 10, search } = request.query;
            const skip = (Number(page) - 1) * Number(limit);

            const filters = {
                search,
            };

            const result = await userRepository.findAll(filters, skip, Number(limit));

            const users = result.data.map((user) => userTransformer.toUserDto(user));

            return jsonResponse(reply, 'Users fetched successfully', users, 200, result.pagination);
        },
    });

    public getUserById = asyncHandler<unknown, unknown, IdParams, UserDto>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<UserDto | void> | void> => {
            const { id } = request.params;
            const user = await userRepository.findById(id);

            if (!user) {
                return notFoundResponse(reply, 'User not found');
            }

            const userDto = userTransformer.toUserDto(user);

            return jsonResponse(reply, 'User fetched successfully', userDto, 200);
        },
    });

    public updateUser = asyncHandler<UpdateUser, unknown, IdParams>({
        bodySchema: UpdateUser,
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<UserDto | void> | void> => {
            const { id } = request.params;
            const userExists = await userRepository.findById(id);

            if (!userExists) {
                return notFoundResponse(reply, 'User not found');
            }

            const user = await userRepository.update(id, request.body);

            const userDto = userTransformer.toUserDto(user);

            return jsonResponse(reply, 'User updated successfully', userDto, 200);
        },
    });

    public deleteUser = asyncHandler<unknown, unknown, IdParams>({
        paramsSchema: idSchema,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<void> | void> => {
            const { id } = request.params;
            const userExists = await userRepository.findById(id);

            if (!userExists) {
                return notFoundResponse(reply, 'User not found');
            }

            await userRepository.delete(id);

            return jsonResponse(reply, 'User deleted successfully', undefined, 204);
        },
    });
}

export const userController = new UserController();

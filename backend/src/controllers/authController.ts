import { userRepository } from '@/repositories';
import { authService, tokenService, userService } from '@/services';
import { userTransformer } from '@/transformers';
import { ApiResponse } from '@/types';
import { asyncHandler } from '@/utils/asyncHandler';
import {
    badRequestResponse,
    internalServerError,
    jsonResponse,
    unauthorizedResponse,
} from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';

import {
    AuthResponse,
    Login,
    Register,
    RequestPasswordReset,
    ResetPassword,
    TokenDto,
    User,
} from '@shared/dto';
import bcrypt from 'bcryptjs';

class AuthController {
    private logger = logger.child({
        module: '[App][Auth]',
    });

    public createUser = asyncHandler<Register>({
        bodySchema: Register,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<AuthResponse | void> | void> => {
            const existingUser = await userRepository.findByEmail(request.body.email);

            if (existingUser) {
                return badRequestResponse(reply, 'User already exists');
            }

            const hashedPassword = await bcrypt.hash(request.body.password, 10);

            const createdUser = await userRepository.create({
                ...request.body,
                password: hashedPassword,
                acceptNewsletter: request.body.acceptNewsletter ?? false,
            });

            const userDto = userTransformer.toUserDto(createdUser);

            const tokens = await authService.generateToken(userDto, request);

            if (!tokens) {
                return internalServerError(reply, 'Error generating tokens');
            }

            return jsonResponse(reply, 'User created successfully', tokens, 201);
        },
    });

    public login = asyncHandler<Login>({
        bodySchema: Login,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<AuthResponse | void> | void> => {
            const user = await userRepository.findByEmail(request.body.email);

            if (!user) {
                return unauthorizedResponse(reply, 'Invalid credentials');
            }

            const isPasswordValid = await bcrypt.compare(request.body.password, user.password);

            if (!isPasswordValid) {
                return unauthorizedResponse(reply, 'Invalid credentials');
            }

            const userDto = userTransformer.toUserDto(user);

            const tokens = await authService.generateToken(userDto, request);

            if (!tokens) {
                return internalServerError(reply, 'Error generating tokens');
            }

            return jsonResponse(reply, 'Login successful', tokens, 200);
        },
    });

    public requestPasswordReset = asyncHandler<RequestPasswordReset>({
        bodySchema: RequestPasswordReset,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<TokenDto | void> | void> => {
            const user = await userRepository.findByEmail(request.body.email);

            if (!user || !user.id) {
                return unauthorizedResponse(reply, 'Invalid credentials');
            }

            const token = await tokenService.generatePasswordResetToken(user.id, request.ip);

            if (!token) {
                return internalServerError(reply, 'Error generating token');
            }

            return jsonResponse(reply, 'Password reset requested', { token }, 200);
        },
    });

    public resetPassword = asyncHandler<ResetPassword>({
        bodySchema: ResetPassword,
        logger: this.logger,
        handler: async (request, reply): Promise<ApiResponse<void> | void> => {
            const { token, password } = request.body;

            const resetToken = await tokenService.findByToken(token);

            if (
                !resetToken ||
                resetToken.type !== 'reset_password' ||
                new Date() > resetToken.expiresAt
            ) {
                return badRequestResponse(reply, 'Invalid or expired token');
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            await userService.updatePassword(resetToken.ownedById, hashedPassword);

            await tokenService.deleteToken(resetToken.id);

            return jsonResponse(reply, 'Password reset successfully', undefined, 200);
        },
    });

    public getCurrentUser = asyncHandler<unknown, unknown, unknown, User>({
        logger: this.logger,
        handler: async (request, reply) => {
            if (!request.user?.id) {
                return jsonResponse(reply, 'Utilisateur non authentifié', null, 401);
            }

            const user = await userRepository.findById(request.user.id);
            if (!user) {
                return jsonResponse(reply, 'Utilisateur non trouvé', null, 404);
            }

            const userDto = userTransformer.toUserDto(user);

            return jsonResponse(reply, 'Utilisateur récupéré avec succès', userDto, 200);
        },
    });
}

export const authController = new AuthController();

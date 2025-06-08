import prisma from '@/config/prisma';
import { userTransformer } from '@/transformers/userTransformer';
import { notFoundResponse, unauthorizedResponse } from '@/utils/jsonResponse';

import { User } from '@shared/dto';
import { FastifyReply, FastifyRequest } from 'fastify';
import { sign, verify } from 'jsonwebtoken';

class AuthService {
    constructor() {}

    /**
     * Generate a token for a user
     * @param user - The user to generate the token
     * @param request - The Fastify request
     * @returns The generated token
     */
    async generateToken(
        user: User,
        request: FastifyRequest
    ): Promise<{ accessToken: string; refreshToken: string } | null> {
        const agent = request.headers['user-agent'];
        const ip = request.ip;

        if (!user.id) {
            return null;
        }

        const accessToken = await prisma.token.create({
            data: {
                token: sign(user, process.env.JWT_SECRET as string, {
                    expiresIn: '24h',
                }),
                type: 'access_token',
                scopes: JSON.stringify(['read', 'write']),
                deviceName: agent ? agent.split(' ')[0] : 'Unknown',
                deviceIp: ip,
                ownedById: user.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        const refreshToken = await prisma.token.create({
            data: {
                token: sign(user, process.env.JWT_SECRET as string, {
                    expiresIn: '7d',
                }),
                type: 'refresh_token',
                scopes: JSON.stringify(['read', 'write']),
                deviceName: agent ? agent.split(' ')[0] : 'Unknown',
                deviceIp: ip,
                ownedById: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
        });

        return { accessToken: accessToken.token, refreshToken: refreshToken.token };
    }

    /**
     * Generate an access token for a user
     * @param user - The user to generate the access token
     * @param request - The Fastify request
     * @returns The generated access token
     */
    async generateAccessToken(user: User, request: FastifyRequest): Promise<string | null> {
        const agent = request.headers['user-agent'];
        const ip = request.ip;

        if (!user.id) {
            return null;
        }

        const accessToken = await prisma.token.create({
            data: {
                token: sign(user, process.env.JWT_SECRET as string, {
                    expiresIn: '24h',
                }),
                type: 'access_token',
                scopes: JSON.stringify(['read', 'write']),
                deviceName: agent ? agent.split(' ')[0] : 'Unknown',
                deviceIp: ip,
                ownedById: user.id,
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
            },
        });

        return accessToken.token;
    }

    /**
     * Verify a token
     * @param request - The Fastify request
     * @param reply - The Fastify reply
     * @returns The decoded token or null if the token is invalid
     */
    async verifyToken(request: FastifyRequest, reply: FastifyReply): Promise<User | null> {
        try {
            const authorization = request.headers.authorization;
            const token = authorization?.split(' ')[1];
            if (!token) {
                unauthorizedResponse(reply, 'Invalid token');
                return null;
            }
            const decoded = verify(token, process.env.JWT_SECRET as string) as User;
            return decoded;
        } catch (error) {
            unauthorizedResponse(reply, 'Invalid token');
            return null;
        }
    }

    /**
     * Refresh a token
     * @param request - The Fastify request
     * @param reply - The Fastify reply
     * @returns The decoded token or null if the token is invalid
     */
    async refreshToken(request: FastifyRequest, reply: FastifyReply): Promise<string | null> {
        const body = request.body as { refreshToken: string };
        const refreshToken = body.refreshToken;
        try {
            const decoded = verify(refreshToken, process.env.JWT_SECRET as string) as User;

            const user = await prisma.user.findUnique({
                where: { id: decoded.id },
            });

            if (!user) {
                notFoundResponse(reply, 'User not found');
                return null;
            }

            let userDto = await userTransformer.toUserDto(user);

            return this.generateAccessToken(userDto, request);
        } catch (error) {
            unauthorizedResponse(reply, 'Invalid token');
            return null;
        }
    }
}

export const authService = new AuthService();

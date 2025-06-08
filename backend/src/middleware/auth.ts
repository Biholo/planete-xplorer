import { jsonResponse } from '@/utils/jsonResponse';
import { User } from '@shared/dto';

import dotenv from 'dotenv';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';
import jwt from 'jsonwebtoken';

dotenv.config();

/**
 * Middleware pour vérifier si l'utilisateur est authentifié
 * @param req - Requête Fastify
 * @param res - Réponse Fastify
 * @param done - Fonction de fin
 * @returns void
 */
export const isAuthenticated = (
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction
): void => {
    console.log('🔐 isAuthenticated - Start');
    console.log('🔐 Headers:', req.headers.authorization ? 'Token present' : 'No token');
    
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        jsonResponse(res, 'Non autorisé', {}, 401);
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;

        req.user = decoded;
        done();
    } catch (error) {
        console.log('❌ Token verification failed:', error);
        jsonResponse(res, 'Non autorisé', {}, 401);
    }
};

/**
 * Middleware pour associer un utilisateur à la requête s'il est authentifié,
 * sans bloquer la requête s'il ne l'est pas
 * @param req - Requête Fastify
 * @param res - Réponse Fastify
 * @param done - Fonction de fin
 * @returns void
 */
export const optionalAuth = (
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction
): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        // On continue sans problème
        done();
        return;
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as User;
        req.user = decoded;
    } catch (error) {
        // On ignore l'erreur de token
    }
    
    done();
};

/**
 * Middleware pour vérifier si le token existe
 * @param req - Requête Fastify
 * @param res - Réponse Fastify
 * @param done - Fonction de fin
 * @returns void
 */
export const hasToken = (
    req: FastifyRequest,
    res: FastifyReply,
    done: HookHandlerDoneFunction
): void => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        jsonResponse(res, 'Non autorisé', {}, 401);
        return;
    } else {
        done();
    }
};

declare module 'fastify' {
    interface FastifyRequest {
        user: User;
    }
}

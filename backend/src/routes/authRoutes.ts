import { authController } from '@/controllers/authController';
import { isAuthenticated } from '@/middleware/auth';
import { authService } from '@/services';
import { createSwaggerSchema } from '@/utils/swaggerUtils';

import { Login, Register, RequestPasswordReset, ResetPassword, Token } from '@shared/dto';
import { FastifyInstance } from 'fastify';

export async function authRoutes(fastify: FastifyInstance) {
    // Créer un nouvel utilisateur
    fastify.post('/register', {
        schema: createSwaggerSchema(
            'Crée un nouvel utilisateur.',
            [
                { message: 'Utilisateur créé avec succès', data: {}, status: 200 },
                { message: 'Utilisateur déjà existant', data: {}, status: 400 },
                { message: "Erreur lors de la création de l'utilisateur", data: {}, status: 500 },
            ],
            Register,
            false,
            null,
            ['Auth']
        ),
        handler: authController.createUser,
    });

    // Récupérer l'utilisateur via le token
    fastify.get('/me', {
        schema: createSwaggerSchema(
            "Récupère l'utilisateur via le token.",
            [
                { message: 'Utilisateur récupéré avec succès', data: {}, status: 200 },
                { message: 'Token invalide', data: {}, status: 401 },
            ],
            null,
            true,
            null,
            ['Auth']
        ),
        preHandler: [isAuthenticated],
        handler: authController.getCurrentUser,
    });

    // Refresh l'access token de l'utilisateur
    fastify.post('/refresh_token', {
        schema: createSwaggerSchema(
            "Refresh l'access token de l'utilisateur.",
            [
                { message: 'Token rafraîchi avec succès', data: [], status: 200 },
                { message: 'Token invalide', data: [], status: 401 },
            ],
            Token,
            false,
            null,
            ['Auth']
        ),
        handler: authService.refreshToken,
    });
    // Login
    fastify.post('/login', {
        schema: createSwaggerSchema(
            "Connexion à l'application.",
            [
                {
                    message: 'Connexion réussie',
                    data: {},
                    status: 200,
                },
                { message: 'Identifiants invalides', data: {}, status: 401 },
                { message: 'Erreur lors de la connexion', data: {}, status: 500 },
            ],
            Login,
            false,
            null,
            ['Auth']
        ),
        handler: authController.login,
    });

    // Route pour demander une réinitialisation de mot de passe
    fastify.post('/forgot-password', {
        schema: createSwaggerSchema(
            'Demande une réinitialisation de mot de passe.',
            [
                { message: 'Réinitialisation de mot de passe demandée', data: {}, status: 200 },
                { message: 'Erreur de validation', data: {}, status: 400 },
                {
                    message: 'Erreur lors de la demande de réinitialisation de mot de passe',
                    data: {},
                    status: 500,
                },
            ],
            RequestPasswordReset,
            false,
            null,
            ['Auth']
        ),
        handler: authController.requestPasswordReset,
    });

    // Route pour réinitialiser le mot de passe
    fastify.post('/reset-password', {
        schema: createSwaggerSchema(
            'Réinitialise le mot de passe.',
            [
                { message: 'Mot de passe réinitialisé avec succès', data: {}, status: 200 },
                { message: 'Erreur de validation', data: {}, status: 400 },
                {
                    message: 'Erreur lors de la réinitialisation du mot de passe',
                    data: {},
                    status: 500,
                },
            ],
            ResetPassword.innerType(),
            false,
            null,
            ['Auth']
        ),
        handler: authController.resetPassword,
    });
}

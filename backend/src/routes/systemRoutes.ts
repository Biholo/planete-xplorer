import { systemController } from '@/controllers/systemController';
import { verifyAccess } from '@/middleware';
import { isAuthenticated } from '@/middleware/auth';
import { createSwaggerSchema } from '@/utils/swaggerUtils';

import { CreateSystem, GetAllSystems, UpdateSystem, UserRole } from '@shared/dto';
import { FastifyInstance } from 'fastify';

export async function systemRoutes(fastify: FastifyInstance) {
    // Récupérer tous les systèmes
    fastify.get('/', {
        schema: createSwaggerSchema(
            'Récupère tous les systèmes.',
            [
                { message: 'Systèmes récupérés avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                {
                    message: 'Erreur lors de la récupération des systèmes',
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            GetAllSystems,
            ['Systems']
        ),
        preHandler: [isAuthenticated],
        handler: systemController.getAllSystems,
    });

    // Récupérer un système par ID
    fastify.get('/:id', {
        schema: createSwaggerSchema(
            'Récupère un système par ID.',
            [
                { message: 'Système récupéré avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Système non trouvé', data: [], status: 404 },
                {
                    message: "Erreur lors de la récupération du système",
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            null,
            ['Systems']
        ),
        preHandler: [isAuthenticated],
        handler: systemController.getSystemById,
    });

    // Créer un nouveau système
    fastify.post('/', {
        schema: createSwaggerSchema(
            'Crée un nouveau système.',
            [
                { message: 'Système créé avec succès', data: [], status: 201 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Système avec ce nom existe déjà', data: [], status: 409 },
                {
                    message: "Erreur lors de la création du système",
                    data: [],
                    status: 500,
                },
            ],
            CreateSystem,
            true,
            null,
            ['Systems']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: systemController.createSystem,
    });

    // Mettre à jour un système
    fastify.patch('/:id', {
        schema: createSwaggerSchema(
            'Met à jour un système.',
            [
                { message: 'Système mis à jour avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Système non trouvé', data: [], status: 404 },
                { message: 'Système avec ce nom existe déjà', data: [], status: 409 },
                {
                    message: "Erreur lors de la mise à jour du système",
                    data: [],
                    status: 500,
                },
            ],
            UpdateSystem,
            true,
            null,
            ['Systems']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: systemController.updateSystem,
    });

    // Supprimer un système
    fastify.delete('/:id', {
        schema: createSwaggerSchema(
            'Supprime un système.',
            [
                { message: 'Système supprimé avec succès', data: [], status: 204 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Système non trouvé', data: [], status: 404 },
                {
                    message: "Erreur lors de la suppression du système",
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            null,
            ['Systems']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: systemController.deleteSystem,
    });
} 
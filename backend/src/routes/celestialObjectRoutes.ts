import { celestialObjectController } from '@/controllers/celestialObjectController';
import { verifyAccess } from '@/middleware';
import { isAuthenticated } from '@/middleware/auth';
import { createSwaggerSchema } from '@/utils/swaggerUtils';

import { CreateCelestialObject, GetAllCelestialObjects, UpdateCelestialObject, UserRole } from '@shared/dto';
import { FastifyInstance } from 'fastify';

export async function celestialObjectRoutes(fastify: FastifyInstance) {
    // Récupérer tous les objets célestes
    fastify.get('/', {
        schema: createSwaggerSchema(
            'Récupère tous les objets célestes.',
            [
                { message: 'Objets célestes récupérés avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                {
                    message: 'Erreur lors de la récupération des objets célestes',
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            GetAllCelestialObjects,
            ['CelestialObjects']
        ),
        preHandler: [isAuthenticated],
        handler: celestialObjectController.getAllCelestialObjects,
    });

    // Récupérer un objet céleste par ID
    fastify.get('/:id', {
        schema: createSwaggerSchema(
            'Récupère un objet céleste par ID.',
            [
                { message: 'Objet céleste récupéré avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Objet céleste non trouvé', data: [], status: 404 },
                {
                    message: "Erreur lors de la récupération de l'objet céleste",
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            null,
            ['CelestialObjects']
        ),
        preHandler: [isAuthenticated],
        handler: celestialObjectController.getCelestialObjectById,
    });

    // Créer un nouvel objet céleste
    fastify.post('/', {
        schema: createSwaggerSchema(
            'Crée un nouvel objet céleste.',
            [
                { message: 'Objet céleste créé avec succès', data: [], status: 201 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Objet céleste avec ce nom existe déjà', data: [], status: 409 },
                {
                    message: "Erreur lors de la création de l'objet céleste",
                    data: [],
                    status: 500,
                },
            ],
            CreateCelestialObject,
            true,
            null,
            ['CelestialObjects']
        ),
        preHandler: [isAuthenticated],
        handler: celestialObjectController.createCelestialObject,
    });

    // Mettre à jour un objet céleste
    fastify.patch('/:id', {
        schema: createSwaggerSchema(
            'Met à jour un objet céleste.',
            [
                { message: 'Objet céleste mis à jour avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Objet céleste non trouvé', data: [], status: 404 },
                { message: 'Objet céleste avec ce nom existe déjà', data: [], status: 409 },
                {
                    message: "Erreur lors de la mise à jour de l'objet céleste",
                    data: [],
                    status: 500,
                },
            ],
            UpdateCelestialObject,
            true,
            null,
            ['CelestialObjects']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: celestialObjectController.updateCelestialObject,
    });

    // Supprimer un objet céleste
    fastify.delete('/:id', {
        schema: createSwaggerSchema(
            'Supprime un objet céleste.',
            [
                { message: 'Objet céleste supprimé avec succès', data: [], status: 204 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Objet céleste non trouvé', data: [], status: 404 },
                {
                    message: "Erreur lors de la suppression de l'objet céleste",
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            null,
            ['CelestialObjects']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: celestialObjectController.deleteCelestialObject,
    });
} 
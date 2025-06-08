import { categoryController } from '@/controllers/categoryController';
import { verifyAccess } from '@/middleware';
import { isAuthenticated } from '@/middleware/auth';
import { createSwaggerSchema } from '@/utils/swaggerUtils';

import { CreateCategory, GetAllCategories, UpdateCategory, UserRole } from '@shared/dto';
import { FastifyInstance } from 'fastify';

export async function categoryRoutes(fastify: FastifyInstance) {
    // Récupérer toutes les catégories
    fastify.get('/', {
        schema: createSwaggerSchema(
            'Récupère toutes les catégories.',
            [
                { message: 'Catégories récupérées avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                {
                    message: 'Erreur lors de la récupération des catégories',
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            GetAllCategories,
            ['Categories']
        ),
        preHandler: [isAuthenticated],
        handler: categoryController.getAllCategories,
    });

    // Récupérer une catégorie par ID
    fastify.get('/:id', {
        schema: createSwaggerSchema(
            'Récupère une catégorie par ID.',
            [
                { message: 'Catégorie récupérée avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Catégorie non trouvée', data: [], status: 404 },
                {
                    message: "Erreur lors de la récupération de la catégorie",
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            null,
            ['Categories']
        ),
        preHandler: [isAuthenticated],
        handler: categoryController.getCategoryById,
    });

    // Créer une nouvelle catégorie
    fastify.post('/', {
        schema: createSwaggerSchema(
            'Crée une nouvelle catégorie.',
            [
                { message: 'Catégorie créée avec succès', data: [], status: 201 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Catégorie avec ce nom existe déjà', data: [], status: 409 },
                {
                    message: "Erreur lors de la création de la catégorie",
                    data: [],
                    status: 500,
                },
            ],
            CreateCategory,
            true,
            null,
            ['Categories']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: categoryController.createCategory,
    });

    // Mettre à jour une catégorie
    fastify.patch('/:id', {
        schema: createSwaggerSchema(
            'Met à jour une catégorie.',
            [
                { message: 'Catégorie mise à jour avec succès', data: [], status: 200 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Catégorie non trouvée', data: [], status: 404 },
                { message: 'Catégorie avec ce nom existe déjà', data: [], status: 409 },
                {
                    message: "Erreur lors de la mise à jour de la catégorie",
                    data: [],
                    status: 500,
                },
            ],
            UpdateCategory,
            true,
            null,
            ['Categories']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: categoryController.updateCategory,
    });

    // Supprimer une catégorie
    fastify.delete('/:id', {
        schema: createSwaggerSchema(
            'Supprime une catégorie.',
            [
                { message: 'Catégorie supprimée avec succès', data: [], status: 204 },
                { message: 'Non autorisé', data: [], status: 401 },
                { message: 'Catégorie non trouvée', data: [], status: 404 },
                {
                    message: "Erreur lors de la suppression de la catégorie",
                    data: [],
                    status: 500,
                },
            ],
            null,
            true,
            null,
            ['Categories']
        ),
        preHandler: [isAuthenticated, verifyAccess(UserRole.ADMIN)],
        handler: categoryController.deleteCategory,
    });
} 
import bcrypt from 'bcryptjs';

import { PrismaClient } from '../src/config/client';
import {
    categories,
    celestialObjects,
    fakerCategory,
    fakerCelestialObject,
    fakerSystem,
    fakerUser,
    systems,
    users
} from '../src/fixtures';

const prisma = new PrismaClient();

async function cleanDatabase() {
    // Nettoyer dans l'ordre inverse des dépendances
    await prisma.celestialObject.deleteMany();
    await prisma.system.deleteMany();
    await prisma.category.deleteMany();
    await prisma.token.deleteMany();
    await prisma.user.deleteMany();
}

async function main() {
    await cleanDatabase();

    // 1. Créer les utilisateurs
    console.log('Creating users...');
    for (const user of users) {
        await prisma.user.create({
            data: {
                ...user,
                password: await bcrypt.hash(user.password, 10),
            },
        });
    }

    // Créer des utilisateurs supplémentaires avec faker
    for (let i = 0; i < 10; i++) {
        const userData = fakerUser();
        await prisma.user.create({
            data: {
                ...userData,
                password: await bcrypt.hash(userData.password, 10),
            },
        });
    }

    // 2. Créer les catégories
    console.log('Creating categories...');
    for (const category of categories) {
        await prisma.category.create({
            data: category,
        });
    }

    // Créer des catégories supplémentaires avec faker
    for (let i = 0; i < 5; i++) {
        await prisma.category.create({
            data: fakerCategory(),
        });
    }

    // 3. Créer les systèmes
    console.log('Creating systems...');
    for (const system of systems) {
        await prisma.system.create({
            data: system,
        });
    }

    // Créer des systèmes supplémentaires avec faker
    for (let i = 0; i < 10; i++) {
        await prisma.system.create({
            data: fakerSystem(),
        });
    }

    // 4. Récupérer les IDs pour les objets célestes
    const allUsers = await prisma.user.findMany({ select: { id: true } });
    const allCategories = await prisma.category.findMany({ select: { id: true } });
    const allSystems = await prisma.system.findMany({ select: { id: true } });

    const userIds = allUsers.map(u => u.id);
    const categoryIds = allCategories.map(c => c.id);
    const systemIds = allSystems.map(s => s.id);

    // 5. Créer les objets célestes
    console.log('Creating celestial objects...');
    for (const celestialObject of celestialObjects) {
        await prisma.celestialObject.create({
            data: celestialObject,
        });
    }

    // Créer des objets célestes supplémentaires avec faker
    for (let i = 0; i < 20; i++) {
        await prisma.celestialObject.create({
            data: fakerCelestialObject(systemIds, categoryIds, userIds),
        });
    }

    console.log('Database seeded successfully!');
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });

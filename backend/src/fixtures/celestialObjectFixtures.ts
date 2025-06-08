import { faker } from '@faker-js/faker';

export const celestialObjects = [
    // Planètes du système solaire
    {
        id: 'planet-001-mercury',
        name: 'Mercure',
        description: 'La planète la plus proche du Soleil',
        type: 'planète',
        radius: 2439.7,
        mass: 3.3011e23,
        distanceFromSun: 0.39,
        orbitalPeriod: 88,
        rotationPeriod: 1407.6,
        temperature: 167,
        discoveryDate: null,
        discoverer: 'Connue depuis l\'antiquité',
        systemId: '11111111-1111-1111-1111-111111111111', // Système solaire
        categoryId: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d', // Planète
        creatorId: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50', // Admin user
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'planet-002-venus',
        name: 'Vénus',
        description: 'La planète la plus chaude du système solaire',
        type: 'planète',
        radius: 6051.8,
        mass: 4.8675e24,
        distanceFromSun: 0.72,
        orbitalPeriod: 225,
        rotationPeriod: 5832.5,
        temperature: 464,
        discoveryDate: null,
        discoverer: 'Connue depuis l\'antiquité',
        systemId: '11111111-1111-1111-1111-111111111111',
        categoryId: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        creatorId: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'planet-003-earth',
        name: 'Terre',
        description: 'Notre planète, la seule connue pour abriter la vie',
        type: 'planète',
        radius: 6371,
        mass: 5.972e24,
        distanceFromSun: 1.0,
        orbitalPeriod: 365.25,
        rotationPeriod: 24,
        temperature: 15,
        discoveryDate: null,
        discoverer: 'Notre planète',
        systemId: '11111111-1111-1111-1111-111111111111',
        categoryId: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        creatorId: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    // Lunes
    {
        id: 'moon-001-luna',
        name: 'Lune',
        description: 'Le satellite naturel de la Terre',
        type: 'lune',
        radius: 1737.4,
        mass: 7.342e22,
        distanceFromSun: 1.0,
        orbitalPeriod: 27.3,
        rotationPeriod: 655.7,
        temperature: -23,
        discoveryDate: null,
        discoverer: 'Connue depuis toujours',
        systemId: '11111111-1111-1111-1111-111111111111',
        categoryId: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f', // Lune
        creatorId: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    // Exoplanètes
    {
        id: 'exoplanet-001-proxima-b',
        name: 'Proxima Centauri b',
        description: 'Exoplanète potentiellement habitable la plus proche de la Terre',
        type: 'exoplanète',
        radius: 7160,
        mass: 6.0e24,
        distanceFromSun: null,
        orbitalPeriod: 11.2,
        rotationPeriod: null,
        temperature: -39,
        discoveryDate: new Date('2016-08-24'),
        discoverer: 'Guillem Anglada-Escudé',
        systemId: '22222222-2222-2222-2222-222222222222', // Alpha Centauri
        categoryId: 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e', // Exoplanète
        creatorId: 'bf0596a2-149e-42b7-94de-0a10774280eb', // Contact user
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    // Étoiles
    {
        id: 'star-001-sun',
        name: 'Soleil',
        description: 'Notre étoile, une naine jaune de séquence principale',
        type: 'étoile',
        radius: 696000,
        mass: 1.989e30,
        distanceFromSun: 0,
        orbitalPeriod: null,
        rotationPeriod: 609.12,
        temperature: 5778,
        discoveryDate: null,
        discoverer: 'Connu depuis toujours',
        systemId: '11111111-1111-1111-1111-111111111111',
        categoryId: 'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a', // Étoile
        creatorId: 'd2c89e50-1b27-4b6a-b8a6-8a3b5f85df50',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
];

export const fakerCelestialObject = (systemIds: string[], categoryIds: string[], userIds: string[]) => {
    const objectTypes = ['planète', 'exoplanète', 'lune', 'astéroïde', 'comète', 'étoile'];
    const objectNames = [
        'Kepler-442b', 'HD 40307g', 'Gliese 667Cc', 'Wolf 1061c', 'Ross 128b',
        'LHS 1140b', 'TOI-715b', 'K2-18b', 'TRAPPIST-1e', 'L 98-59c'
    ];
    
    const type = faker.helpers.arrayElement(objectTypes);
    
    return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement(objectNames) + '-' + faker.number.int({ min: 1, max: 999 }),
        description: faker.lorem.sentence(),
        type,
        radius: type === 'étoile' 
            ? faker.number.float({ min: 100000, max: 1000000, fractionDigits: 1 })
            : faker.number.float({ min: 1000, max: 15000, fractionDigits: 1 }),
        mass: type === 'étoile'
            ? faker.number.float({ min: 1e29, max: 1e31 })
            : faker.number.float({ min: 1e22, max: 1e25 }),
        distanceFromSun: type === 'étoile' ? 0 : faker.number.float({ min: 0.1, max: 50, fractionDigits: 2 }),
        orbitalPeriod: type === 'étoile' ? null : faker.number.float({ min: 10, max: 1000, fractionDigits: 1 }),
        rotationPeriod: faker.number.float({ min: 12, max: 2000, fractionDigits: 1 }),
        temperature: faker.number.float({ min: -200, max: 6000, fractionDigits: 0 }),
        discoveryDate: faker.date.past({ years: 30 }),
        discoverer: faker.person.fullName(),
        systemId: faker.helpers.arrayElement(systemIds),
        categoryId: faker.helpers.arrayElement(categoryIds),
        creatorId: faker.helpers.arrayElement(userIds),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };
}; 
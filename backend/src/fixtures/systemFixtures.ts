import { faker } from '@faker-js/faker';

export const systems = [
    {
        id: '11111111-1111-1111-1111-111111111111',
        name: 'Système solaire',
        mainStar: 'Soleil',
        distanceFromEarth: 0,
        description: 'Notre système planétaire avec le Soleil comme étoile centrale',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: '22222222-2222-2222-2222-222222222222',
        name: 'Alpha Centauri',
        mainStar: 'Alpha Centauri A',
        distanceFromEarth: 4.37,
        description: 'Le système stellaire le plus proche du système solaire',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: '33333333-3333-3333-3333-333333333333',
        name: 'TRAPPIST-1',
        mainStar: 'TRAPPIST-1',
        distanceFromEarth: 39.6,
        description: 'Système de sept planètes de taille terrestre',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: '44444444-4444-4444-4444-444444444444',
        name: 'Kepler-452',
        mainStar: 'Kepler-452',
        distanceFromEarth: 1402,
        description: 'Système abritant Kepler-452b, surnommé "cousin de la Terre"',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: '55555555-5555-5555-5555-555555555555',
        name: 'HD 40307',
        mainStar: 'HD 40307',
        distanceFromEarth: 41.97,
        description: 'Système avec plusieurs super-Terres potentiellement habitables',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
];

export const fakerSystem = () => {
    const systemNames = [
        'Gliese 581', 'Wolf 1061', 'LHS 1140', 'Ross 128', 'Tau Ceti',
        'GJ 273', 'K2-18', 'TOI-715', 'L 98-59', 'LP 890-9'
    ];
    
    const starTypes = [
        'Naine rouge', 'Naine jaune', 'Géante rouge', 'Naine blanche', 
        'Étoile de type G', 'Étoile de type K', 'Étoile de type M'
    ];
    
    return {
        id: faker.string.uuid(),
        name: faker.helpers.arrayElement(systemNames) + '-' + faker.number.int({ min: 1, max: 999 }),
        mainStar: faker.helpers.arrayElement(starTypes),
        distanceFromEarth: faker.number.float({ min: 4.2, max: 2000, fractionDigits: 2 }),
        description: faker.lorem.sentence(),
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };
}; 
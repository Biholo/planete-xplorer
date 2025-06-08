import { faker } from '@faker-js/faker';

export const categories = [
    {
        id: 'a1b2c3d4-5e6f-7a8b-9c0d-1e2f3a4b5c6d',
        name: 'Planète',
        description: 'Corps céleste en orbite autour d\'une étoile, suffisamment massif pour être sphérique',
        color: '#4A90E2',
        icon: 'planet',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'b2c3d4e5-6f7a-8b9c-0d1e-2f3a4b5c6d7e',
        name: 'Exoplanète',
        description: 'Planète située en dehors du système solaire',
        color: '#7ED321',
        icon: 'exoplanet',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'c3d4e5f6-7a8b-9c0d-1e2f-3a4b5c6d7e8f',
        name: 'Lune',
        description: 'Satellite naturel d\'une planète',
        color: '#F5A623',
        icon: 'moon',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'd4e5f6a7-8b9c-0d1e-2f3a-4b5c6d7e8f9a',
        name: 'Étoile',
        description: 'Boule de plasma maintenue par sa propre gravité',
        color: '#F8E71C',
        icon: 'star',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'e5f6a7b8-9c0d-1e2f-3a4b-5c6d7e8f9a0b',
        name: 'Astéroïde',
        description: 'Petit corps rocheux en orbite autour du Soleil',
        color: '#8B572A',
        icon: 'asteroid',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
    {
        id: 'f6a7b8c9-0d1e-2f3a-4b5c-6d7e8f9a0b1c',
        name: 'Comète',
        description: 'Corps céleste composé de glace et de poussière',
        color: '#50E3C2',
        icon: 'comet',
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T10:00:00Z'),
    },
];

export const fakerCategory = () => {
    const categoryTypes = ['Nébuleuse', 'Galaxie', 'Amas stellaire', 'Trou noir', 'Pulsar', 'Quasar'];
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'];
    const icons = ['nebula', 'galaxy', 'cluster', 'blackhole', 'pulsar', 'quasar'];
    
    const randomIndex = Math.floor(Math.random() * categoryTypes.length);
    const uniqueSuffix = faker.number.int({ min: 100, max: 999 });
    
    return {
        id: faker.string.uuid(),
        name: `${categoryTypes[randomIndex]} ${uniqueSuffix}`,
        description: faker.lorem.sentence(),
        color: colors[randomIndex],
        icon: icons[randomIndex],
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };
}; 
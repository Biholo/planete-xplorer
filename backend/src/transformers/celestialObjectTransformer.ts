import { CelestialObject as PrismaCelestialObject } from '@/config/client';
import { CelestialObjectDto } from '@shared/dto';

class CelestialObjectTransformer {
    public toCelestialObjectDto(celestialObject: PrismaCelestialObject): CelestialObjectDto {
        return {
            id: celestialObject.id,
            name: celestialObject.name,
            description: celestialObject.description || undefined,
            type: celestialObject.type,
            radius: celestialObject.radius || undefined,
            mass: celestialObject.mass || undefined,
            distanceFromSun: celestialObject.distanceFromSun || undefined,
            orbitalPeriod: celestialObject.orbitalPeriod || undefined,
            rotationPeriod: celestialObject.rotationPeriod || undefined,
            temperature: celestialObject.temperature || undefined,
            discoveryDate: celestialObject.discoveryDate?.toISOString() || undefined,
            discoverer: celestialObject.discoverer || undefined,
            systemId: celestialObject.systemId || undefined,
            categoryId: celestialObject.categoryId,
            creatorId: celestialObject.creatorId,
            createdAt: celestialObject.createdAt.toISOString(),
            updatedAt: celestialObject.updatedAt.toISOString(),
        };
    }
}

export const celestialObjectTransformer = new CelestialObjectTransformer(); 
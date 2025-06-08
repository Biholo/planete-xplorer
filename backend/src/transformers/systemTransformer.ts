import { System as PrismaSystem } from '@/config/client';
import { SystemDto } from '@shared/dto';

class SystemTransformer {
    public toSystemDto(system: PrismaSystem): SystemDto {
        return {
            id: system.id,
            name: system.name,
            mainStar: system.mainStar || undefined,
            distanceFromEarth: system.distanceFromEarth || undefined,
            description: system.description || undefined,
            createdAt: system.createdAt.toISOString(),
            updatedAt: system.updatedAt.toISOString(),
        };
    }
}

export const systemTransformer = new SystemTransformer(); 
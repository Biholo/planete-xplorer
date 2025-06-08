import { Category as PrismaCategory } from '@/config/client';
import { CategoryDto } from '@shared/dto';

class CategoryTransformer {
    public toCategoryDto(category: PrismaCategory): CategoryDto {
        return {
            id: category.id,
            name: category.name,
            description: category.description || undefined,
            color: category.color || undefined,
            icon: category.icon || undefined,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString(),
        };
    }
}

export const categoryTransformer = new CategoryTransformer(); 
import { UserWithRelations } from '@/types';

import { UserDto, UserRole } from '@shared/dto';


class UserTransformer {
    public toUserDto(user: UserWithRelations): UserDto {
        // Parse roles from JSON to array
        let roles: UserRole[] = [];
        try {
            if (typeof user.roles === 'string') {
                // Remplacer les guillemets simples par des guillemets doubles pour avoir du JSON valide
                const cleanRolesString = user.roles.replace(/'/g, '"');
                roles = JSON.parse(cleanRolesString) as UserRole[];
            } else if (Array.isArray(user.roles)) {
                roles = user.roles as UserRole[];
            } else if (user.roles) {
                // Fallback si roles est déjà un objet JSON, on essaie de le convertir en string puis parser
                const rolesString = JSON.stringify(user.roles);
                const cleanRolesString = rolesString.replace(/'/g, '"');
                roles = JSON.parse(cleanRolesString) as UserRole[];
            }
        } catch (error) {
            console.error('Error parsing user roles:', error);
            console.error('Original roles value:', user.roles);
            roles = [UserRole.USER]; // Fallback par défaut
        }

        // S'assurer qu'on a au moins un rôle
        if (!roles || roles.length === 0) {
            roles = [UserRole.USER];
        }

        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.createdAt.toISOString(),
            updatedAt: user.updatedAt.toISOString(),
            phone: user.phone,
            civility: user.civility,
            birthDate: user.birthDate,
            roles: roles,
        };
    }
}

export const userTransformer = new UserTransformer();

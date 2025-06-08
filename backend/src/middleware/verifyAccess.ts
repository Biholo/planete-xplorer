import { forbiddenResponse, unauthorizedResponse } from '@/utils/jsonResponse';

import { User, UserRole } from '@shared/dto';
import { FastifyReply, FastifyRequest, HookHandlerDoneFunction } from 'fastify';

interface AuthenticatedRequest extends FastifyRequest {
    user: User;
}

/**
 * Middleware to check if the user has the required access rights, considering the role hierarchy.
 * @param requiredRole - The required role to access the resource.
 */
export const verifyAccess = (requiredRole: UserRole) => {
    return (req: AuthenticatedRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
        const user = req.user;

        console.log('🔒 verifyAccess - Debug:', {
            requiredRole,
            user: user ? {
                id: user.id,
                email: user.email,
                roles: user.roles,
                rolesType: typeof user.roles,
                rolesArray: Array.isArray(user.roles)
            } : null
        });

        if (!user) {
            console.log('❌ verifyAccess - User not authenticated');
            return unauthorizedResponse(reply, 'Unauthorized: User not authenticated.');
        }

        const hasAccess = user.roles?.includes(requiredRole);
        console.log('🔍 verifyAccess - Access check:', {
            hasAccess,
            userRoles: user.roles,
            requiredRole,
            includesCheck: user.roles?.includes(requiredRole)
        });

        if (hasAccess) {
            console.log('✅ verifyAccess - Access granted');
            done();
            return;
        } else {
            console.log('🚫 verifyAccess - Access denied');
            return forbiddenResponse(reply, "Forbidden: You don't have the required permissions.");
        }
    };
};

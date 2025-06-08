import { badRequestResponse, internalServerError } from '@/utils/jsonResponse';
import { logger } from '@/utils/logger';

import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { ZodError } from 'zod';

/**
 * Error handler for Fastify
 * @param app - Fastify instance
 */
export async function errorHandlerMiddleware(app: FastifyInstance): Promise<void> {
    app.setErrorHandler((error: Error, request: FastifyRequest, reply: FastifyReply) => {
        logger.error(error);

        if (error instanceof SyntaxError) {
            return badRequestResponse(reply, 'Syntax error in the request');
        }

        if (error instanceof ZodError) {
            return badRequestResponse(reply, error.message, error.flatten().fieldErrors);
        }

        return internalServerError(reply, 'Internal Server Error');
    });
}

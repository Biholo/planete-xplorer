import swagger from '@fastify/swagger';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { z } from 'zod';

import { responseSchemaType } from './jsonResponse';

/**
 * Initialise le swagger
 * @param app - L'instance de l'application Fastify
 */
export function initSwagger(app: FastifyInstance) {
    app.register(swagger, {
        mode: 'dynamic',
        openapi: {
            info: { title: 'Fastify API', version: '1.0.0' },
            components: {
                securitySchemes: {
                    bearerAuth: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            security: [
                {
                    bearerAuth: [],
                },
            ],
            tags: [
                { name: 'Auth', description: 'Routes d\'authentification' },
                { name: 'Users', description: 'Routes de gestion des utilisateurs' },    
            ]
        },
    });

    // Route pour accéder à la documentation Swagger
    if (process.env.NODE_ENV !== 'production') {
        app.register(require('@fastify/swagger-ui'), {
            routePrefix: '/api',
            uiConfig: {
                docExpansion: 'list',
                deepLinking: false,
                persistAuthorization: true,
                tagsSorter: 'alpha',
                operationsSorter: 'alpha',
                defaultModelsExpandDepth: 1,
                defaultModelExpandDepth: 2,
            },
            uiHooks: {
                onRequest: function (request: FastifyRequest, reply: FastifyReply, next: any) {
                    next();
                },
                preHandler: function (request: FastifyRequest, reply: FastifyReply, next: any) {
                    next();
                },
            },
            staticCSP: true,
            transformStaticCSP: (header: string) => header,
            transformSpecification: (
                swaggerObject: any,
                request: FastifyRequest,
                reply: FastifyReply
            ) => {
                return swaggerObject;
            },
            transformSpecificationClone: true,
        });
    }
}

/**
 * Crée un schéma de swagger pour une route
 * @param description - La description de la route
 * @param responses - Les réponses de la route
 * @param bodySchema - Le schéma de zod du corps de la requête
 * @param security - Si la route est sécurisée
 * @param querySchema - Le schéma de zod des paramètres de requête
 * @param tags - Les tags de la route pour le regroupement
 * @returns Le schéma de swagger
 */
export function createSwaggerSchema(
    description: string,
    responses: responseSchemaType[],
    bodySchema?: z.ZodObject<any, any> | null,
    security?: boolean,
    querySchema?: z.ZodObject<any, any> | null,
    tags?: string[]
) {
    // Créer un schéma de réponse avec les détails
    const responseContentSchema = {
        type: 'object',
        properties: {
            message: { type: 'string' },
            status: { type: 'integer' },
            data: {
                type: 'object',
                additionalProperties: true
            }
        }
    };

    let schema: any = {
        description,
        responses: responses.reduce(
            (acc, response) => {
                acc[response.status] = {
                    description: response.message,
                    content: {
                        'application/json': {
                            schema: responseContentSchema
                        },
                    },
                };
                return acc;
            },
            {} as Record<string, any>
        ),
    };

    if (security) {
        schema.security = [{ bearerAuth: [] }];
    }

    if (bodySchema) {
        schema.body = generateSchemaProperties(bodySchema);
    }

    if (querySchema) {
        schema.querystring = generateSchemaProperties(querySchema);
    }

    if (tags && tags.length > 0) {
        schema.tags = tags;
    }

    return schema;
}

/**
 * Génère les propriétés du schéma de swagger
 * @param schema - Le schéma de zod à convertir
 * @returns Les propriétés du schéma de swagger
 */
export const generateSchemaProperties = (schema: z.ZodObject<any, any>) => {
    const shape = schema.shape;
    const properties: { [key: string]: { 
        type: string; 
        format?: string; 
        enum?: string[]; 
        description?: string;
        items?: any;
        properties?: any;
        required?: string[];
        additionalProperties?: boolean;
        oneOf?: any[];
    } } = {};
    const required: string[] = [];

    for (const key in shape) {
        const zodType = shape[key];
        let isRequired = true;
        let description = '';

        // Extraire le type réel, en gérant les optionnels
        const realType = zodType instanceof z.ZodOptional ? zodType._def.innerType : zodType;

        // Vérifier si le champ est optionnel
        if (zodType instanceof z.ZodOptional) {
            isRequired = false;
            description = '(Optionnel) ';
        } else {
            required.push(key);
        }

        // Ajouter la description si elle existe
        if (realType._def.description) {
            description += realType._def.description;
        }

        if (realType instanceof z.ZodString) {
            properties[key] = { 
                type: 'string',
                description: description || undefined 
            };
        } else if (realType instanceof z.ZodNumber) {
            properties[key] = { 
                type: 'number',
                description: description || undefined 
            };
        } else if (realType instanceof z.ZodBoolean) {
            properties[key] = { 
                type: 'boolean',
                description: description || undefined 
            };
        } else if (realType instanceof z.ZodDate) {
            properties[key] = { 
                type: 'string', 
                format: 'date-time',
                description: description || undefined 
            };
        } else if (realType instanceof z.ZodEnum) {
            properties[key] = { 
                type: 'string', 
                enum: realType.options,
                description: description || undefined 
            };
        } else if (realType instanceof z.ZodArray) {
            // Déterminer le type des éléments du tableau
            const arrayType = realType._def.type;
            let itemsType: any = { type: 'string' };
            
            if (arrayType instanceof z.ZodString) {
                itemsType = { type: 'string' };
            } else if (arrayType instanceof z.ZodNumber) {
                itemsType = { type: 'number' };
            } else if (arrayType instanceof z.ZodBoolean) {
                itemsType = { type: 'boolean' };
            } else if (arrayType instanceof z.ZodNativeEnum) {
                // Gérer les enums natifs dans les tableaux
                itemsType = { 
                    type: 'string',
                    enum: Object.values(arrayType._def.values)
                };
            } else if (arrayType instanceof z.ZodEnum) {
                // Gérer les enums Zod dans les tableaux  
                itemsType = { 
                    type: 'string',
                    enum: arrayType.options
                };
            } else if (arrayType instanceof z.ZodObject) {
                // Pour les tableaux d'objets, récursivement générer le schéma
                const nestedSchema = generateSchemaProperties(arrayType);
                itemsType = nestedSchema;
            } else {
                // Fallback pour autres types
                itemsType = { type: 'object' };
            }
            
            properties[key] = { 
                type: 'array',
                description: description || undefined,
                items: itemsType
            };
        } else if (realType instanceof z.ZodObject) {
            // Gérer les objets imbriqués avec possibilité de string JSON
            const nestedSchema = generateSchemaProperties(realType);
            properties[key] = {
                type: 'object',
                oneOf: [
                    {
                        type: 'object',
                        properties: nestedSchema.properties,
                        required: nestedSchema.required,
                        description: description || undefined
                    },
                    {
                        type: 'string',
                        description: 'JSON stringifié de l\'objet'
                    }
                ]
            };
        } else if (realType instanceof z.ZodAny) {
            // Gérer le type any
            properties[key] = {
                type: 'object',
                oneOf: [
                    {
                        type: 'object',
                        additionalProperties: true,
                        description: description || undefined
                    },
                    {
                        type: 'string',
                        description: 'JSON stringifié de l\'objet'
                    }
                ]
            };
        } else {
            properties[key] = { 
                type: 'string',
                description: description || undefined 
            };
        }
    }

    return {
        type: 'object',
        properties: properties,
        required: required.length > 0 ? required : undefined
    };
};

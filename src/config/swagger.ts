import swaggerJsdoc from 'swagger-jsdoc'; import swaggerUi from 'swagger-ui-express'; import type { Express } from 'express'; import { fileURLToPath } from 'node:url'; import { env } from './env.js';

const extension = import.meta.url.endsWith('.ts') ? '.ts' : '.js';

const routeGlob = fileURLToPath(
  new URL(`../routes/*${extension}`, import.meta.url)
).replace(/\\/g, '/');

export const swaggerSpec = swaggerJsdoc({ failOnErrors: true, definition: { openapi: '3.0.3', info: { title: 'SportMap API', version: '1.0.0', description: 'Documentação da API do SportMap.', }, servers: [ { url: env.API_ORIGIN, description: 'Servidor da API', }, ], components: { securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', }, }, }, }, apis: [routeGlob], });

export const setupSwagger = (app: Express): void => { app.get('/api-docs.json', (_req, res) => { res.json(swaggerSpec); });

app.use( '/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec), ); };
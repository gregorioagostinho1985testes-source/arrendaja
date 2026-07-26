"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApp = buildApp;
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const helmet_1 = __importDefault(require("@fastify/helmet"));
const jwt_1 = __importDefault(require("@fastify/jwt"));
const rate_limit_1 = __importDefault(require("@fastify/rate-limit"));
const cookie_1 = __importDefault(require("@fastify/cookie"));
const auth_routes_1 = require("./routes/auth.routes");
const env_1 = require("./env");
const prisma_1 = require("./lib/prisma");
async function buildApp() {
    const app = (0, fastify_1.default)({
        logger: env_1.env.NODE_ENV === 'development'
    });
    await app.register(helmet_1.default, { contentSecurityPolicy: false });
    await app.register(cors_1.default, {
        origin: '*', // Permite acesso em ambiente de dev/prod
        credentials: true
    });
    await app.register(rate_limit_1.default, { max: 100, timeWindow: '1 minute' });
    await app.register(cookie_1.default);
    await app.register(jwt_1.default, {
        secret: env_1.env.JWT_SECRET
    });
    // Decorar a instância do Fastify com o Prisma
    app.decorate('prisma', prisma_1.prisma);
    // Decorar a instância do Fastify com o middleware de autenticação
    app.decorate('authenticate', async (request, reply) => {
        try {
            await request.jwtVerify();
        }
        catch (err) {
            return reply.status(401).send({ message: 'Não autorizado. Token inválido ou ausente.' });
        }
    });
    // Health check
    app.get('/health', async () => {
        return { status: 'ok', project: 'ArrendaJá API', timestamp: new Date().toISOString() };
    });
    // Registar rotas da API com o prefixo v1
    await app.register(auth_routes_1.authRoutes, { prefix: '/api/v1/auth' });
    return app;
}
async function start() {
    const app = await buildApp();
    try {
        await app.listen({ port: env_1.env.PORT, host: '0.0.0.0' });
        console.log(`API ArrendaJá rodando em: http://localhost:${env_1.env.PORT}`);
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
}
start();

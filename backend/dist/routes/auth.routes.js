"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = authRoutes;
const auth_service_1 = require("../services/auth.service");
const auth_schema_1 = require("../schemas/auth.schema");
const authService = new auth_service_1.AuthService();
async function authRoutes(app) {
    // Rota de Cadastro
    app.post('/register', async (request, reply) => {
        try {
            const body = auth_schema_1.registerSchema.parse(request.body);
            const user = await authService.register(body);
            const token = app.jwt.sign({ role: user.role }, { sub: user.id, expiresIn: '7d' });
            return reply.status(201).send({
                message: 'Conta criada com sucesso!',
                user,
                token
            });
        }
        catch (error) {
            return reply.status(400).send({ message: error.message || 'Erro ao processar registo.' });
        }
    });
    // Rota de Login
    app.post('/login', async (request, reply) => {
        try {
            const body = auth_schema_1.loginSchema.parse(request.body);
            const user = await authService.authenticate(body);
            const token = app.jwt.sign({ role: user.role }, { sub: user.id, expiresIn: '7d' });
            return reply.status(200).send({
                user,
                token
            });
        }
        catch (error) {
            return reply.status(400).send({ message: error.message || 'Erro na autenticação.' });
        }
    });
    // Rota de Perfil do Utilizador Autenticado
    app.get('/me', { onRequest: [app.authenticate] }, async (request, reply) => {
        const userId = request.user.sub;
        const user = await app.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                identityStatus: true,
                avatarUrl: true,
                createdAt: true
            }
        });
        if (!user) {
            return reply.status(404).send({ message: 'Utilizador não encontrado.' });
        }
        return reply.status(200).send({ user });
    });
}

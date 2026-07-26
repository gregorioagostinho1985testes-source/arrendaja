"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../lib/prisma");
class AuthService {
    async register(data) {
        // Normalização do número de telefone (garante formato padrão sem espaços)
        const normalizedPhone = data.phoneNumber.replace(/\s+/g, '');
        const userExists = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email: data.email.toLowerCase() },
                    { phoneNumber: normalizedPhone }
                ]
            }
        });
        if (userExists) {
            throw new Error('Já existe uma conta associada a este e-mail ou número de telefone.');
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
        const user = await prisma_1.prisma.user.create({
            data: {
                fullName: data.fullName,
                email: data.email.toLowerCase(),
                phoneNumber: normalizedPhone,
                passwordHash,
                role: data.role
            },
            select: {
                id: true,
                fullName: true,
                email: true,
                phoneNumber: true,
                role: true,
                identityStatus: true,
                createdAt: true
            }
        });
        return user;
    }
    async authenticate(data) {
        const input = data.emailOrPhone.trim().toLowerCase();
        const user = await prisma_1.prisma.user.findFirst({
            where: {
                OR: [
                    { email: input },
                    { phoneNumber: input }
                ]
            }
        });
        if (!user) {
            throw new Error('Credenciais inválidas.');
        }
        const isPasswordValid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas.');
        }
        return {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            identityStatus: user.identityStatus
        };
    }
}
exports.AuthService = AuthService;

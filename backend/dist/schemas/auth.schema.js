"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    fullName: zod_1.z.string().min(3, 'O nome completo deve ter pelo menos 3 caracteres'),
    email: zod_1.z.string().email('Endereço de e-mail inválido'),
    phoneNumber: zod_1.z.string().regex(/^(\+244)?9[1-9][0-9]{7}$/, 'Número de telefone de Angola inválido (ex: 923xxxxxx)'),
    password: zod_1.z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres'),
    role: zod_1.z.enum(['TENANT', 'LANDLORD']).default('TENANT')
});
exports.loginSchema = zod_1.z.object({
    emailOrPhone: zod_1.z.string().min(1, 'Informe o e-mail ou número de telefone'),
    password: zod_1.z.string().min(1, 'Informe a palavra-passe')
});

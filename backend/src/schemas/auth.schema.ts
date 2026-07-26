import { z } from 'zod'

export const registerSchema = z.object({
  fullName: z.string().min(3, 'O nome completo deve ter pelo menos 3 caracteres'),
  email: z.string().email('Endereço de e-mail inválido'),
  phoneNumber: z.string().regex(/^(\+244)?9[1-9][0-9]{7}$/, 'Número de telefone de Angola inválido (ex: 923xxxxxx)'),
  password: z.string().min(6, 'A palavra-passe deve ter pelo menos 6 caracteres'),
  role: z.enum(['TENANT', 'LANDLORD']).default('TENANT')
})

export const loginSchema = z.object({
  emailOrPhone: z.string().min(1, 'Informe o e-mail ou número de telefone'),
  password: z.string().min(1, 'Informe a palavra-passe')
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>

import { z } from 'zod'

export const createPropertySchema = z.object({
  title: z.string().min(5, 'O título deve ter pelo menos 5 caracteres'),
  description: z.string().min(10, 'A descrição deve ser detalhada'),
  price: z.number().positive('O preço deve ser um valor positivo'),
  type: z.enum(['APARTMENT', 'HOUSE', 'ANNEX', 'COMMERCIAL']),
  province: z.string().default('Luanda'),
  municipality: z.string().min(2, 'Informe o município'),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  address: z.string().optional(),
  bedrooms: z.number().int().min(0).default(1),
  bathrooms: z.number().int().min(0).default(1),
  hasWater: z.boolean().default(false),
  hasPower: z.boolean().default(false),
  imageUrl: z.string().url('URL de imagem inválida').optional()
})

export type CreatePropertyInput = z.infer<typeof createPropertySchema>
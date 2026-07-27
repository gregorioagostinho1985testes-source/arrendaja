import { z } from 'zod'

export const submitIdentitySchema = z.object({
  identityNumber: z.string().min(8, 'Informe um número de BI / Documento válido (ex: 000000000LA000)'),
  documentType: z.enum(['BI', 'PASSPORT']).default('BI')
})

export type SubmitIdentityInput = z.infer<typeof submitIdentitySchema>
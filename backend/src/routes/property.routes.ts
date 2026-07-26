import { FastifyInstance } from 'fastify'
import { PropertyService } from '../services/property.service'
import { createPropertySchema } from '../schemas/property.schema'

const propertyService = new PropertyService()

export async function propertyRoutes(app: FastifyInstance) {
  
  // Listar Imóveis Públicos
  app.get('/', async (request, reply) => {
    const { municipality, type } = request.query as { municipality?: string; type?: string }
    const properties = await propertyService.listApproved({ municipality, type })
    return reply.send({ properties })
  })

  // Criar Imóvel (Apenas Autenticados)
  app.post('/', { onRequest: [app.authenticate] }, async (request, reply) => {
    try {
      const body = createPropertySchema.parse(request.body)
      const userId = request.user.sub

      const property = await propertyService.create(userId, body)
      return reply.status(201).send({ message: 'Imóvel publicado com sucesso!', property })
    } catch (error: any) {
      return reply.status(400).send({ message: error.message || 'Erro ao publicar imóvel.' })
    }
  })
}
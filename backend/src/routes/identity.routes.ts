import { FastifyInstance } from 'fastify'
import { IdentityService } from '../services/identity.service'
import { submitIdentitySchema } from '../schemas/identity.schema'

const identityService = new IdentityService()

export async function identityRoutes(app: FastifyInstance) {
  app.post('/verify', { onRequest: [app.authenticate] }, async (request, reply) => {
    try {
      const body = submitIdentitySchema.parse(request.body)
      const userId = request.user.sub

      const user = await identityService.submitVerification(userId, body)

      return reply.status(200).send({
        message: 'Identidade verificada com sucesso!',
        user
      })
    } catch (error: any) {
      return reply.status(400).send({ message: error.message || 'Erro ao processar verificação.' })
    }
  })
}
import { FastifyInstance } from 'fastify'

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    return { message: 'Rota de registo operante' }
  })

  app.post('/auth/login', async (request, reply) => {
    return { message: 'Rota de login operante' }
  })
}
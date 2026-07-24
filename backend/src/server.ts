import Fastify from 'fastify'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import cookie from '@fastify/cookie'

import { authRoutes } from './routes/auth.routes'

import { env } from './env'
import { prisma } from './lib/prisma'

export async function buildApp() {
  const app = Fastify({
    logger: env.NODE_ENV === 'development'
  })

  await app.register(helmet, { contentSecurityPolicy: false })
  
  await app.register(cors, {
    origin: '*', // Permitirá o acesso do teu telemóvel em dev/prod
    credentials: true
  })

  await app.register(rateLimit, { max: 100, timeWindow: '1 minute' })
  await app.register(cookie)

  await app.register(jwt, {
    secret: env.JWT_SECRET
  })

  // Health check
  app.get('/health', async () => {
    return { status: 'ok', project: 'ArrendaJá API', timestamp: new Date().toISOString() }
  })

  // Registar rotas da API com o prefixo v1
await app.register(authRoutes, { prefix: '/api/v1' })

  return app
}

async function start() {
  const app = await buildApp()

  try {
    await app.listen({ port: env.PORT, host: '0.0.0.0' })
    console.log(`API ArrendaJá rodando em: http://localhost:${env.PORT}`)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
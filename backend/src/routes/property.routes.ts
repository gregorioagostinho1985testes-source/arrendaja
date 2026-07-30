import { FastifyInstance } from 'fastify'
import { AuthService } from '../services/auth.service'
import { registerSchema, loginSchema } from '../schemas/auth.schema'

const authService = new AuthService()

export async function authRoutes(app: FastifyInstance) {
  
  // Rota de Cadastro
  app.post('/register', async (request, reply) => {
    try {
      const body = registerSchema.parse(request.body)
      const user = await authService.register(body)

      const token = app.jwt.sign(
        { role: user.role },
        { sub: user.id, expiresIn: '7d' }
      )

      return reply.status(201).send({
        message: 'Conta criada com sucesso!',
        user,
        token
      })
    } catch (error: any) {
      return reply.status(400).send({ message: error.message || 'Erro ao processar registo.' })
    }
  })

  // Rota de Login
  app.post('/login', async (request, reply) => {
    try {
      const body = loginSchema.parse(request.body)
      const user = await authService.authenticate(body)

      const token = app.jwt.sign(
        { role: user.role },
        { sub: user.id, expiresIn: '7d' }
      )

      return reply.status(200).send({
        user,
        token
      })
    } catch (error: any) {
      return reply.status(400).send({ message: error.message || 'Erro na autenticação.' })
    }
  })

  // ==========================================
  // NOVA ROTA: Autenticação com o Google
  // ==========================================
  app.get('/google', async (request, reply) => {
    // Implementa aqui a lógica de redirecionamento para o Google OAuth 
    // ou integração com o teu serviço de autenticação social.
    
    // Exemplo temporário para evitar o 404 enquanto configuras o SDK/OAuth:
    return reply.status(501).send({ 
      message: 'A rota do Google OAuth está configurada no servidor, mas falta associar o provider do Google.' 
    })
  })

  // Rota de Perfil do Utilizador Autenticado
  app.get('/me', { onRequest: [app.authenticate] }, async (request, reply) => {
    const userId = request.user.sub

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
    })

    if (!user) {
      return reply.status(404).send({ message: 'Utilizador não encontrado.' })
    }

    return reply.status(200).send({ user })
  })
}
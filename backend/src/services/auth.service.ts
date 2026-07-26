import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma'
import { RegisterInput, LoginInput } from '../schemas/auth.schema'

export class AuthService {
  async register(data: RegisterInput) {
    // Normalização do número de telefone (garante formato padrão sem espaços)
    const normalizedPhone = data.phoneNumber.replace(/\s+/g, '')

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [
          { email: data.email.toLowerCase() },
          { phoneNumber: normalizedPhone }
        ]
      }
    })

    if (userExists) {
      throw new Error('Já existe uma conta associada a este e-mail ou número de telefone.')
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const user = await prisma.user.create({
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
    })

    return user
  }

  async authenticate(data: LoginInput) {
    const input = data.emailOrPhone.trim().toLowerCase()

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: input },
          { phoneNumber: input }
        ]
      }
    })

    if (!user) {
      throw new Error('Credenciais inválidas.')
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash)

    if (!isPasswordValid) {
      throw new Error('Credenciais inválidas.')
    }

    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
      identityStatus: user.identityStatus
    }
  }
}
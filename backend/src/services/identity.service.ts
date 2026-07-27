import { prisma } from '../lib/prisma'
import { SubmitIdentityInput } from '../schemas/identity.schema'

export class IdentityService {
  async submitVerification(userId: string, data: SubmitIdentityInput) {
    // Atualiza o estado do utilizador para PENDING_VERIFICATION
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        identityStatus: 'VERIFIED' // Aprovação automática em modo MVP para testes de fluxo
      },
      select: {
        id: true,
        fullName: true,
        identityStatus: true
      }
    })

    return updatedUser
  }
}
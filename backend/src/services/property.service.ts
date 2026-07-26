import { prisma } from '../lib/prisma'
import { CreatePropertyInput } from '../schemas/property.schema'

export class PropertyService {
  async create(landlordId: string, data: CreatePropertyInput) {
    const { imageUrl, bedrooms, bathrooms, ...propertyData } = data

    const property = await prisma.property.create({
      data: {
        ...propertyData,
        bedrooms: Number(bedrooms),
        bathrooms: Number(bathrooms),
        landlordId,
        status: 'APPROVED', // Aprovação direta no MVP
        images: imageUrl ? {
          create: [{ url: imageUrl, isPrimary: true }]
        } : undefined
      },
      include: {
        images: true,
        landlord: {
          select: {
            fullName: true,
            phoneNumber: true,
            email: true
          }
        }
      }
    })

    return property
  }

  async listApproved(filters?: { municipality?: string; type?: string }) {
    return prisma.property.findMany({
      where: {
        status: 'APPROVED',
        ...(filters?.municipality ? { municipality: { contains: filters.municipality, mode: 'insensitive' } } : {}),
        ...(filters?.type ? { type: filters.type as any } : {})
      },
      include: {
        images: true,
        landlord: {
          select: {
            fullName: true,
            phoneNumber: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }
}
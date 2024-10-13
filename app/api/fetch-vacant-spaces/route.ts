import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    // Fetch all vacant spaces
    const vacantSpaces = await prisma.space.findMany({
      where: {
        spaceStatus: 'Vacant',
      },
      select: {
        id: true,
        spaceNumber: true,
        spaceArea: true,
        spaceRate: true,
        propertyId: true,
        totalSpaceRent: true,
      },
    })

    // Get unique property IDs from vacant spaces
    const propertyIdsWithVacantSpaces = Array.from(new Set(vacantSpaces.map(space => space.propertyId)))

    // Fetch properties that have vacant spaces
    const properties = await prisma.property.findMany({
      where: {
        id: { in: propertyIdsWithVacantSpaces },
      },
      select: {
        id: true,
        propertyName: true,
        propertyCode: true,
      },
    })

    // Return both properties and vacant spaces
    return NextResponse.json({ properties, vacantSpaces })
  } catch (error) {
    console.error('Error fetching tenant onboarding data:', error)
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}

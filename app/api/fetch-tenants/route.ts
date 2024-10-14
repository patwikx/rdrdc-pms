import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const leases = await prisma.lease.findMany({
      include: {
        tenant: true,
        property: {
          include: {
            space: true
          }
        }
      }
    })

    return NextResponse.json(leases)
  } catch (error) {
    console.error('Error fetching leases:', error)
    return NextResponse.json({ error: 'Error fetching leases' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const tenants = await prisma.tenant.findMany({
      include: {
        space: {
          include: {
            property: true
          }
        },
        lease: true
      }
    })

    return NextResponse.json(tenants)
  } catch (error) {
    console.error('Error fetching tenants:', error)
    return NextResponse.json({ error: 'Error fetching tenants' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
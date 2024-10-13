import { PrismaClient } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { firstName, lastName, email, contactNo, address, propertyId, spaceId, rent, leaseStartDate, leaseEndDate } = req.body

      const tenant = await prisma.tenant.create({
        data: {
          firstName,
          lastName,
          email,
          contactNo,
          address,
        },
      })

      const lease = await prisma.lease.create({
        data: {
          tenantId: tenant.id,
          propertyId,
          rent,
          status: 'Active',
        },
      })

      await prisma.space.update({
        where: { id: spaceId },
        data: {
          tenantId: tenant.id,
          spaceStatus: 'Occupied',
        },
      })

      res.status(200).json({ message: 'Tenant onboarded successfully', tenant, lease })
    } catch (error) {
      res.status(500).json({ message: 'Error onboarding tenant', error })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
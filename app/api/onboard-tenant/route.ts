import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, contactNo, address, companyName, propertyId, spaceId, rent, leaseStart, leaseEnd } = body;

    // Start a transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Create a new tenant
      const tenant = await prisma.tenant.create({
        data: {
          firstName,
          lastName,
          email,
          companyName,
          contactNo,
          address,
        },
      });

      // Create a new lease
      const lease = await prisma.lease.create({
        data: {
          tenantId: tenant.id,
          propertyId,
          rent,
          status: 'Active',
          leaseStart,
          leaseEnd,
        },
      });

      // Update the space status to Occupied
      await prisma.space.update({
        where: { id: spaceId },
        data: { 
          spaceStatus: 'Occupied',
          tenantId: tenant.id,
        },
      });

      return { tenant, lease };
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('Error in onboard-tenant route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
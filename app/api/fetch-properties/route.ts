import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const revalidate = 0;

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        propertyCode: true,
        propertyName: true,
        registeredOwner: true,
        titleNo: true,
        lotNo: true,
        address: true,
        city: true,
        leasableArea: true,
        province: true,
        propertyType: true,
        createdAt: true,
        updatedAt: true,
        space: {
          select: {
            id: true,
            spaceNumber: true,
            spaceArea: true,
            spaceRate: true,
            spaceStatus: true,
            spaceRemarks: true,
            totalSpaceRent: true,
            rpt: {
              select: {
                id: true,
                TaxDecNo: true,
                PaymentMode: true,
                DueDate: true,
                Status: true,
                custodianRemarks: true,
                createdAt: true
              }
            },
            tenant: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                contactNo: true,
                companyName: true,
                address: true,
                email: true
              }
            }
          }
        },
        rpt: {
          select: {
            id: true,
            TaxDecNo: true,
            PaymentMode: true,
            DueDate: true,
            Status: true,
            custodianRemarks: true,
            spaceId: true,
            createdAt: true
          }
        },
        attachments: {
          select: {
            id: true,
            files: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    const response = NextResponse.json(properties, { status: 200 });
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching property data:', error);
    return NextResponse.json({ error: 'Unable to fetch property data' }, { status: 500 });
  }
}

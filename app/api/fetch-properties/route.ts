import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // assuming prisma is set up correctly

export const revalidate = 0

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
        updatedAt: true, // Ensure this field exists in your schema
        space: { // Include the space relation
          select: {
            id: true,
            spaceNumber: true,
            spaceArea: true,
            spaceRate: true,
            spaceStatus: true,
            spaceRemarks: true,
            totalSpaceRent: true,
            rpt: { // Include the rpt relation for each space
              select: {
                id: true,
                TaxDecNo: true,
                PaymentMode: true,
                DueDate: true,
                Status: true,
                custodianRemarks: true,
                createdAt: true
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
        updatedAt: 'desc', // Order by the updatedAt field in descending order
      },
    });

    const response = NextResponse.json(properties, { status: 200 });

    // Set cache control headers to disable caching
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;
  } catch (error) {
    console.error('Error fetching property data:', error);
    return NextResponse.json({ error: 'Unable to fetch property data' }, { status: 500 });
  }
}

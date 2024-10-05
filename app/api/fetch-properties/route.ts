import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // assuming prisma is set up correctly

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
        province: true,
        propertyType: true,
        createdAt: true,
        space: { // Include the space relation
          select: {
            id: true,
            spaceNumber: true,
            spaceArea: true,
            spaceStatus: true,
            spaceRemarks: true,
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

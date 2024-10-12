import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const data = await request.json();

    // Extract only the fields that belong to the Property model
    const {
      propertyCode,
      propertyName,
      registeredOwner,
      titleNo,
      lotNo,
      address,
      city,
      leasableArea,
      province,
      propertyType,
    } = data;

    // Validate the leasableArea
    if (leasableArea !== undefined && leasableArea !== null) {
      if (isNaN(Number(leasableArea))) {
        return NextResponse.json({ error: 'Invalid leasableArea value' }, { status: 400 });
      }
    }

    const updatedProperty = await prisma.property.update({
      where: { id },
      data: {
        propertyCode,
        propertyName,
        registeredOwner,
        titleNo,
        lotNo,
        address,
        city,
        leasableArea: leasableArea ? leasableArea.toString() : null,
        province,
        propertyType,
      },
      include: {
        space: true,
        rpt: true,
        attachments: true,
      },
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}
// app/api/create-rpt-property/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Update this import according to your project's structure

export async function POST(request: Request) {
  try {
    const { spaceNumber, spaceArea, spaceRate, spaceStatus, spaceRemarks, totalSpaceRent, propertyId } = await request.json();

    const newRPT = await prisma.space.create({
      data: {
        spaceNumber, spaceArea, spaceRate, spaceStatus, spaceRemarks, totalSpaceRent,
        ...(propertyId && { property: { connect: { id: propertyId } } }) // Only connect if propertyId is provided
      },
    });

    return NextResponse.json(newRPT, { status: 201 }); // Return created RPT
  } catch (error) {
    console.error('Error creating space for property:', error);
    return NextResponse.json({ message: 'Error creating space for property', error }, { status: 500 });
  }
}

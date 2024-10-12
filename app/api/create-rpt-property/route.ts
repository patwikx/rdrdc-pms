// app/api/create-rpt-property/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Update this import according to your project's structure

export async function POST(request: Request) {
  try {
    const { TaxDecNo, PaymentMode, DueDate, Status, custodianRemarks, propertyId } = await request.json();

    const newRPT = await prisma.rPT.create({
      data: {
        TaxDecNo,
        PaymentMode,
        DueDate,
        Status,
        custodianRemarks,
        ...(propertyId && { property: { connect: { id: propertyId } } }) // Only connect if propertyId is provided
      },
    });

    return NextResponse.json(newRPT, { status: 201 }); // Return created RPT
  } catch (error) {
    console.error('Error creating RPT entry:', error);
    return NextResponse.json({ message: 'Error creating RPT entry', error }, { status: 500 });
  }
}

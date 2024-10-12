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
      TaxDecNo,
      PaymentMode,
      DueDate,
      Status,
      custodianRemarks,
    } = data;

    const updatedRPT = await prisma.rPT.update({
      where: { id },
      data: {
        TaxDecNo,
        PaymentMode,
        DueDate,
        Status,
        custodianRemarks,
      },
    });

    return NextResponse.json(updatedRPT);
  } catch (error) {
    console.error('Error updating RPT:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}


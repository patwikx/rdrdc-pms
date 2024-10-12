import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
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

    // Create a new RPT
    const newRPT = await prisma.rPT.create({
      data: {
        TaxDecNo,
        PaymentMode,
        DueDate,
        Status,
        custodianRemarks,
      },
    });

    return NextResponse.json(newRPT, { status: 201 }); // 201 Created
  } catch (error) {
    console.error('Error creating RPT:', error);
    
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
    }
  }
}

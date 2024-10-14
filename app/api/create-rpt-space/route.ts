import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { TaxDecNo, PaymentMode, DueDate, Status, custodianRemarks, spaceId } = body

    const newRPT = await prisma.rPT.create({
      data: {
        TaxDecNo,
        PaymentMode,
        DueDate,
        Status,
        custodianRemarks,
        space: { connect: { id: spaceId } }
      },
    })

    return NextResponse.json(newRPT)
  } catch (error) {
    console.error('Error creating RPT:', error)
    return NextResponse.json({ error: 'Error creating RPT' }, { status: 500 })
  }
}
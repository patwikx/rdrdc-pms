import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const {
    propertyCode,
    propertyName,
    titleNo,
    lotNo,
    registeredOwner,
    address,
    city,
    province,
    propertyType,
  } = await req.json(); // Use await to parse JSON from the request

  try {
    // Create the property
    const property = await prisma.property.create({
      data: {
        propertyCode,
        propertyName,
        titleNo,
        lotNo,
        registeredOwner,
        address,
        city,
        province,
        propertyType,
      },
    });
    return NextResponse.json({ property }, { status: 201 }); // Use NextResponse.json to send the response
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'An error occurred while creating the property and related records.' }, { status: 500 });
  }
}

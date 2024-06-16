import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selectedPropertyId } = body; // Extract userId from the request body

    if (!selectedPropertyId) {
      throw new Error('userId is missing in the request');
    }

    // Fetch leaves associated with the userId
    const rpties = await prisma.rPT.findMany({
      where: { propertyId: selectedPropertyId },
    
    });

    
    // Return the fetched leaves data
    return NextResponse.json({
      status: 'success',
      rpties,
    });
  } catch (error) {
    console.error("Error during leaves fetching:", error);
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching leaves',
    }, { status: 500 });
  }
}

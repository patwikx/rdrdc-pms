import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all properties from the database
    const custodians = await prisma.user.findMany({
          select: {
            id: true,
            firstName: true,
            lastName: true
          }
    });

    // Return the fetched properties
    return NextResponse.json({
      status: 'success',
      custodians,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching approvers',
    }, { status: 500 });
  }
}
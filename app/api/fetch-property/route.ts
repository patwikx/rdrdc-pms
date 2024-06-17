"use server"

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all properties from the database with the related company information
    const properties = await prisma.property.findMany({
      select: {
        id: true,
        propertyCode: true,
        propertyName: true,
        titleNo: true,
        lotNo: true,
        registeredOwner: true,
        address: true,
        province: true,
        city: true,
        company: {
          select: {
            companyName: true, // Select the companyName from the company relation
          },
        },
        custodian : {
          select: {
            firstName: true,
            lastName: true
          }
        },
        rpt : {
          select: {
            id: true,
            TaxDecNo: true,
            PaymentMode: true,
            DueDate: true,
            Status: true,
            custodianRemarks: true,
            updatedBy: true,  
          }
        }
      },
    });

    // Return the fetched properties with the company information
    return NextResponse.json({
      status: 'success',
      properties,    
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'An error occurred while fetching properties',
    }, { status: 500 });
  }
}

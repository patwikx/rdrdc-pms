import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // assuming prisma is set up correctly

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        image: true,
        role: true,
        address: true,
        department: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.json({ error: 'Unable to fetch user data' }, { status: 500 });
  }
}

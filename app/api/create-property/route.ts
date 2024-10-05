import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
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
    } = req.body;

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
      return res.status(201).json({
        property,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'An error occurred while creating the property and related records.' });
    }
  } else {
    return res.setHeader('Allow', ['POST']).status(405).end(`Method ${req.method} Not Allowed`);
  }
}

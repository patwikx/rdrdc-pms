import { PaymentStatus, PaymentType } from "@prisma/client";
import { z } from "zod"

const companySchema = z.object({
  id: z.string(),
  companyName: z.string()
})

const userSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  image: z.string(),
});

const RPTSchema = z.object({
  id: z.string(),
  TaxDecNo: z.string(),
  PaymentMode: z.enum([PaymentType.Annual, PaymentType.Quarterly]),
  DueDate: z.string(),
  Status: z.enum([PaymentStatus.Paid, PaymentStatus.Unpaid]),
  custodianRemarks: z.string(),
  updatedBy: z.string().optional(),
  propertyId: z.string()
})

export const propertySchema = z.object({
  id: z.string(),
  propertyCode: z.string(),
  propertyName: z.string(),
  titleNo: z.string(),
  lotNo: z.string(),
  registeredOwner: z.string(),
  address: z.string(),
  city: z.string(),
  province: z.string(),
  company: companySchema,
  custodian: userSchema,
  rpt: z.array(RPTSchema)
});

export type Properties = z.infer<typeof propertySchema>;
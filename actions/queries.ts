'use server'

import {  CreatePropertySchema, CreateRPTSchema, NewPasswordSchema, RegisterTenantSchema, RegisterUserSchema, ResetSchema, SettingsSchema, UpdatePropertySchema, UpdateRPTSchema } from "@/schemas";
import { prisma } from "@/lib/db";
import {  getUserByEmail, getUserById } from "@/data/user";
import {  sendPasswordResetEmail, sendVerificationEmail } from "@/lib/mail";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { currentUser } from "@/lib/auth";
import { generatePasswordResetToken, generateVerificationToken } from "@/lib/tokens";
import bcrypt from "bcryptjs";
import { update } from "@/auth";
import { getVerificationTokenByToken } from "@/data/verificiation-token";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { PaymentStatus, PaymentType, Prisma } from "@prisma/client";


  export const settings = async (
    values: z.infer<typeof SettingsSchema>
  ) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" }
    }
  
    const dbUser = await getUserById(user.id);
  
    if (!dbUser) {
      return { error: "Unauthorized" }
    }
  
    if (user.isOAuth) {
      values.email = undefined;
      values.password = undefined;
      values.newPassword = undefined;
      values.isTwoFactorEnabled = undefined;
    }
  
    if (values.email && values.email !== user.email) {
      const existingUser = await getUserByEmail(values.email);
  
      if (existingUser && existingUser.id !== user.id) {
        return { error: "Email already in use!" }
      }
  
      const verificationToken = await generateVerificationToken(
        values.email
      );
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
      );
  
      return { success: "Verification email sent!" };
    }
  
    if (values.password && values.newPassword && dbUser.password) {
      const passwordsMatch = await bcrypt.compare(
        values.password,
        dbUser.password,
      );
  
      if (!passwordsMatch) {
        return { error: "Incorrect password!" };
      }
  
      const hashedPassword = await bcrypt.hash(
        values.newPassword,
        10,
      );
      values.password = hashedPassword;
      values.newPassword = undefined;
    }
  
    const updatedUser = await prisma.user.update({
      where: { id: dbUser.id },
      data: {
        ...values,
      }
    });
  
    update({
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        isTwoFactorEnabled: updatedUser.isTwoFactorEnabled,
      }
    });
  
    return { success: "Settings Updated!" }
  }

  export const reset = async (values: z.infer<typeof ResetSchema>) => {
    const validatedFields = ResetSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid emaiL!" };
    }
  
    const { email } = validatedFields.data;
  
    const existingUser = await getUserByEmail(email);
  
    if (!existingUser) {
      return { error: "Email not found!" };
    }
  
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token,
    );
  
    return { success: "Reset email sent!" };
  }

  export const newVerification = async (token: string) => {
    const existingToken = await getVerificationTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Token does not exist!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" };
    }
  
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { 
        emailVerified: new Date(),
        email: existingToken.email,
      }
    });
  
    await prisma.verificationToken.delete({
      where: { id: existingToken.id }
    });
  
    return { success: "Email verified!" };
  };
  

  export const newPassword = async (
    values: z.infer<typeof NewPasswordSchema> ,
    token?: string | null,
  ) => {
    if (!token) {
      return { error: "Missing token!" };
    }
  
    const validatedFields = NewPasswordSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { password } = validatedFields.data;
  
    const existingToken = await getPasswordResetTokenByToken(token);
  
    if (!existingToken) {
      return { error: "Invalid token!" };
    }
  
    const hasExpired = new Date(existingToken.expires) < new Date();
  
    if (hasExpired) {
      return { error: "Token has expired!" };
    }
  
    const existingUser = await getUserByEmail(existingToken.email);
  
    if (!existingUser) {
      return { error: "Email does not exist!" }
    }
  
    const hashedPassword = await bcrypt.hash(password, 10);
  
    await prisma.user.update({
      where: { id: existingUser.id },
      data: { password: hashedPassword },
    });
  
    await prisma.passwordResetToken.delete({
      where: { id: existingToken.id }
    });
  
    return { success: "Password updated!" };
  };




  export const createProperty = async (values: z.infer<typeof CreatePropertySchema>) => {
    const validatedFields = CreatePropertySchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { propertyCode, propertyName, titleNo, lotNo, registeredOwner, address, city, province, propertyType } = validatedFields.data;
  
    await prisma.property.create({
      data: {
        propertyCode,
        propertyName,
        titleNo,
        lotNo,
        registeredOwner,
        address,
        city,
        province,
        propertyType
      }
    });
    revalidatePath('/properties')
    return { success: "Property created successfully!" };
  };


  export const registerUser = async (values: z.infer<typeof RegisterUserSchema>) => {
    const validatedFields = RegisterUserSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { email, password, firstName, lastName, contactNo, address, role, } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const existingUser = await getUserByEmail(email);
  
    if (existingUser) {
      return { error: "Email already in use!" };
    }
  
    await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNo,
        address,
        role
      },
    });

    const verificationToken = await generateVerificationToken(email);
    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );
  
    return { success: "Confirmation email sent!" };
  };

  export const registerTenant = async (values: z.infer<typeof RegisterTenantSchema>) => {
    const validatedFields = RegisterTenantSchema.safeParse(values);
  
    if (!validatedFields.success) {
      return { error: "Invalid fields!" };
    }
  
    const { email, password, firstName, lastName, contactNo, address, role, } = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);
  
    const existingTenant = await getUserByEmail(email);
  
    if (existingTenant) {
      return { error: "Email already in use!" };
    }
  
    await prisma.tenant.create({
      data: {
        firstName,
        lastName,
        email,
        password: hashedPassword,
        contactNo,
        address,
        role
      },
    });


    return { success: "Confirmation email sent!" };
  };

  export const fetchProperties = async () => {
    try {
      const properties = await prisma.property.findMany({
        select: {
          id: true,
          propertyCode: true,
          propertyName: true,
          titleNo: true,
          lotNo: true,
          registeredOwner: true,
          address: true,
          city: true,
          province: true,
        }
      });
      return properties;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };
  
  
  export const UpdateRPT = async (values: Prisma.RPTUpsertArgs['create']) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    try {
      const existingRPT = await prisma.rPT.findUnique({
        where: { id: values.id },
      });
  
      if (!existingRPT) {
        // If no existing RPT found, create a new one
        const newRPT = await prisma.rPT.create({
          data: {
            ...values, // Include all fields from values
          },
        });
  
        revalidatePath('/dashboard/property-management'); // Perform any necessary revalidation
  
        return { success: "RPT created successfully!" };
      } else {
        // If existing RPT found, update it
        const updatedRPT = await prisma.rPT.update({
          where: { id: values.id },
          data: {
            TaxDecNo: values.TaxDecNo,
            PaymentMode: values.PaymentMode as PaymentType,
            DueDate: values.DueDate,
            Status: values.Status as PaymentStatus,
            custodianRemarks: values.custodianRemarks,
            updatedBy: values.updatedBy,
          },
        });
  
        revalidatePath('/dashboard/property-management'); // Perform any necessary revalidation
  
        return { success: "RPT updated successfully!" };
      }
    } catch (error) {
      console.error("Error updating or creating RPT:", error);
      return { error: "An error occurred while updating or creating the RPT details." };
    }
  };


  export const UpdateProperty = async (values: z.infer<typeof UpdatePropertySchema> & { id: string }) => {
    const user = await currentUser();
  
    if (!user) {
      return { error: "Unauthorized" };
    }
  
    try {
      const updatePropertyx = await prisma.property.update({
        where: { id: values.id }, 
        data: {
          propertyCode: values.propertyCode,
          propertyName: values.propertyName,
          titleNo: values.titleNo,
          lotNo: values.lotNo,
          registeredOwner: values.registeredOwner,
          address: values.address,
          city: values.city,
          province: values.province,
  
        },
      });
  
      revalidatePath('/dashboard')
      return { success: "Updated successfully!" };
    } catch (error) {
      return { error: "An error occurred while updating the property." };
    }
  };
  

  export const createRPT = async (values: z.infer<typeof CreateRPTSchema>) => {
    try {
      const validatedFields = CreateRPTSchema.safeParse(values);
  
      if (!validatedFields.success) {
        return { error: "Invalid fields!" };
      }
  
      const { TaxDecNo, PaymentMode, Status, DueDate, propertyId, updatedBy, custodianRemarks } = validatedFields.data;
  
      // Check if there is already an RPT record with the same propertyId
      const existingRPT = await prisma.rPT.findFirst({
        where: {
          propertyId: propertyId
        }
      });
  
      if (existingRPT) {
        return { error: "RPT details already exists for this property!" };
      }
  
      // Create the new RPT details
      await prisma.rPT.create({
        data: {
          TaxDecNo,
          PaymentMode,
          Status,
          DueDate,
          propertyId,
          updatedBy,
          custodianRemarks
        }
      });
  
      revalidatePath('/dashboard');
      return { success: "RPT Details created successfully!" };
    } catch (error) {
      console.error("Error creating RPT:", error);
      return { error: "An error occurred while creating the RPT details." };
    }
  };

  export const fetchTableProperties = async () => {
    try {
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
      return properties;
    } catch (error) {
      console.error('Error fetching leave data:', error);
      return [];
    }
  };


  export const fetchAllSystemUsers = async () => {
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
        }
      });
      return users;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return [];
    }
  };

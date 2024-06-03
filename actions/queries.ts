'use server'

import {  CreatePropertySchema, NewPasswordSchema, RegisterUserSchema, ResetSchema, SettingsSchema } from "@/schemas";
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
  
    const { propertyName, propertyCode, titleNo, lotNo, address, city, province, zipCode, propertyImage, createdBy } = validatedFields.data;
  
    await prisma.property.create({
      data: {
        propertyName,
        propertyCode,
        titleNo,
        lotNo,
        address,
        city,
        province,
        zipCode,
        propertyImage,
        createdBy
      },
    });
    revalidatePath('/dashboard/settings')
    return { success: "Property created successfully!" };
  };


  export const register = async (values: z.infer<typeof RegisterUserSchema>) => {
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
  
  
  
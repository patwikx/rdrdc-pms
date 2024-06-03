import { Resend } from "resend";

const resend = new Resend(`re_bQxU8NXu_N5axH9P58J2BM6PHriR94b9u`);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async (
  email: string,
  token: string
) => {
  await resend.emails.send({
    from: "info@rdhardware.net",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA code: ${token}</p>
    <p>This is an auto generated email. Please do not reply.</p>`
    
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`

  await resend.emails.send({
    from: "info@rdhardware.net",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password.</p>
    <p>This is an auto generated email. Please do not reply.</p>`
  });
};

export const sendLeaveNotif = async (
  email: string,
  leaveType: string,
  firstName: string | null,
  lastName: string | null,
  startDate: string,
  endDate: string
) => {

  const leaveLink = `${domain}/dashboard/leave`;

  await resend.emails.send({
    from: "leave-notification@rdhardware.net",
    to: email,
    subject: "Leave Application",
    html: `<p>Heads up! ${firstName} ${lastName} have sent a ${leaveType} application starting from ${startDate} to ${endDate}. <a href="${leaveLink}">Click here to view the leave request.</a> </p>
    <p>This is an auto generated email. Please do not reply.</p>`
  });
};

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "info@rdhardware.net",
    to: email,
    subject: "Confirm your email",
    html: `<p>Click <a href="${confirmLink}">here</a> to confirm email.</p>
    <p>This is an auto generated email. Please do not reply.</p>`
  });
};

export const sendUploadNotif = async (
  email: string,
  payslipFile: string,
  months: string,
  periods: string,
) => {
  await resend.emails.send({
    from: "payslip@rdhardware.net",
    to: email,
    subject: "Your Payslip",
    html: `<p>Your payslip for the ${periods} of ${months} has been uploaded. <a href="${payslipFile}"> Click here to view your payslip.</a></p>
           <p>This is an auto-generated email. Please do not reply.</p>`
  });
};

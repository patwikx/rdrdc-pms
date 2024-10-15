// /app/api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/mailv2'; // Adjust the path based on your project structure

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { to, name, subject, body: emailBody } = body;

        // Send the email
        await sendMail({
            to,
            name,
            subject,
            body: emailBody,
        });

        // Return success response
        return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
    } catch (error) {
        console.error("Email sending error:", error);
        return NextResponse.json({ message: 'Failed to send email' }, { status: 500 });
    }
}

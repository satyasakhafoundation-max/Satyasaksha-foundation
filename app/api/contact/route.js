import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/mongodb';
import ContactMessage from '@/models/ContactMessage';

export const dynamic = 'force-dynamic';

const SUBJECT_LABELS = {
  general: 'General Inquiry',
  volunteer: 'Volunteering',
  partner: 'Partnership',
  rescue: 'Animal Rescue Report',
};

// POST /api/contact — Public (submit contact form)
export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Basic validation
    if (!name?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: 'Name, email, and message are required.' }, { status: 400 });
    }
    if (message.length > 2000) {
      return NextResponse.json({ error: 'Message is too long (max 2000 characters).' }, { status: 400 });
    }

    await dbConnect();

    // Save to MongoDB
    await ContactMessage.create({ name: name.trim(), email: email.trim().toLowerCase(), subject: subject || 'general', message: message.trim() });

    // Optional: send email notification if RESEND_API_KEY is configured
    if (process.env.RESEND_API_KEY) {
      try {
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Satyasaksha Website <noreply@satyasakshafoundation.org>',
            to: ['contact@satyasakshafoundation.org'],
            subject: `New Contact Form Submission: ${SUBJECT_LABELS[subject] || subject}`,
            html: `
              <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0D1A0D; border-bottom: 2px solid #C9A84C; padding-bottom: 12px;">New Contact Form Message</h2>
                <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
                  <tr><td style="padding: 8px 0; color: #6B7280; width: 100px;"><strong>Name</strong></td><td style="padding: 8px 0;">${name}</td></tr>
                  <tr><td style="padding: 8px 0; color: #6B7280;"><strong>Email</strong></td><td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td></tr>
                  <tr><td style="padding: 8px 0; color: #6B7280;"><strong>Subject</strong></td><td style="padding: 8px 0;">${SUBJECT_LABELS[subject] || subject}</td></tr>
                </table>
                <div style="margin-top: 20px; padding: 16px; background: #F3EFE6; border-radius: 8px; border-left: 4px solid #C9A84C;">
                  <strong style="color: #0D1A0D;">Message:</strong>
                  <p style="margin-top: 8px; color: #1F2937; line-height: 1.6; white-space: pre-wrap;">${message}</p>
                </div>
                <p style="margin-top: 20px; font-size: 12px; color: #9CA3AF;">This message was submitted via the Satyasaksha Foundation website contact form.</p>
              </div>
            `,
          }),
        });
      } catch (emailError) {
        // Email failure is non-fatal — message is already saved to DB
        console.warn('[Contact API] Email notification failed (non-fatal):', emailError.message);
      }
    }

    return NextResponse.json({ success: true, message: 'Your message has been received. We will get back to you soon.' });

  } catch (error) {
    console.error('[Contact API] Error:', error);
    return NextResponse.json({ error: 'Failed to send message. Please try again.' }, { status: 500 });
  }
}

// GET /api/contact — Admin only (view all messages)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages.' }, { status: 500 });
  }
}

// PATCH /api/contact — Admin only (mark as read/unread)
export async function PATCH(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { id, isRead } = await request.json();
    const msg = await ContactMessage.findByIdAndUpdate(id, { isRead }, { new: true });
    if (!msg) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    return NextResponse.json(msg);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update message.' }, { status: 500 });
  }
}

// DELETE /api/contact?id=xxx — Admin only
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const msg = await ContactMessage.findByIdAndDelete(id);
    if (!msg) return NextResponse.json({ error: 'Message not found.' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message.' }, { status: 500 });
  }
}

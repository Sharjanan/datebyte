import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) {
    console.error('Missing Resend API key or admin email');
    return NextResponse.json({ success: false, error: 'Missing email configuration' }, { status: 500 });
  }

  try {
    const data = await request.json()

    await resend.emails.send({
      from: 'DateByte <onboarding@resend.dev>',
      to: process.env.ADMIN_EMAIL,
      subject: '💕 New Date Response!',
      html: `
        <h1>She responded!</h1>
        <p>Day: ${data.date}</p>
        <p>Time: ${data.time}</p>
        <p>Activities: ${data.activities.join(', ')}</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: unknown) {
    console.error('Failed to send email:', error)
    if (error instanceof Error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
    return NextResponse.json({ success: false, error: 'An unknown error occurred' }, { status: 500 })
  }
}

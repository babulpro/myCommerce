// app/api/send-email/route.js
 
import { NextResponse } from 'next/server';
import React from 'react';
import { Resend } from 'resend';
 

const resend = new Resend(process.env.sendMessage); // Correct env variable name

export async function POST(request) {
  try {
    // Get data from request body
    const { email, firstName } = await request.json();

    const { data, error } = await resend.emails.send({
      from: 'NextShop <onboarding@resend.dev>', // Use your preferred sender
      to: ["sh8657706@gmail.com"], // Use dynamic email
      subject: 'Welcome to NextShop!',
     html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #0070f3; color: white; padding: 20px; text-align: center; }
            .content { padding: 30px; background-color: #f9f9f9; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to NextShop!</h1>
            </div>
            <div class="content">
              <h2>Hello, ${firstName || 'User'}!</h2>
              <p>Thank you for joining NextShop. We're excited to have you on board.</p>
              <p>Start exploring our products today!</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `Welcome to NextShop, ${firstName || 'User'}! Thank you for joining us.`, 
       // Correct way to pass React component
    });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      data,
      message: 'Email sent successfully!' 
    });
  } catch (error) {
    console.error('Email sending error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to send email' 
    }, { status: 500 });
  }
}
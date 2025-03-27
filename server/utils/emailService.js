import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a password reset email with a secure link.
 * @param {string} to - Recipient's email.
 * @param {string} resetLink - Password reset URL.
 */
export async function sendResetEmail(to, resetLink) {
    try {
        const { error } = await resend.emails.send({
            from: 'Gesture Garage <onboarding@resend.dev>',
            to,
            subject: 'Reset Your Password',
            html: `
        <p>You requested a password reset.</p>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link will expire in 1 hour.</p>
      `,
        });

        if (error) {
            console.error('Email error:', error);
            throw new Error('Failed to send email.');
        }
    } catch (err) {
        throw err;
    }
}

/**
 * Sends a welcome email to a newly registered user.
 * @param {string} to - Recipient's email.
 * @param {string} username - Recipient's username.
 */
export async function sendWelcomeEmail(to, username) {
    try {
        const { error } = await resend.emails.send({
            from: 'Gesture Garage <onboarding@resend.dev>', // or your verified sender
            to,
            subject: 'Welcome to Gesture Garage!',
            html: `
          <h2>Hey ${username}, welcome!</h2>
          <p>Thanks for signing up. You're all set to start using Gesture Garage.</p>
          <br />
          <p>– The Gesture Garage Team</p>
        `,
        });

        if (error) {
            console.error('Error sending welcome email:', error);
        }
    } catch (err) {
        console.error('Unexpected error sending welcome email:', err);
    }
}
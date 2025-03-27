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
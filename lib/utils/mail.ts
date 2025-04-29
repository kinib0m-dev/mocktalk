import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

const path =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:3000"
    : process.env.NEXT_PUBLIC_APP_URL;

const emailTemplate = (
  title: string,
  content: string,
  buttonText?: string,
  buttonLink?: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title} | MockTalk</title>
      <style>
        :root {
          --primary: #0090ff;
          --primary-dark: #0072cc;
          --background: #ffffff;
          --foreground: #111827;
          --muted: #f3f4f6;
          --muted-foreground: #6b7280;
          --border: #e5e7eb;
          --card: #ffffff;
          --card-foreground: #111827;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          line-height: 1.6;
          color: var(--foreground);
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
        }
        
        .email-container {
          max-width: 600px;
          margin: 24px auto;
          background-color: var(--background);
          border: 1px solid var(--border);
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        
        .email-header {
          padding: 24px;
          text-align: center;
          background-color: var(--background);
          border-bottom: 1px solid var(--border);
        }
        
        .logo {
          height: 40px;
        }
        
        .email-body {
          padding: 32px 24px;
          color: var(--foreground);
        }
        
        .email-heading {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 16px;
          color: var(--foreground);
        }
        
        .email-content {
          font-size: 16px;
          margin-bottom: 24px;
          color: var(--foreground);
        }
        
        .email-button {
          display: inline-block;
          background-color: var(--primary);
          color: white;
          font-weight: 500;
          font-size: 16px;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          margin-top: 16px;
          transition: background-color 0.2s ease;
        }
        
        .email-button:hover {
          background-color: var(--primary-dark);
        }
        
        .email-code {
          display: inline-block;
          font-family: monospace;
          background-color: var(--muted);
          border-radius: 6px;
          padding: 16px 24px;
          font-size: 24px;
          font-weight: 600;
          letter-spacing: 2px;
          margin: 16px 0;
          color: var(--primary);
          border: 1px solid var(--border);
        }
        
        .email-footer {
          background-color: var(--muted);
          padding: 24px;
          text-align: center;
          color: var(--muted-foreground);
          font-size: 14px;
          border-top: 1px solid var(--border);
        }
        
        .footer-links {
          margin-bottom: 12px;
        }
        
        .footer-links a {
          color: var(--muted-foreground);
          text-decoration: underline;
          margin: 0 8px;
        }
        
        @media screen and (max-width: 600px) {
          .email-container {
            width: 100%;
            margin: 0;
            border-radius: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <img src="${path}/icons/logo-full.svg" alt="MockTalk" class="logo" />
        </div>
        <div class="email-body">
          <h1 class="email-heading">${title}</h1>
          <div class="email-content">${content}</div>
          ${
            buttonText && buttonLink
              ? `<a href="${buttonLink}" class="email-button">${buttonText}</a>`
              : ""
          }
        </div>
        <div class="email-footer">
          <div class="footer-links">
            <a href="${path}/help">Help</a>
            <a href="${path}/privacy">Privacy</a>
            <a href="${path}/terms">Terms</a>
          </div>
          <p>© ${new Date().getFullYear()} MockTalk. All rights reserved.</p>
          <p>If you did not request this email, please ignore it or <a href="${path}/contact">contact support</a>.</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export async function sendVerificationEmail(email: string, token: string) {
  const confirmLink = `${path}/new-verification?token=${token}`;

  await resend.emails.send({
    from: "MockTalk <noreply@mocktalk.dev>",
    to: email,
    subject: "Verify your MockTalk account",
    html: emailTemplate(
      "Verify your email address",
      `<p>Thanks for signing up for MockTalk! To get started with your interview preparation, please verify your email address.</p>
      <p>This verification link will expire in 24 hours.</p>`,
      "Verify Email",
      confirmLink
    ),
  });
}

export async function sendResetPasswordEmail(email: string, token: string) {
  const resetLink = `${path}/new-password?token=${token}`;

  await resend.emails.send({
    from: "MockTalk <noreply@mocktalk.dev>",
    to: email,
    subject: "Reset your MockTalk password",
    html: emailTemplate(
      "Reset your password",
      `<p>We received a request to reset the password for your MockTalk account.</p>
      <p>If you didn't make this request, you can safely ignore this email.</p>
      <p>This password reset link will expire in 1 hour.</p>`,
      "Reset Password",
      resetLink
    ),
  });
}

export async function sendTwoFactorTokenEmail(email: string, token: string) {
  await resend.emails.send({
    from: "MockTalk <noreply@mocktalk.dev>",
    to: email,
    subject: "Your MockTalk verification code",
    html: emailTemplate(
      "Your verification code",
      `<p>To complete your sign-in, please enter the following verification code:</p>
      <div style="text-align: center;">
        <div class="email-code">${token}</div>
      </div>
      <p>This code will expire in 10 minutes.</p>
      <p>If you didn't request this code, please secure your account by changing your password immediately.</p>`
    ),
  });
}

export default resend;

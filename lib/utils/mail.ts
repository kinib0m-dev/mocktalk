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
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>${title} | MockTalk</title>
    <style>
      body {
        margin: 0;
        padding: 0;
        background-color: #f0f2f5;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        color: #111827;
      }

      .email-container {
        max-width: 600px;
        margin: 40px auto;
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
        overflow: hidden;
      }

      .email-header {
        background-color: #ffffff;
        padding: 24px;
        text-align: center;
        border-bottom: 1px solid #e5e7eb;
      }

      .email-header img {
        height: 40px;
      }

      .email-body {
        padding: 32px 24px;
      }

      .email-heading {
        font-size: 22px;
        font-weight: 600;
        margin-bottom: 16px;
      }

      .email-content {
        font-size: 16px;
        line-height: 1.5;
        margin-bottom: 24px;
      }

      .email-button {
        display: inline-block;
        padding: 12px 20px;
        background-color: #0090ff;
        color: #ffffff;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 500;
        font-size: 16px;
      }

      .email-button:hover {
        background-color: #0072cc;
      }

      .email-footer {
        background-color: #f9fafb;
        color: #6b7280;
        text-align: center;
        font-size: 13px;
        padding: 24px;
        border-top: 1px solid #e5e7eb;
      }

      .footer-links a {
        color: #6b7280;
        margin: 0 6px;
        text-decoration: underline;
      }

      @media (max-width: 600px) {
        .email-body {
          padding: 24px 16px;
        }
        .email-button {
          display: block;
          width: 100%;
          text-align: center;
        }
      }
    </style>
  </head>
  <body>
    <div class="email-container">
      <div class="email-header">
        <img src="https://mocktalk.dev/icons/logo-full.svg" alt="MockTalk" />
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
          <a href="${path}/help">Help</a> |
          <a href="${path}/privacy">Privacy</a> |
          <a href="${path}/terms">Terms</a>
        </div>
        <p>© ${new Date().getFullYear()} MockTalk. All rights reserved.</p>
        <p>If you didn’t request this email, please ignore it or <a href="${path}/contact">contact support</a>.</p>
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

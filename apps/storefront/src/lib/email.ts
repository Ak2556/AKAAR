import nodemailer from "nodemailer";

// Create transporter - supports multiple providers
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

const FROM_EMAIL = process.env.FROM_EMAIL || "noreply@akaar.com";
const COMPANY_NAME = "Akaar 3D Printing Solutions";

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail(options: EmailOptions) {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    console.log("Email not configured, skipping:", options.subject);
    return { success: false, reason: "Email not configured" };
  }

  try {
    await transporter.sendMail({
      from: `"${COMPANY_NAME}" <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to send email:", error);
    throw error;
  }
}

// Email Templates
const baseTemplate = (content: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: #fff; }
    .header { background: #0a0a0a; color: #00fff5; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; }
    .content { padding: 30px; }
    .footer { background: #f5f5f5; padding: 20px; text-align: center; font-size: 12px; color: #666; }
    .button { display: inline-block; padding: 12px 24px; background: #00fff5; color: #0a0a0a; text-decoration: none; border-radius: 4px; font-weight: bold; }
    .order-item { border-bottom: 1px solid #eee; padding: 15px 0; }
    .order-total { font-size: 18px; font-weight: bold; color: #00fff5; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px; text-align: left; border-bottom: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>AKAAR</h1>
      <p style="margin: 5px 0 0; font-size: 12px;">We Give AKAAR to Ideas</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} ${COMPANY_NAME}. All rights reserved.</p>
      <p>Questions? Contact us at hello@akaar.com</p>
    </div>
  </div>
</body>
</html>
`;

// Order Confirmation Email
interface OrderConfirmationData {
  to: string;
  orderNumber: string;
  items: Array<{ name: string; quantity: number; unitPrice: any; totalPrice: any }>;
  total: number;
  shippingAddress: any;
}

export async function sendOrderConfirmationEmail(data: OrderConfirmationData) {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td>${item.name}</td>
      <td>${item.quantity}</td>
      <td>₹${Number(item.unitPrice).toLocaleString('en-IN')}</td>
      <td>₹${Number(item.totalPrice).toLocaleString('en-IN')}</td>
    </tr>
  `).join('');

  const address = data.shippingAddress;
  const addressHtml = `
    ${address.firstName} ${address.lastName}<br>
    ${address.address}${address.apartment ? `, ${address.apartment}` : ''}<br>
    ${address.city}, ${address.state} ${address.zip}<br>
    ${address.country}
  `;

  const html = baseTemplate(`
    <h2>Order Confirmed!</h2>
    <p>Thank you for your order. We've received your payment and are processing your order.</p>

    <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <strong>Order Number:</strong> ${data.orderNumber}
    </div>

    <h3>Order Items</h3>
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Qty</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        ${itemsHtml}
      </tbody>
    </table>

    <div style="text-align: right; margin-top: 20px;">
      <p class="order-total">Total: ₹${data.total.toLocaleString('en-IN')}</p>
    </div>

    <h3>Shipping Address</h3>
    <p>${addressHtml}</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" class="button">Track Your Order</a>
    </div>
  `);

  return sendEmail({
    to: data.to,
    subject: `Order Confirmed - ${data.orderNumber}`,
    html,
  });
}

// Quote Received Email
interface QuoteReceivedData {
  to: string;
  quoteNumber: string;
  name: string;
  service: string;
  material: string;
  quantity: number;
}

export async function sendQuoteReceivedEmail(data: QuoteReceivedData) {
  const html = baseTemplate(`
    <h2>Quote Request Received</h2>
    <p>Hi ${data.name},</p>
    <p>Thank you for your quote request. Our team will review your requirements and get back to you within 24-48 hours.</p>

    <div style="background: #f9f9f9; padding: 15px; border-radius: 4px; margin: 20px 0;">
      <strong>Quote Reference:</strong> ${data.quoteNumber}
    </div>

    <h3>Request Details</h3>
    <table>
      <tr><td><strong>Service:</strong></td><td>${data.service}</td></tr>
      <tr><td><strong>Material:</strong></td><td>${data.material}</td></tr>
      <tr><td><strong>Quantity:</strong></td><td>${data.quantity} units</td></tr>
    </table>

    <p style="margin-top: 20px;">We'll analyze your files and provide you with accurate pricing and lead times.</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/quotes" class="button">View Quote Status</a>
    </div>
  `);

  return sendEmail({
    to: data.to,
    subject: `Quote Request Received - ${data.quoteNumber}`,
    html,
  });
}

// Password Reset Email
interface PasswordResetData {
  to: string;
  name: string;
  resetUrl: string;
}

export async function sendPasswordResetEmail(data: PasswordResetData) {
  const html = baseTemplate(`
    <h2>Reset Your Password</h2>
    <p>Hi ${data.name || 'there'},</p>
    <p>We received a request to reset your password. Click the button below to create a new password:</p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="${data.resetUrl}" class="button">Reset Password</a>
    </div>

    <p style="font-size: 14px; color: #666;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
  `);

  return sendEmail({
    to: data.to,
    subject: "Reset Your Password - Akaar",
    html,
  });
}

// Welcome Email
interface WelcomeEmailData {
  to: string;
  name: string;
}

export async function sendWelcomeEmail(data: WelcomeEmailData) {
  const html = baseTemplate(`
    <h2>Welcome to Akaar!</h2>
    <p>Hi ${data.name},</p>
    <p>Thank you for creating an account with us. We're excited to help bring your ideas to life with our precision 3D printing services.</p>

    <h3>What's Next?</h3>
    <ul>
      <li>Browse our <a href="${process.env.NEXT_PUBLIC_APP_URL}/products">product catalog</a></li>
      <li>Get an <a href="${process.env.NEXT_PUBLIC_APP_URL}/quote">instant quote</a> for your project</li>
      <li>Learn about our <a href="${process.env.NEXT_PUBLIC_APP_URL}/services">services</a></li>
    </ul>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/products" class="button">Explore Products</a>
    </div>
  `);

  return sendEmail({
    to: data.to,
    subject: "Welcome to Akaar - We Give AKAAR to Ideas",
    html,
  });
}

// Contact Form Email (to admin)
interface ContactFormData {
  name: string;
  email: string;
  company?: string;
  department: string;
  subject: string;
  message: string;
}

export async function sendContactFormEmail(data: ContactFormData) {
  const adminEmail = process.env.ADMIN_EMAIL || "hello@akaar.com";

  const html = baseTemplate(`
    <h2>New Contact Form Submission</h2>

    <table>
      <tr><td><strong>From:</strong></td><td>${data.name} (${data.email})</td></tr>
      <tr><td><strong>Company:</strong></td><td>${data.company || 'N/A'}</td></tr>
      <tr><td><strong>Department:</strong></td><td>${data.department}</td></tr>
      <tr><td><strong>Subject:</strong></td><td>${data.subject}</td></tr>
    </table>

    <h3>Message</h3>
    <div style="background: #f9f9f9; padding: 15px; border-radius: 4px;">
      ${data.message.replace(/\n/g, '<br>')}
    </div>

    <p style="margin-top: 20px;">
      <a href="mailto:${data.email}">Reply to ${data.name}</a>
    </p>
  `);

  return sendEmail({
    to: adminEmail,
    subject: `[Contact] ${data.subject} - ${data.department}`,
    html,
  });
}

// Order Status Update Email
interface OrderStatusUpdateData {
  to: string;
  orderNumber: string;
  status: string;
  message?: string;
}

export async function sendOrderStatusEmail(data: OrderStatusUpdateData) {
  const statusMessages: Record<string, string> = {
    PROCESSING: "Your order is now being processed. Our team is preparing your items.",
    SHIPPED: "Great news! Your order has been shipped and is on its way.",
    DELIVERED: "Your order has been delivered. We hope you love it!",
    CANCELLED: "Your order has been cancelled. If you have questions, please contact us.",
  };

  const html = baseTemplate(`
    <h2>Order Status Update</h2>
    <p>Your order <strong>${data.orderNumber}</strong> status has been updated:</p>

    <div style="background: #f9f9f9; padding: 20px; border-radius: 4px; margin: 20px 0; text-align: center;">
      <h3 style="color: #00fff5; margin: 0;">${data.status}</h3>
    </div>

    <p>${data.message || statusMessages[data.status] || 'Your order status has been updated.'}</p>

    <div style="text-align: center; margin-top: 30px;">
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/orders" class="button">View Order Details</a>
    </div>
  `);

  return sendEmail({
    to: data.to,
    subject: `Order ${data.orderNumber} - ${data.status}`,
    html,
  });
}

export { sendEmail };

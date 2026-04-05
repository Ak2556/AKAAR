import Razorpay from "razorpay";

let razorpayInstance: Razorpay | null = null;

function getRazorpay(): Razorpay {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    throw new Error(
      "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET must be set to use Razorpay"
    );
  }
  if (!razorpayInstance) {
    razorpayInstance = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  }
  return razorpayInstance;
}

export interface CreateOrderOptions {
  amount: number; // Amount in paise (INR smallest unit)
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}

export async function createRazorpayOrder(options: CreateOrderOptions) {
  const razorpay = getRazorpay();
  const order = await razorpay.orders.create({
    amount: options.amount,
    currency: options.currency || "INR",
    receipt: options.receipt,
    notes: options.notes || {},
  });
  return order;
}

export async function verifyPaymentSignature(
  orderId: string,
  paymentId: string,
  signature: string
): Promise<boolean> {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) {
    throw new Error("RAZORPAY_KEY_SECRET must be set");
  }
  const crypto = await import("crypto");
  const body = orderId + "|" + paymentId;
  const expectedSignature = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return expectedSignature === signature;
}

export async function fetchPaymentDetails(paymentId: string) {
  const razorpay = getRazorpay();
  return await razorpay.payments.fetch(paymentId);
}

export async function refundPayment(paymentId: string, amount?: number) {
  const razorpay = getRazorpay();
  return await razorpay.payments.refund(paymentId, {
    amount: amount, // Optional: partial refund amount in paise
  });
}

/** Lazily initialized; prefer using the helper functions above. */
export function getRazorpayClient(): Razorpay {
  return getRazorpay();
}

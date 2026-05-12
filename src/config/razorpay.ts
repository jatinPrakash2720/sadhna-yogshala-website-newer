/**
 * Yogshala LMS — Razorpay Configuration
 * Initializes the Razorpay SDK instance for payment processing.
 */

import Razorpay from "razorpay";

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error("Please define RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local");
}

/**
 * Razorpay SDK instance — reused across API routes.
 */
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default razorpay;

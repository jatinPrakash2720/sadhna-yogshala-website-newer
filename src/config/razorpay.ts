/**
 * Yogshala LMS — Razorpay Configuration
 * Initializes the Razorpay SDK instance for payment processing.
 */

import Razorpay from "razorpay";

let instance: Razorpay | null = null;

function getRazorpayInstance(): Razorpay {
  if (!instance) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;

    if (!key_id || !key_secret) {
      throw new Error("Please define RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET in .env.local");
    }

    console.log(`[Razorpay] Initializing with Key ID: ${key_id.substring(0, 8)}...`);
    instance = new Razorpay({
      key_id,
      key_secret,
    });
  }
  return instance;
}

/**
 * Razorpay SDK instance — lazily initialized and reused across API routes.
 */
const razorpayProxy = new Proxy({} as Razorpay, {
  get(_target, prop) {
    const targetInstance = getRazorpayInstance();
    const value = Reflect.get(targetInstance, prop);
    if (typeof value === "function") {
      return value.bind(targetInstance);
    }
    return value;
  },
});

export default razorpayProxy;

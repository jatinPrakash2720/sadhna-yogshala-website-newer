import Razorpay from "razorpay";
import dotenv from "dotenv";
import path from "path";

// Load .env.local manually
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

async function testRazorpay() {
  const key_id = process.env.RAZORPAY_KEY_ID;
  const key_secret = process.env.RAZORPAY_KEY_SECRET;

  console.log("Testing Razorpay with:");
  console.log("Key ID:", key_id?.substring(0, 8) + "...");
  console.log("Key Secret:", key_secret?.substring(0, 4) + "...");

  if (!key_id || !key_secret) {
    console.error("Missing credentials in .env.local");
    return;
  }

  const razorpay = new Razorpay({
    key_id,
    key_secret,
  });

  try {
    console.log("Fetching orders...");
    const orders = await razorpay.orders.all({ count: 1 });
    console.log("Success! Razorpay connected.");
    console.log("Latest order count:", orders.items.length);
  } catch (error: any) {
    console.error("Razorpay Test Failed:");
    console.error("Status Code:", error.statusCode);
    console.error("Error Object:", JSON.stringify(error, null, 2));
    
    if (error.statusCode === 401) {
      console.error("\nSUGGESTION: Your Key ID or Secret is definitely incorrect.");
      console.error("1. Check for trailing spaces in .env.local");
      console.error("2. Ensure you are using TEST keys if in test mode.");
      console.error("3. Re-generate the keys from Razorpay dashboard if needed.");
    }
  }
}

testRazorpay();

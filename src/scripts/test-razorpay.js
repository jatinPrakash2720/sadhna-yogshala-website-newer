const Razorpay = require("razorpay");
const fs = require("fs");
const path = require("path");

// Manually parse .env.local to avoid dependencies
const envPath = path.resolve(process.cwd(), ".env.local");
const envContent = fs.readFileSync(envPath, "utf-8");
const env = {};
envContent.split("\n").forEach(line => {
  const parts = line.split("=");
  if (parts.length === 2) {
    env[parts[0].trim()] = parts[1].trim();
  }
});

async function testRazorpay() {
  const key_id = env.RAZORPAY_KEY_ID;
  const key_secret = env.RAZORPAY_KEY_SECRET;

  console.log("Testing Razorpay with:");
  console.log("Key ID:", key_id ? key_id.substring(0, 8) + "..." : "MISSING");
  console.log("Key Secret:", key_secret ? key_secret.substring(0, 4) + "..." : "MISSING");

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
  } catch (error) {
    console.error("Razorpay Test Failed:");
    console.error("Status Code:", error.statusCode);
    console.error("Error Detail:", JSON.stringify(error, null, 2));
  }
}

testRazorpay();

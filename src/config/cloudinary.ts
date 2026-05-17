/**
 * Yogshala LMS — Cloudinary Configuration
 * Initializes and exports the Cloudinary v2 client.
 * Server-side only — never import this in client components.
 */

import { v2 as cloudinary } from "cloudinary";

const requiredVars = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

let isConfigured = false;

function ensureConfigured() {
  if (isConfigured) return;

  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      throw new Error(`Missing required environment variable: ${varName}`);
    }
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true, // Always use HTTPS URLs
  });

  isConfigured = true;
}

// Export a proxy that configures Cloudinary lazily upon accessing any property or method
const cloudinaryProxy = new Proxy(cloudinary, {
  get(target, prop) {
    ensureConfigured();
    const value = Reflect.get(target, prop);
    if (typeof value === "function") {
      return value.bind(target);
    }
    return value;
  },
});

export default cloudinaryProxy;

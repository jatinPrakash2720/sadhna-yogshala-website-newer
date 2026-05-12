/**
 * Yogshala LMS — Password Utility
 * Secure password hashing and comparison using bcryptjs.
 */

import bcrypt from "bcryptjs";
import { AUTH } from "@/constants";

/**
 * Hash a plain-text password with bcrypt.
 * Uses 12 salt rounds for strong security.
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  const salt = await bcrypt.genSalt(AUTH.SALT_ROUNDS);
  return bcrypt.hash(plainPassword, salt);
}

/**
 * Compare a plain-text password against a bcrypt hash.
 */
export async function comparePassword(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export default { hashPassword, comparePassword };

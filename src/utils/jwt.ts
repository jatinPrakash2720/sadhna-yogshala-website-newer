/**
 * Yogshala LMS — JWT Utility
 * Token generation and verification for custom auth flows.
 * Note: Primary auth is handled by Auth.js, but these are used
 * for password reset tokens and other one-off token needs.
 */

import { SignJWT, jwtVerify, type JWTPayload as JoseJWTPayload } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET || "fallback-secret");

/**
 * Generate a signed JWT token.
 */
export async function generateToken(
  payload: Record<string, unknown>,
  expiresIn: string = "1h"
): Promise<string> {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret);

  return token;
}

/**
 * Verify and decode a JWT token.
 * Returns the payload if valid, throws if invalid/expired.
 */
export async function verifyToken(
  token: string
): Promise<JoseJWTPayload & Record<string, unknown>> {
  const { payload } = await jwtVerify(token, secret);
  return payload as JoseJWTPayload & Record<string, unknown>;
}

export default { generateToken, verifyToken };

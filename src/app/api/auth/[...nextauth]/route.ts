/**
 * Yogshala LMS — Auth.js Route Handler
 * Catch-all route for Auth.js (NextAuth v5) endpoints.
 */

import { handlers } from "@/config/auth";

export const { GET, POST } = handlers;

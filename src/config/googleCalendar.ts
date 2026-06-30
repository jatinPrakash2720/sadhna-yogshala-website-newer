/**
 * Yogshala LMS — Google Calendar Configuration
 * JWT auth with Domain-Wide Delegation (service account + admin impersonation).
 *
 * Supports either:
 *   - GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY + GOOGLE_ADMIN_EMAIL
 *   - GOOGLE_APPLICATION_CREDENTIALS (path to service account JSON) + GOOGLE_ADMIN_EMAIL
 */

import fs from "fs";
import path from "path";
import { google } from "googleapis";
import type { calendar_v3 } from "googleapis";
import { GOOGLE_CALENDAR } from "@/constants";

interface ServiceAccountCredentials {
  email: string;
  key: string;
  subject: string;
}

function loadServiceAccountCredentials(): ServiceAccountCredentials {
  const subject = process.env.GOOGLE_ADMIN_EMAIL;
  const emailFromEnv = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const keyFromEnv = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");

  if (emailFromEnv && keyFromEnv && subject) {
    return { email: emailFromEnv, key: keyFromEnv, subject };
  }

  const credPath = process.env.GOOGLE_APPLICATION_CREDENTIALS;
  if (credPath && subject) {
    const resolved = path.isAbsolute(credPath)
      ? credPath
      : path.join(process.cwd(), credPath);

    if (fs.existsSync(resolved)) {
      const json = JSON.parse(fs.readFileSync(resolved, "utf8")) as {
        client_email?: string;
        private_key?: string;
      };

      const email = json.client_email ?? emailFromEnv;
      const key = json.private_key;

      if (email && key) {
        return { email, key, subject };
      }
    }
  }

  throw new Error(
    "Google Calendar credentials are not configured. Set GOOGLE_ADMIN_EMAIL plus either (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY) or GOOGLE_APPLICATION_CREDENTIALS pointing to your service account JSON file."
  );
}

export function getGoogleAuthClient() {
  const { email, key, subject } = loadServiceAccountCredentials();

  return new google.auth.JWT({
    email,
    key,
    scopes: [...GOOGLE_CALENDAR.SCOPES],
    subject,
  });
}

export function getCalendarClient(): calendar_v3.Calendar {
  return google.calendar({ version: "v3", auth: getGoogleAuthClient() });
}

export function getCalendarId(): string {
  return (
    process.env.GOOGLE_CALENDAR_ID ??
    process.env.GOOGLE_ADMIN_EMAIL ??
    "primary"
  );
}

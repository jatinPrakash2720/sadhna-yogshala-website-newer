/**
 * Yogshala LMS — Email Service
 * Renders React Email templates and sends via Resend.
 */

import { render } from "@react-email/render";
import { Resend } from "resend";
import type { ReactElement } from "react";
import { ClassReminderEmail } from "@/emails/templates/ClassReminderEmail";
import { WelcomeEmail } from "@/emails/templates/WelcomeEmail";
import type {
  EmailTemplateName,
  EmailTemplatePayloadMap,
  SendEmailParams,
  SendEmailResult,
} from "@/emails/types";

export type {
  EmailTemplateName,
  EmailTemplatePayloadMap,
  SendEmailParams,
  SendEmailResult,
} from "@/emails/types";

let resendClient: Resend | null = null;

function getResendClient(): Resend {
  if (!resendClient) {
    const apiKey = process.env.RESEND_API_KEY;

    if (!apiKey) {
      throw new Error("Please define RESEND_API_KEY in .env.local");
    }

    resendClient = new Resend(apiKey);
  }

  return resendClient;
}

function getEmailFrom(): string {
  const from = process.env.EMAIL_FROM;

  if (!from) {
    throw new Error("Please define EMAIL_FROM in .env.local");
  }

  return from;
}

function buildTemplateElement(
  templateName: EmailTemplateName,
  payload: EmailTemplatePayloadMap[EmailTemplateName]
): ReactElement {
  switch (templateName) {
    case "welcome":
      return WelcomeEmail(payload as EmailTemplatePayloadMap["welcome"]);
    case "class_reminder":
      return ClassReminderEmail(
        payload as EmailTemplatePayloadMap["class_reminder"]
      );
    default: {
      const exhaustiveCheck: never = templateName;
      throw new Error(`Unknown email template: ${exhaustiveCheck}`);
    }
  }
}

async function renderTemplate(
  templateName: EmailTemplateName,
  payload: EmailTemplatePayloadMap[EmailTemplateName]
): Promise<string> {
  const element = buildTemplateElement(templateName, payload);
  return render(element);
}

/**
 * Send a transactional email using a registered React Email template.
 *
 * @example
 * await sendEmail({
 *   to: "student@example.com",
 *   subject: "Welcome to Sadhna Yogshala",
 *   templateName: "welcome",
 *   payload: { studentName: "Priya", dashboardUrl: "https://..." },
 * });
 */
export async function sendEmail<T extends EmailTemplateName>(
  params: SendEmailParams<T>
): Promise<SendEmailResult> {
  const { to, subject, templateName, payload, replyTo } = params;

  try {
    const html = await renderTemplate(templateName, payload);
    const resend = getResendClient();

    const { data, error } = await resend.emails.send({
      from: getEmailFrom(),
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      ...(replyTo ? { replyTo } : {}),
    });

    if (error) {
      console.error("[EmailService] Resend API error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, messageId: data?.id };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unknown email send failure";
    console.error("[EmailService] Failed to send email:", message);
    return { success: false, error: message };
  }
}

export default sendEmail;

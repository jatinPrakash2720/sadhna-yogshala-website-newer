/**
 * Yogshala LMS — Email types
 * Central registry mapping template names to their payload shapes.
 */

import type { ClassReminderEmailProps } from "@/emails/templates/ClassReminderEmail";
import type { WelcomeEmailProps } from "@/emails/templates/WelcomeEmail";

export type EmailTemplateName = "welcome" | "class_reminder";

export interface EmailTemplatePayloadMap {
  welcome: WelcomeEmailProps;
  class_reminder: ClassReminderEmailProps;
}

export interface SendEmailParams<T extends EmailTemplateName = EmailTemplateName> {
  to: string | string[];
  subject: string;
  templateName: T;
  payload: EmailTemplatePayloadMap[T];
  replyTo?: string;
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

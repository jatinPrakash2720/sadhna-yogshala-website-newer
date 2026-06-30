import { Button, Heading, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface WelcomeEmailProps {
  studentName: string;
  dashboardUrl: string;
}

export function WelcomeEmail({ studentName, dashboardUrl }: WelcomeEmailProps) {
  return (
    <EmailLayout previewText={`Welcome to Sadhna Yogshala, ${studentName}!`}>
      <Heading className="m-0 mb-4 text-2xl font-semibold text-brand-900">
        Welcome, {studentName}!
      </Heading>

      <Text className="m-0 mb-4 text-base leading-6 text-earth-600">
        We&apos;re delighted to have you join the Sadhna Yogshala community.
        Your account is ready — explore your courses, track your progress, and
        join live sessions from your dashboard.
      </Text>

      <Text className="m-0 mb-6 text-base leading-6 text-earth-600">
        Take a moment to review your enrolled courses and upcoming class
        schedule so you never miss a session.
      </Text>

      <Button
        href={dashboardUrl}
        className="rounded-md bg-brand-600 px-6 py-3 text-center text-sm font-semibold text-white no-underline"
      >
        Go to Dashboard
      </Button>

      <Text className="m-0 mt-6 text-sm text-earth-500">
        If the button above doesn&apos;t work, copy and paste this link into
        your browser:
      </Text>
      <Text className="m-0 mt-1 break-all text-sm text-brand-600">
        {dashboardUrl}
      </Text>
    </EmailLayout>
  );
}

export default WelcomeEmail;

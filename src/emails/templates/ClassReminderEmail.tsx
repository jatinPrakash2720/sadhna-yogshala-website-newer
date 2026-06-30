import { Button, Heading, Section, Text } from "@react-email/components";
import { EmailLayout } from "@/emails/components/EmailLayout";

export interface ClassReminderEmailProps {
  studentName: string;
  className: string;
  meetingLink: string;
  time: string;
}

export function ClassReminderEmail({
  studentName,
  className,
  meetingLink,
  time,
}: ClassReminderEmailProps) {
  return (
    <EmailLayout
      previewText={`Reminder: ${className} starts at ${time}`}
    >
      <Heading className="m-0 mb-4 text-2xl font-semibold text-brand-900">
        Class Reminder
      </Heading>

      <Text className="m-0 mb-4 text-base leading-6 text-earth-600">
        Hi {studentName},
      </Text>

      <Text className="m-0 mb-4 text-base leading-6 text-earth-600">
        This is a friendly reminder that your upcoming class is scheduled soon.
      </Text>

      <Section className="mb-6 rounded-md bg-cream-100 px-5 py-4">
        <Text className="m-0 text-sm font-semibold uppercase tracking-wide text-brand-700">
          {className}
        </Text>
        <Text className="m-0 mt-2 text-base text-earth-600">
          <strong>When:</strong> {time}
        </Text>
      </Section>

      <Button
        href={meetingLink}
        className="rounded-md bg-brand-600 px-6 py-3 text-center text-sm font-semibold text-white no-underline"
      >
        Join Class
      </Button>

      <Text className="m-0 mt-6 text-sm text-earth-500">
        Meeting link:{" "}
        <span className="break-all text-brand-600">{meetingLink}</span>
      </Text>
    </EmailLayout>
  );
}

export default ClassReminderEmail;

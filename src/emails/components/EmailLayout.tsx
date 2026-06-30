import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";
import type { ReactNode } from "react";
import { emailTailwindConfig } from "@/emails/emailTailwindConfig";

const SUPPORT_EMAIL = "support@sadhnayogshala.com";
const STUDIO_ADDRESS = "Sadhna Yogshala, India";

interface EmailLayoutProps {
  previewText: string;
  children: ReactNode;
}

export function EmailLayout({ previewText, children }: EmailLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind config={emailTailwindConfig}>
        <Body className="bg-cream-50 font-sans">
          <Container className="mx-auto my-8 max-w-[560px] rounded-lg bg-white px-8 py-10 shadow-sm">
            <Section className="mb-8 text-center">
              <Text className="m-0 text-2xl font-bold tracking-tight text-brand-800">
                Sadhna Yogshala
              </Text>
              <Text className="m-0 mt-1 text-xs uppercase tracking-widest text-earth-500">
                Yoga · Wellness · Learning
              </Text>
            </Section>

            <Section>{children}</Section>

            <Hr className="my-8 border-earth-500/20" />

            <Section className="text-center">
              <Text className="m-0 text-xs leading-5 text-earth-500">
                {STUDIO_ADDRESS}
              </Text>
              <Text className="m-0 mt-2 text-xs text-earth-500">
                Questions?{" "}
                <Link
                  href={`mailto:${SUPPORT_EMAIL}`}
                  className="text-brand-600 no-underline"
                >
                  {SUPPORT_EMAIL}
                </Link>
              </Text>
              <Text className="m-0 mt-3 text-[11px] text-earth-500/80">
                <Link href="#" className="text-earth-500 underline">
                  Unsubscribe
                </Link>
                {" · "}
                You received this email because you have an account with Sadhna
                Yogshala.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

export default EmailLayout;

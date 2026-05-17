import type { Metadata } from "next";
import WorkshopBuilder from "@/components/workshops/WorkshopBuilder";

export const metadata: Metadata = {
  title: "Create Workshop | Admin - Sadhna Yogshala",
};

export default function CreateWorkshopPage() {
  return <WorkshopBuilder mode="create" />;
}

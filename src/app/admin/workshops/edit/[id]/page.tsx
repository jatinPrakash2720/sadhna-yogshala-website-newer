import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkshopBuilder from "@/components/workshops/WorkshopBuilder";
import { WorkshopService } from "@/services/workshop.service";

export const metadata: Metadata = {
  title: "Edit Workshop | Admin - Sadhna Yogshala",
};

export const dynamic = "force-dynamic";

export default async function EditWorkshopPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshop = await WorkshopService.getById(id);
  if (!workshop) return notFound();

  const data = JSON.parse(JSON.stringify(workshop));
  return (
    <WorkshopBuilder
      mode="edit"
      workshopId={id}
      initialData={{
        ...data,
        startDate: data.startDate?.slice(0, 10),
        endDate: data.endDate?.slice(0, 10),
      }}
    />
  );
}

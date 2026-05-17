import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WorkshopShowcaseClient from "@/components/workshops/WorkshopShowcaseClient";
import { WorkshopService } from "@/services/workshop.service";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const workshop = id.match(/^[0-9a-fA-F]{24}$/) ? await WorkshopService.getById(id) : await WorkshopService.getBySlug(id);
  if (!workshop) return { title: "Workshop Not Found | Sadhna Yogshala" };
  return {
    title: `${workshop.title} | Sadhna Yogshala`,
    description: workshop.shortDescription,
    openGraph: { title: workshop.title, description: workshop.shortDescription, images: workshop.thumbnail?.url ? [workshop.thumbnail.url] : [] },
  };
}

export default async function WorkshopDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workshop = id.match(/^[0-9a-fA-F]{24}$/) ? await WorkshopService.getById(id) : await WorkshopService.getBySlug(id);
  if (!workshop) return notFound();
  return <WorkshopShowcaseClient workshop={JSON.parse(JSON.stringify(workshop))} />;
}

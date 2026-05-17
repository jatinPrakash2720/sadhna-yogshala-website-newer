import Link from "next/link";
import { ArrowRight } from "lucide-react";
import WorkshopRailTimeline from "@/components/workshops/WorkshopRailTimeline";
import { WorkshopService } from "@/services/workshop.service";

export default async function UpcomingWorkshops() {
  const { workshops } = await WorkshopService.list({ page: 1, limit: 3, isPublished: true, upcoming: true });
  const plain = JSON.parse(JSON.stringify(workshops));

  if (!plain.length) return null;

  return (
    <section className="mx-auto w-full max-w-7xl px-6">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Events</p>
          <h2 className="mt-2 text-3xl font-bold text-gray-950">Upcoming Workshops</h2>
        </div>
        <Link href="/workshops" className="inline-flex items-center gap-1 text-sm font-bold text-brand-700">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
      <WorkshopRailTimeline workshops={plain} />
    </section>
  );
}

import type { Metadata } from "next";
import WorkshopCard from "@/components/workshops/WorkshopCard";
import { WorkshopService } from "@/services/workshop.service";

export const metadata: Metadata = {
  title: "Yoga Workshops | Sadhna Yogshala",
};

export const dynamic = "force-dynamic";

export default async function WorkshopsPage() {
  const { workshops } = await WorkshopService.list({ page: 1, limit: 30, isPublished: true, upcoming: true });
  const plain = JSON.parse(JSON.stringify(workshops));

  return (
    <main className="bg-cream-50">
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-wide text-brand-600">Live wellness experiences</p>
          <h1 className="mt-3 text-4xl font-bold text-gray-950 sm:text-5xl">Upcoming Yoga Workshops</h1>
          <p className="mt-4 text-lg leading-8 text-sage-600">Short-format retreats, online sessions, and immersive practices designed for focused transformation.</p>
        </div>
        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {plain.map((workshop: any) => <WorkshopCard key={workshop._id} workshop={workshop} />)}
        </div>
      </section>
    </main>
  );
}


import Hero from "@/components/home/Hero";
import Services from "@/components/home/Services";
import LatestClasses from "@/components/home/LatestClasses";
import Testimonials from "@/components/home/Testimonials";
import ExploreCourses from "@/components/home/ExploreCourses";


export default function LandingPage() {
  return (
    <main className="min-h-screen flex flex-col">

      <Hero />
      <div className="flex flex-col gap-10 pb-20">
        <ExploreCourses />
        {/* <Services /> */}
        <LatestClasses />
        <Testimonials />

      </div>
    </main>
  );
}

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { CourseService } from "@/services/course.service";
import { CourseShowcaseClient } from "@/components/courses/showcase/CourseShowcaseClient";
import { connectToDatabase } from "@/config/database";
import type { ICourse } from "@/types";

// Force dynamic since courses might be updated frequently
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

/**
 * Generates OpenGraph and SEO metadata dynamically for the course details page.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  
  await connectToDatabase();
  
  let course;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    course = await CourseService.getById(id);
  } else {
    course = await CourseService.getBySlug(id);
  }

  if (!course) {
    return {
      title: "Course Not Found | Yogshala LMS",
    };
  }

  const title = course.seo?.metaTitle || `${course.title} | Yogshala LMS`;
  const description = course.seo?.metaDescription || course.shortDescription || course.description.substring(0, 160);
  const imageUrl = course.thumbnail?.url || "/images/default-course.jpg";

  return {
    title,
    description,
    keywords: course.seo?.keywords || ["yoga", "wellness", "course"],
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: course.title,
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function CourseDetailsPage({ params }: PageProps) {
  const { id } = await params;

  await connectToDatabase();

  let courseDoc;
  if (id.match(/^[0-9a-fA-F]{24}$/)) {
    courseDoc = await CourseService.getById(id);
  } else {
    courseDoc = await CourseService.getBySlug(id);
  }

  if (!courseDoc) {
    return notFound();
  }

  // Serialize Mongoose Document to plain JSON for Client Component
  const course = JSON.parse(JSON.stringify(courseDoc)) as ICourse;

  return <CourseShowcaseClient course={course} />;
}

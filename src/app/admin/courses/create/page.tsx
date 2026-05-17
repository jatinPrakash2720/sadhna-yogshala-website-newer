/**
 * /admin/courses/create — Course creation page
 */

import type { Metadata } from "next";
import CourseBuilderLayout from "@/components/course-builder/CourseBuilderLayout";

export const metadata: Metadata = {
  title: "Create New Course | Admin — Sadhna Yogshala",
  description: "Create and publish a new yoga course on Sadhna Yogshala.",
};

export default function CreateCoursePage() {
  return <CourseBuilderLayout mode="create" />;
}

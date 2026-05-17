import { z } from "zod";
import { MeetingPlatform, WorkshopMode } from "@/constants";
import { paginationSchema } from "./common.validation";

const mediaAssetSchema = z.object({
  url: z.string().url(),
  public_id: z.string().min(1),
});

const videoAssetSchema = mediaAssetSchema.extend({
  thumbnail: z.string().optional().default(""),
  duration: z.number().optional().default(0),
});

const timelineItemSchema = z.object({
  time: z.string().min(1).max(30),
  title: z.string().min(1).max(180).trim(),
  description: z.string().max(500).optional().default(""),
});

export const createWorkshopSchema = z.object({
  title: z.string().min(3).max(200).trim(),
  shortDescription: z.string().max(300).trim().optional().default(""),
  fullDescription: z.string().min(10).max(6000).trim(),
  slug: z.string().max(200).trim().optional().default(""),
  category: z.string().max(100).trim().optional().default(""),
  tags: z.array(z.string().max(50)).optional().default([]),
  thumbnail: mediaAssetSchema.optional(),
  galleryImages: z.array(mediaAssetSchema).optional().default([]),
  introVideo: videoAssetSchema.optional(),
  price: z.number().min(0).max(100000),
  discountPrice: z.number().min(0).optional(),
  startDate: z.string().datetime({ offset: true }).or(z.string().date()),
  endDate: z.string().datetime({ offset: true }).or(z.string().date()),
  startTime: z.string().min(1),
  endTime: z.string().min(1),
  durationInHours: z.number().min(0.5).max(72),
  durationInDays: z.number().int().min(1).max(3),
  mode: z.nativeEnum(WorkshopMode),
  venueName: z.string().max(180).optional().default(""),
  address: z.string().max(500).optional().default(""),
  city: z.string().max(100).optional().default(""),
  state: z.string().max(100).optional().default(""),
  country: z.string().max(100).optional().default("India"),
  googleMapsLink: z.string().url().or(z.literal("")).optional().default(""),
  meetingPlatform: z.nativeEnum(MeetingPlatform).or(z.literal("")).optional().default(""),
  meetingLink: z.string().url().or(z.literal("")).optional().default(""),
  maxParticipants: z.number().int().min(1).max(10000),
  currentParticipants: z.number().int().min(0).optional().default(0),
  waitlistEnabled: z.boolean().optional().default(false),
  instructor: z.string().min(2).max(120).trim(),
  guestInstructor: z.string().max(120).trim().optional().default(""),
  speakerBio: z.string().max(1500).trim().optional().default(""),
  benefits: z.array(z.string().max(160)).optional().default([]),
  requirements: z.array(z.string().max(160)).optional().default([]),
  timeline: z.array(timelineItemSchema).optional().default([]),
  isPublished: z.boolean().optional().default(false),
});

export const updateWorkshopSchema = createWorkshopSchema.partial();

export const workshopQuerySchema = paginationSchema.extend({
  search: z.string().optional(),
  category: z.string().optional(),
  mode: z.nativeEnum(WorkshopMode).optional(),
  isPublished: z.string().transform((val) => val === "true").optional(),
  upcoming: z.string().transform((val) => val === "true").optional(),
  all: z.string().transform((val) => val === "true").optional(),
});

export type CreateWorkshopInput = z.infer<typeof createWorkshopSchema>;
export type UpdateWorkshopInput = z.infer<typeof updateWorkshopSchema>;
export type WorkshopQueryInput = z.infer<typeof workshopQuerySchema>;

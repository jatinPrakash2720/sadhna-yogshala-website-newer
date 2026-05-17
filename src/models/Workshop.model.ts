import mongoose, { Schema, type Model } from "mongoose";
import { MeetingPlatform, WorkshopMode } from "@/constants";
import type { IWorkshop } from "@/types";

const mediaAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const videoAssetSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
    thumbnail: { type: String, default: "" },
    duration: { type: Number, default: 0 },
  },
  { _id: false }
);

const timelineItemSchema = new Schema(
  {
    time: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true, default: "" },
  },
  { _id: true }
);

const workshopSchema = new Schema<IWorkshop>(
  {
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 200 },
    shortDescription: { type: String, trim: true, maxlength: 300, default: "" },
    fullDescription: { type: String, required: true, trim: true, minlength: 10, maxlength: 6000 },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    category: { type: String, trim: true, default: "" },
    tags: { type: [String], default: [] },
    thumbnail: { type: mediaAssetSchema, default: undefined },
    galleryImages: { type: [mediaAssetSchema], default: [] },
    introVideo: { type: videoAssetSchema, default: undefined },
    price: { type: Number, required: true, min: 0 },
    discountPrice: { type: Number, min: 0, default: undefined },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    durationInHours: { type: Number, required: true, min: 0.5, max: 72 },
    durationInDays: { type: Number, required: true, min: 1, max: 3 },
    mode: { type: String, enum: Object.values(WorkshopMode), default: WorkshopMode.ONLINE },
    venueName: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    city: { type: String, trim: true, default: "" },
    state: { type: String, trim: true, default: "" },
    country: { type: String, trim: true, default: "India" },
    googleMapsLink: { type: String, trim: true, default: "" },
    meetingPlatform: { type: String, enum: [...Object.values(MeetingPlatform), ""], default: "" },
    meetingLink: { type: String, trim: true, default: "" },
    maxParticipants: { type: Number, required: true, min: 1, max: 10000 },
    currentParticipants: { type: Number, default: 0, min: 0 },
    waitlistEnabled: { type: Boolean, default: false },
    instructor: { type: String, required: true, trim: true },
    guestInstructor: { type: String, trim: true, default: "" },
    speakerBio: { type: String, trim: true, default: "" },
    benefits: { type: [String], default: [] },
    requirements: { type: [String], default: [] },
    timeline: { type: [timelineItemSchema], default: [] },
    isPublished: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: Record<string, unknown>) {
        delete ret.__v;
        return ret;
      },
    },
  }
);

workshopSchema.index({ isPublished: 1, startDate: 1 });
workshopSchema.index({ title: "text", fullDescription: "text", shortDescription: "text" });
workshopSchema.index({ category: 1 });
workshopSchema.index({ tags: 1 });

workshopSchema.pre("save", function () {
  if (!this.slug || this.isModified("title")) {
    const base = (this.slug || this.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    this.slug = this.isNew ? `${base}-${Math.random().toString(36).substring(2, 6)}` : base;
  }
});

if (mongoose.models.Workshop) {
  delete (mongoose.models as any).Workshop;
}

const Workshop: Model<IWorkshop> = mongoose.model<IWorkshop>("Workshop", workshopSchema);

export default Workshop;

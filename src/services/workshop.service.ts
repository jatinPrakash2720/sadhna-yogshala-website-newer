import mongoose from "mongoose";
import { PAGINATION, WorkshopEnrollmentStatus } from "@/constants";
import { WorkshopRepository } from "@/repositories/workshop.repository";
import { deleteMedia, deleteMultipleMedia } from "@/utils/media";
import { MOCK_WORKSHOP_ENROLLMENTS, MOCK_WORKSHOPS } from "@/lib/mocks/workshops";
import type { IWorkshop } from "@/types";
import type { CreateWorkshopInput, UpdateWorkshopInput, WorkshopQueryInput } from "@/validations/workshop.validation";

export class WorkshopService {
  private static getMockWorkshopById(id: string) {
    return MOCK_WORKSHOPS.find((item) => String(item._id) === id) ?? null;
  }

  private static getMockWorkshopBySlug(slug: string) {
    return MOCK_WORKSHOPS.find((item) => item.slug === slug) ?? null;
  }

  private static getMockWorkshopList(query: WorkshopQueryInput, page: number, limit: number) {
    const filteredMocks = MOCK_WORKSHOPS.filter((workshop) => {
      if (typeof query.isPublished === "boolean" && workshop.isPublished !== query.isPublished) return false;
      if (query.category && workshop.category !== query.category) return false;
      if (query.mode && workshop.mode !== query.mode) return false;
      if (query.upcoming && new Date(workshop.startDate).getTime() < Date.now()) return false;
      if (query.search) {
        const needle = query.search.toLowerCase();
        const haystack = `${workshop.title} ${workshop.shortDescription} ${workshop.fullDescription} ${workshop.category}`.toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      return true;
    }).sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    const total = filteredMocks.length;
    const start = (page - 1) * limit;
    const workshops = filteredMocks.slice(start, start + limit);
    const totalPages = Math.ceil(total / limit);

    return {
      workshops,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  static async create(data: CreateWorkshopInput) {
    return WorkshopRepository.create({
      ...data,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate),
    });
  }

  static async getById(id: string) {
    try {
      const workshop = await WorkshopRepository.findById(id);
      return workshop ?? this.getMockWorkshopById(id);
    } catch (error) {
      console.warn("Falling back to mock workshop by id because MongoDB is unavailable:", error);
      return this.getMockWorkshopById(id);
    }
  }

  static async getBySlug(slug: string) {
    try {
      const workshop = await WorkshopRepository.findBySlug(slug);
      return workshop ?? this.getMockWorkshopBySlug(slug);
    } catch (error) {
      console.warn("Falling back to mock workshop by slug because MongoDB is unavailable:", error);
      return this.getMockWorkshopBySlug(slug);
    }
  }

  static async update(id: string, data: UpdateWorkshopInput) {
    const updateData: Record<string, unknown> = { ...data };
    if (data.startDate) updateData.startDate = new Date(data.startDate);
    if (data.endDate) updateData.endDate = new Date(data.endDate);
    return WorkshopRepository.updateById(id, updateData);
  }

  static async delete(id: string) {
    const workshop = await WorkshopRepository.findById(id);
    if (!workshop) return null;
    await this.deleteAllMedia(workshop);
    return WorkshopRepository.deleteById(id);
  }

  static async deleteAllMedia(workshop: IWorkshop) {
    const deletions: Promise<void>[] = [];
    if (workshop.thumbnail?.public_id) deletions.push(deleteMedia(workshop.thumbnail.public_id, "image"));
    if (workshop.galleryImages?.length) deletions.push(deleteMultipleMedia(workshop.galleryImages.map((g) => g.public_id), "image"));
    if (workshop.introVideo?.public_id) deletions.push(deleteMedia(workshop.introVideo.public_id, "video"));
    await Promise.allSettled(deletions);
  }

  static async list(query: WorkshopQueryInput) {
    const page = query.page || PAGINATION.DEFAULT_PAGE;
    const limit = query.limit || PAGINATION.DEFAULT_LIMIT;
    const filter: mongoose.QueryFilter<IWorkshop> = {};
    if (query.category) filter.category = query.category;
    if (query.mode) filter.mode = query.mode;
    if (typeof query.isPublished === "boolean") filter.isPublished = query.isPublished;
    if (query.upcoming) filter.startDate = { $gte: new Date() };

    let workshops: IWorkshop[];
    let total: number;

    try {
      ({ workshops, total } = await WorkshopRepository.findAll({
        filter,
        search: query.search,
        page,
        limit,
        sort: { startDate: 1 },
      }));
    } catch (error) {
      console.warn("Falling back to mock workshops because MongoDB is unavailable:", error);
      return this.getMockWorkshopList(query, page, limit);
    }

    if (total === 0) return this.getMockWorkshopList(query, page, limit);

    const totalPages = Math.ceil(total / limit);
    return {
      workshops,
      pagination: { page, limit, total, totalPages, hasNextPage: page < totalPages, hasPrevPage: page > 1 },
    };
  }

  static async enroll(studentId: string, workshopId: string) {
    const workshop = await WorkshopRepository.findById(workshopId);
    if (!workshop) {
      const mockWorkshop = MOCK_WORKSHOPS.find((item) => String(item._id) === workshopId);
      if (!mockWorkshop) throw new Error("Workshop not found");

      const isFull = mockWorkshop.currentParticipants >= mockWorkshop.maxParticipants;
      if (isFull && !mockWorkshop.waitlistEnabled) throw new Error("This workshop is full");

      return {
        _id: `mock-enrollment-${workshopId}`,
        student: studentId,
        workshop: workshopId,
        status: isFull ? WorkshopEnrollmentStatus.WAITLISTED : WorkshopEnrollmentStatus.ENROLLED,
        paymentStatus: "paid",
        enrolledAt: new Date(),
      };
    }
    const existing = await WorkshopRepository.findEnrollment(studentId, workshopId);
    if (existing) return existing;

    const isFull = workshop.currentParticipants >= workshop.maxParticipants;
    if (isFull && !workshop.waitlistEnabled) throw new Error("This workshop is full");

    const status = isFull ? WorkshopEnrollmentStatus.WAITLISTED : WorkshopEnrollmentStatus.ENROLLED;
    const enrollment = await WorkshopRepository.enroll(studentId, workshopId, status);
    if (status === WorkshopEnrollmentStatus.ENROLLED) {
      await WorkshopRepository.incrementParticipants(workshopId);
    }
    return enrollment;
  }

  static async getMyWorkshops(studentId: string) {
    const enrollments = await WorkshopRepository.myEnrollments(studentId);
    return enrollments.length > 0 ? enrollments : MOCK_WORKSHOP_ENROLLMENTS;
  }
}

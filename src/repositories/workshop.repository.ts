import mongoose from "mongoose";
import { connectToDatabase } from "@/config/database";
import Workshop from "@/models/Workshop.model";
import WorkshopEnrollment from "@/models/WorkshopEnrollment.model";
import WorkshopAttendance from "@/models/WorkshopAttendance.model";
import type { IWorkshop } from "@/types";
import type { WorkshopEnrollmentStatus } from "@/constants";

export class WorkshopRepository {
  private static async connect() {
    await connectToDatabase();
  }

  static async create(data: Partial<IWorkshop>) {
    await this.connect();
    const workshop = await Workshop.create(data);
    return workshop.toJSON() as IWorkshop;
  }

  static async findById(id: string) {
    await this.connect();
    return Workshop.findById(id).lean<IWorkshop>();
  }

  static async findBySlug(slug: string) {
    await this.connect();
    return Workshop.findOne({ slug }).lean<IWorkshop>();
  }

  static async updateById(id: string, data: mongoose.UpdateQuery<IWorkshop>) {
    await this.connect();
    return Workshop.findByIdAndUpdate(id, data, { new: true, runValidators: true }).lean<IWorkshop>();
  }

  static async deleteById(id: string) {
    await this.connect();
    return Workshop.findByIdAndDelete(id).lean<IWorkshop>();
  }

  static async findAll(options: {
    filter?: mongoose.QueryFilter<IWorkshop>;
    search?: string;
    page?: number;
    limit?: number;
    sort?: Record<string, 1 | -1>;
  }) {
    await this.connect();
    const { filter = {}, search, page = 1, limit = 10, sort = { startDate: 1 } } = options;
    const skip = (page - 1) * limit;
    const query: mongoose.QueryFilter<IWorkshop> = { ...filter };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { shortDescription: { $regex: search, $options: "i" } },
        { fullDescription: { $regex: search, $options: "i" } },
      ];
    }

    const [workshops, total] = await Promise.all([
      Workshop.find(query).sort(sort).skip(skip).limit(limit).lean<IWorkshop[]>(),
      Workshop.countDocuments(query),
    ]);

    return { workshops, total };
  }

  static async enroll(studentId: string, workshopId: string, status: WorkshopEnrollmentStatus) {
    await this.connect();
    return WorkshopEnrollment.create({ student: studentId, workshop: workshopId, status });
  }

  static async findEnrollment(studentId: string, workshopId: string) {
    await this.connect();
    return WorkshopEnrollment.findOne({ student: studentId, workshop: workshopId });
  }

  static async incrementParticipants(workshopId: string) {
    await this.connect();
    return Workshop.findByIdAndUpdate(workshopId, { $inc: { currentParticipants: 1 } }, { new: true });
  }

  static async myEnrollments(studentId: string) {
    await this.connect();
    return WorkshopEnrollment.find({ student: studentId })
      .populate("workshop")
      .sort({ enrolledAt: -1 })
      .lean();
  }

  static async markAttendance(studentId: string, workshopId: string, attended: boolean) {
    await this.connect();
    return WorkshopAttendance.findOneAndUpdate(
      { student: studentId, workshop: workshopId },
      { attended, checkedInAt: attended ? new Date() : undefined },
      { upsert: true, new: true }
    ).lean();
  }
}

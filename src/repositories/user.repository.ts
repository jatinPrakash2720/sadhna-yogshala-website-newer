/**
 * Yogshala LMS — User Repository
 * Data access layer for User model operations.
 */

import User from "@/models/User.model";
import { connectToDatabase } from "@/config/database";
import type { IUser } from "@/types";
import mongoose from "mongoose";

export class UserRepository {
  /**
   * Ensure DB connection before any operation.
   */
  private static async connect() {
    await connectToDatabase();
  }

  /**
   * Find a user by ID.
   */
  static async findById(
    id: string,
    includePassword: boolean = false
  ): Promise<IUser | null> {
    await this.connect();
    const query = User.findById(id);
    if (includePassword) query.select("+password");
    return query.lean<IUser>();
  }

  /**
   * Find a user by email.
   */
  static async findByEmail(
    email: string,
    includePassword: boolean = false
  ): Promise<IUser | null> {
    await this.connect();
    const query = User.findOne({ email: email.toLowerCase().trim() });
    if (includePassword) query.select("+password");
    return query.lean<IUser>();
  }

  /**
   * Create a new user.
   */
  static async create(data: Partial<IUser>): Promise<IUser> {
    await this.connect();
    const user = await User.create(data);
    return user.toJSON() as IUser;
  }

  /**
   * Update a user by ID.
   */
  static async updateById(
    id: string,
    data: mongoose.UpdateQuery<IUser>
  ): Promise<IUser | null> {
    await this.connect();
    return User.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    }).lean<IUser>();
  }

  /**
   * Find users with pagination and filtering.
   */
  static async findAll(
    filter: mongoose.QueryFilter<IUser> = {},
    page: number = 1,
    limit: number = 10,
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ): Promise<{ users: IUser[]; total: number }> {
    await this.connect();
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean<IUser[]>(),
      User.countDocuments(filter),
    ]);

    return { users, total };
  }

  /**
   * Find user with password and resetToken fields.
   */
  static async findByIdWithSensitiveFields(id: string): Promise<IUser | null> {
    await this.connect();
    return User.findById(id)
      .select("+password +resetPasswordToken +resetPasswordExpires")
      .lean<IUser>();
  }

  /**
   * Find user by reset token.
   */
  static async findByResetToken(token: string): Promise<IUser | null> {
    await this.connect();
    return User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    })
      .select("+resetPasswordToken +resetPasswordExpires")
      .lean<IUser>();
  }

  /**
   * Count users matching a filter.
   */
  static async count(filter: mongoose.QueryFilter<IUser> = {}): Promise<number> {
    await this.connect();
    return User.countDocuments(filter);
  }
}

export default UserRepository;

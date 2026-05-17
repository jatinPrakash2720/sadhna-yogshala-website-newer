/**
 * Yogshala LMS — Auth Service
 * Business logic for authentication, registration, profile completion, and password management.
 */

import { UserRepository } from "@/repositories/user.repository";
import { hashPassword, comparePassword } from "@/utils/password";
import { generateToken } from "@/utils/jwt";
import { addHours } from "@/utils/date";
import { AuthProvider, UserRole, UserStatus, AUTH } from "@/constants";
import type { IUser } from "@/types";
import type {
  RegisterInput,
  CompleteProfileInput,
  ChangePasswordInput,
  UpdateProfileInput,
} from "@/validations/auth.validation";
import crypto from "crypto";

export class AuthService {
  /**
   * Register a new user with manual credentials.
   */
  static async register(data: RegisterInput): Promise<IUser> {
    // Check if email already exists
    const existingEmail = await UserRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new Error("An account with this email already exists");
    }

    // Check if phone already exists
    const existingPhone = await UserRepository.findByPhone(data.phone);
    if (existingPhone) {
      throw new Error("An account with this mobile number already exists");
    }

    // Hash password before creation
    const hashedPassword = await hashPassword(data.password);

    const user = await UserRepository.create({
      name: data.name,
      email: data.email.toLowerCase().trim(),
      phone: data.phone,
      password: hashedPassword,
      role: UserRole.STUDENT,
      authProvider: AuthProvider.MANUAL,
      isVerified: false,
      profileCompleted: true,
      gender: data.gender,
      dob: data.dob ? new Date(data.dob) : undefined,
      status: UserStatus.ACTIVE,
    });

    return user;
  }

  /**
   * Get current user profile by ID.
   */
  static async getProfile(userId: string): Promise<IUser | null> {
    return UserRepository.findById(userId);
  }

  /**
   * Complete profile for Google OAuth users (missing phone/password).
   */
  static async completeProfile(
    userId: string,
    data: CompleteProfileInput
  ): Promise<IUser | null> {
    const hashedPassword = await hashPassword(data.password);

    const updatedUser = await UserRepository.updateById(userId, {
      phone: data.phone,
      password: hashedPassword,
      profileCompleted: true,
      dob: data.dob ? new Date(data.dob) : undefined,
      gender: data.gender,
      emergencyContact: data.emergencyContact,
      healthConditions: data.healthConditions,
    });

    return updatedUser;
  }

  /**
   * Update user profile (name, phone, bio, dob, gender, etc).
   */
  static async updateProfile(
    userId: string,
    data: UpdateProfileInput
  ): Promise<IUser | null> {
    const updateData: any = {};

    if (data.name) updateData.name = data.name;
    if (data.phone) updateData.phone = data.phone;
    if (data.bio !== undefined) updateData.bio = data.bio;
    if (data.dob && data.dob.trim()) updateData.dob = new Date(data.dob);
    if (data.gender && data.gender.trim()) updateData.gender = data.gender;
    if (data.emergencyContact !== undefined) updateData.emergencyContact = data.emergencyContact;
    if (data.healthConditions !== undefined) updateData.healthConditions = data.healthConditions;

    // Email update requires care (e.g., check for duplicates)
    if (data.email && data.email.trim()) {
      const existing = await UserRepository.findByEmail(data.email);
      if (existing && existing._id.toString() !== userId) {
        throw new Error("This email is already in use by another account");
      }
      updateData.email = data.email.toLowerCase().trim();
    }

    // Check if profile should be marked as completed
    const user = await UserRepository.findById(userId);
    if (user && !user.profileCompleted) {
      const finalName = updateData.name || user.name;
      const finalPhone = updateData.phone || user.phone;
      const finalDob = updateData.dob || user.dob;
      const finalGender = updateData.gender || user.gender;

      if (finalName && finalPhone && finalDob && finalGender) {
        updateData.profileCompleted = true;
      }
    }

    // Perform update
    const updated = await UserRepository.updateById(userId, { $set: updateData });
    return updated;
  }

  /**
   * Change password for authenticated users.
   */
  static async changePassword(
    userId: string,
    data: ChangePasswordInput
  ): Promise<void> {
    const user = await UserRepository.findByIdWithSensitiveFields(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.password) {
      throw new Error("No password set. Please complete your profile first.");
    }

    const isValid = await comparePassword(data.oldPassword, user.password);
    if (!isValid) {
      throw new Error("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(data.newPassword);
    await UserRepository.updateById(userId, { password: hashedPassword });
  }

  /**
   * Generate a password reset token and save it.
   */
  static async forgotPassword(email: string): Promise<string> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      // Don't reveal if email exists — always return success
      throw new Error("_silent"); // Handled by the route
    }

    // Generate a secure reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    await UserRepository.updateById(user._id.toString(), {
      resetPasswordToken: hashedToken,
      resetPasswordExpires: addHours(AUTH.RESET_TOKEN_EXPIRES_HOURS),
    });

    // In production, send this token via email
    // For now, return it (placeholder for email service)
    return resetToken;
  }

  /**
   * Reset password using a valid reset token.
   */
  static async resetPassword(
    token: string,
    newPassword: string
  ): Promise<void> {
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const user = await UserRepository.findByResetToken(hashedToken);
    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const hashedPassword = await hashPassword(newPassword);

    await UserRepository.updateById(user._id.toString(), {
      password: hashedPassword,
      resetPasswordToken: undefined,
      resetPasswordExpires: undefined,
    });
  }

  /**
   * Check if a user's profile is complete (for payment gate).
   */
  static async isProfileComplete(userId: string): Promise<boolean> {
    const user = await UserRepository.findById(userId);
    return user?.profileCompleted ?? false;
  }
}

export default AuthService;

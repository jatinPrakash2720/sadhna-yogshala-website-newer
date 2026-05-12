/**
 * Yogshala LMS — Notification Repository
 * Data access layer for Notification model operations.
 */

import Notification from "@/models/Notification.model";
import { connectToDatabase } from "@/config/database";
import type { INotification } from "@/types";

export class NotificationRepository {
  private static async connect() {
    await connectToDatabase();
  }

  /**
   * Create a notification.
   */
  static async create(data: Partial<INotification>): Promise<INotification> {
    await this.connect();
    const notification = await Notification.create(data);
    return notification.toJSON() as INotification;
  }

  /**
   * Get notifications for a user.
   */
  static async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 20
  ): Promise<{ notifications: INotification[]; total: number; unread: number }> {
    await this.connect();
    const skip = (page - 1) * limit;
    const filter = { user: userId };

    const [notifications, total, unread] = await Promise.all([
      Notification.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean<INotification[]>(),
      Notification.countDocuments(filter),
      Notification.countDocuments({ ...filter, isRead: false }),
    ]);

    return { notifications, total, unread };
  }

  /**
   * Mark a notification as read.
   */
  static async markAsRead(id: string): Promise<INotification | null> {
    await this.connect();
    return Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    ).lean<INotification>();
  }

  /**
   * Mark all notifications as read for a user.
   */
  static async markAllAsRead(userId: string): Promise<void> {
    await this.connect();
    await Notification.updateMany(
      { user: userId, isRead: false },
      { isRead: true }
    );
  }
}

export default NotificationRepository;

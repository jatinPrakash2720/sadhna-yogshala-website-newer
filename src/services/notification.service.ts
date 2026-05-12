/**
 * Yogshala LMS — Notification Service
 * Business logic for user notifications.
 */

import { NotificationRepository } from "@/repositories/notification.repository";
import type { INotification } from "@/types";

export class NotificationService {
  /**
   * Create a notification for a user.
   */
  static async create(
    userId: string,
    title: string,
    message: string
  ): Promise<INotification> {
    return NotificationRepository.create({
      user: userId as unknown as INotification["user"],
      title,
      message,
    });
  }

  /**
   * Get notifications for a user.
   */
  static async getUserNotifications(
    userId: string,
    page: number = 1,
    limit: number = 20
  ) {
    return NotificationRepository.findByUser(userId, page, limit);
  }

  /**
   * Mark a notification as read.
   */
  static async markAsRead(notificationId: string) {
    return NotificationRepository.markAsRead(notificationId);
  }

  /**
   * Mark all notifications as read.
   */
  static async markAllAsRead(userId: string) {
    return NotificationRepository.markAllAsRead(userId);
  }
}

export default NotificationService;

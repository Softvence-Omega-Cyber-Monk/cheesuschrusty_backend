import { TNotification } from "./notification.interface";
import { NotificationModel } from "./notification.model";

export const NotificationService = {
  /** 🔹 Create a new notification */
  async create(data: TNotification) {
    const notification = await NotificationModel.create(data);
    return notification;
  },

  /** 🔹 Get all notifications (optionally filter by userId) */
  async getAll(userId?: string) {
    const filter = userId ? { userId } : {};
    return await NotificationModel.find(filter).sort({ createdAt: -1 });
  },

  /** 🔹 Mark a notification as read */
  async markAsRead(id: string) {
    return await NotificationModel.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );
  },

  /** 🔹 Mark all as read for a user */
  async markAllAsRead(userId: string) {
    return await NotificationModel.updateMany({ userId }, { isRead: true });
  },

  async getRecent(userId?: string) {
    const filter = userId ? { userId } : {};
    return await NotificationModel.find(filter)
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();
  },
};

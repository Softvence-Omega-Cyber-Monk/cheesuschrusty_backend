// controllers/notification.controller.ts
import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

export const NotificationController = {
  /** ➕ Create new notification */
  // async create(req: Request, res: Response) {
  //   try {
  //     const notification = await NotificationService.create(req.body);
  //     res.status(201).json({ success: true, data: notification });
  //   } catch (error: any) {
  //     res.status(500).json({ success: false, message: error.message });
  //   }
  // },

  /** 📋 Get all notifications */
  async getAll(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;
      const notifications = await NotificationService.getAll(userId);
      res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /** ✅ Mark as read */
  async markAsRead(req: Request, res: Response) {
    try {
      const id = req.params.id;
      const notification = await NotificationService.markAsRead(id);
      res.status(200).json({ success: true, data: notification });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  /** ✅ Mark all notifications as read */
  async markAllAsRead(req: Request, res: Response) {
    try {
      const userId = req.params.userId;
      await NotificationService.markAllAsRead(userId);
      res
        .status(200)
        .json({ success: true, message: "All notifications marked as read" });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // controllers/notification.controller.ts

  async getRecent(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string;
      const notifications = await NotificationService.getRecent(userId);
      res.status(200).json({ success: true, data: notifications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
};

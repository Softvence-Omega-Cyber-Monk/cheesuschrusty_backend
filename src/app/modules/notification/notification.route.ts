// routes/notification.routes.ts
import express from "express";
import { NotificationController } from "./notification.controller";

const router = express.Router();

// router.post("/create", NotificationController.create);
router.get("/getAll", NotificationController.getAll);
router.patch("/markAsRead/:id", NotificationController.markAsRead);
router.patch("/read-all/:userId", NotificationController.markAllAsRead);
router.get("/recent", NotificationController.getRecent);
export const NotificationRoutes = router;

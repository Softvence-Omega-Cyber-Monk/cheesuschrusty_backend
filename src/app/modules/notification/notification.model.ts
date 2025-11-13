import mongoose, { Schema, Document } from "mongoose";
import { TNotification } from "./notification.interface";

const NotificationSchema = new Schema<TNotification>(
  {
    userId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    icon: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

export const NotificationModel = mongoose.model<TNotification>(
  "Notification",
  NotificationSchema
);

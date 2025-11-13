
export type TNotification = {
  userId?: string;
  type: string; // e.g., 'info', 'warning', 'error', etc.
  title: string; // short label for UI
  message: string; // more detailed text
  isRead?: boolean; // status of the notification
  icon?: string; // optional icon representation
};
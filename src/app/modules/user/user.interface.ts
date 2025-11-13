import { Types } from "mongoose";

export type TUser = {
  fullName: string;
  email: string;
  password: string;
  role: "user" | "superAdmin" | "contentManager" | "supportManager";
  userType: "regular" | "pro";
  isSuspended: boolean;
  profilePicture?: string;
};

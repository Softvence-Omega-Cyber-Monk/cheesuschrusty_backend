import { Types } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  role: "user" | "superAdmin" | "contentManager" | "supportManager";
  userType: "regular" | "pro";
  isSuspended: boolean;
};

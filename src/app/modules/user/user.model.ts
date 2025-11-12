import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";

const user_schema = new Schema<TUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "superAdmin", "contentManager", "supportManager"], default: "user" },
    userType: { type: String, enum: ["regular", "pro"], default: "regular" },
    isSuspended: { type: Boolean, default: false },
}, {
    versionKey: false,
    timestamps: true
})


export const User_Model = model("user", user_schema)
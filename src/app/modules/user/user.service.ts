import { TUser } from "./user.interface";
import { User_Model } from "./user.model";
import bcrypt from "bcrypt";

export const UserService = {
  // Create a new user
  async createUser(payload: TUser) {
    const existingUser = await User_Model.findOne({ email: payload.email });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = new User_Model({
      ...payload,
      password: hashedPassword, // save hashed password
    });

    return await user.save();
  },

  // Get all users
  async getAllUsers() {
    return await User_Model.find().sort({ createdAt: -1 });
  },

  // Get single user by ID
  async getUserById(userId: string) {
    const user = await User_Model.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  },
};

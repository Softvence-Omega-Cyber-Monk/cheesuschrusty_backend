import { Request, Response } from "express";
import { UserService } from "./user.service";
import uploadCloud from "../../utils/cloudinary";

export const UserController = {
  // Create user
  async createUser(req: Request, res: Response) {
    try {
      const inputData = req.body;
      // console.log("Request Body:", inputData);

      // Handle profile image if uploaded
      if (req.file) {
        const uploadedImage = await uploadCloud(req.file);
        if (uploadedImage?.secure_url) {
          inputData.profilePicture = uploadedImage.secure_url;
        }
      }

      const result = await UserService.createUser(inputData);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: result,
      });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: error.message || "Failed to create user",
      });
    }
  },

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await UserService.getAllUsers();
      res.status(200).json({
        success: true,
        message: "All users retrieved successfully",
        userAnalytics: {
          activeUsers: users.activeUsers,
          suspendedUsers: users.suspendedUsers,
          proUsers: users.proUsers,
          totalUsers: users.totalUsers,
        },
        data: users.res,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to fetch users",
      });
    }
  },

  // Get single user
  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.getUserById(id);
      res.status(200).json({
        success: true,
        message: "User fetched successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  },
  async suspendUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const data = req.body;
      const user = await UserService.suspendUser(id, data);
      res.status(200).json({
        success: true,
        message: "User suspended successfully",
        data: user,
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  },

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await UserService.deleteUser(id);
      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error: any) {
      res.status(404).json({
        success: false,
        message: error.message || "User not found",
      });
    }
  },

  async getUserStatsAnalyticsAndSubscriptions(req: Request, res: Response) {
    try {
      const { year } = req.query;
      const parsedYear = year ? parseInt(year as string) : undefined;
      const result = await UserService.getUserStatsAnalyticsAndSubscriptions(parsedYear);

      res.status(200).json({
        success: true,
        message: `User statistics for year ${result.selectedYear}`,
        data: result,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || "Failed to get user stats",
      });
    }
  },
};

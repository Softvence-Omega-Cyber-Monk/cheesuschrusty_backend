import { configs } from "../../configs";
import { NotificationService } from "../notification/notification.service";
import { TUser } from "./user.interface";
import { User_Model } from "./user.model";
import bcrypt from "bcrypt";

export const UserService = {
  // Create a new user
  async createUser(payload: TUser) {
    // console.log("Creating user with payload: form service", payload);
    const existingUser = await User_Model.findOne({ email: payload.email });
    if (existingUser) {
      throw new Error("User already exists with this email.");
    }

    // Hash the password
    const salt = configs.bcrypt_salt_rounds
      ? Number(configs.bcrypt_salt_rounds)
      : 10;
    const hashedPassword = await bcrypt.hash(payload.password, salt);

    const user = new User_Model({
      ...payload,
      password: hashedPassword, // save hashed password
    });

    const res = await user.save();

    //save notification for new user registration
    await NotificationService.create({
      userId: res._id.toString(),
      type: "Registration",
      title: "New user Registered",
      message: ` ${res.fullName} has joined the platform.`,
      isRead: false,
    });

    return res;
  },

  // Get all users
  async getAllUsers() {
    const res = await User_Model.find().sort({ createdAt: -1 });

    const activeUsers = res.filter((user) => !user.isSuspended).length;
    const suspendedUsers = res.filter((user) => user.isSuspended).length;
    const proUsers = res.filter(
      (user) => user.userType === "pro" && !user.isSuspended
    ).length;
    const totalUsers = res.length;

    return { res, activeUsers, suspendedUsers, proUsers, totalUsers };
  },

  // Get single user by ID
  async getUserById(userId: string) {
    const user = await User_Model.findById(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  },
  async suspendUser(userId: string, payload: Partial<TUser>) {
    const user = await User_Model.findByIdAndUpdate(
      userId,
      { isSuspended: payload.isSuspended },
      { new: true }
    );
    if (!user) {
      throw new Error("User not found.");
    }

    return user;
  },

  // Delete user by ID
  async deleteUser(userId: string) {
    const user = await User_Model.findByIdAndDelete(userId);
    if (!user) {
      throw new Error("User not found.");
    }
    return user;
  },

  async getUserStatsAnalyticsAndSubscriptions(year?: number) {
    const selectedYear = year || new Date().getFullYear();
    const startOfYear = new Date(selectedYear, 0, 1);
    const endOfYear = new Date(selectedYear + 1, 0, 1);

    // Aggregate new users for that year (month-wise)
    const newUsers = await User_Model.aggregate([
      { $match: { createdAt: { $gte: startOfYear, $lt: endOfYear } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // 🧠 Get total users cumulatively up to each month
    const totalUsersBeforeYear = await User_Model.countDocuments({
      createdAt: { $lt: startOfYear },
    });

    let cumulative = totalUsersBeforeYear;
    const formattedData = [];

    for (let i = 0; i < 12; i++) {
      const monthStart = new Date(selectedYear, i, 1);
      const monthEnd = new Date(selectedYear, i + 1, 1);

      // New users in that month (faster direct count for clarity)
      const newUserCount =
        newUsers.find((u) => u._id === i + 1)?.count ||
        (await User_Model.countDocuments({
          createdAt: { $gte: monthStart, $lt: monthEnd },
        }));

      cumulative += newUserCount;

      formattedData.push({
        month: months[i],
        year: selectedYear,
        newUsers: newUserCount,
        totalUsers: cumulative,
      });
    }

    // Overall analytics
    const allUsers = await User_Model.find().sort({ createdAt: -1 });
    const activeUsers = allUsers.filter((u) => !u.isSuspended).length;
    const proSubscribersUsers = allUsers.filter(
      (u) => u.userType === "pro" && !u.isSuspended
    ).length;
    const totalUsersLength = allUsers.length;

    //subscriber Breakdown
    const freeUsers = allUsers.filter(
      (u) => u.userType === "regular" && !u.isSuspended
    ).length;
    const pro = allUsers.filter(
      (u) => u.userType === "pro" && !u.isSuspended
    ).length;

    const freeUsersPercentage = totalUsersLength
      ? (freeUsers / totalUsersLength) * 100
      : 0;
    const proUsersPercentage = totalUsersLength
      ? (pro / totalUsersLength) * 100
      : 0;

    return {
      selectedYear,
      userStats: formattedData,
      userAnalytics: {
        activeUsers,
        proSubscribersUsers,
        totalUsers: totalUsersLength,
      },
      subscriberBreakdown: {
        freeUsers: {
          count: freeUsers,
          percentage: parseFloat(freeUsersPercentage.toFixed(2)),
        },
        proUsers: {
          count: pro,
          percentage: parseFloat(proUsersPercentage.toFixed(2)),
        },
      },
    };
  },
};

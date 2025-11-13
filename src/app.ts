import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/global_error_handler";
import notFound from "./app/middlewares/not_found_api";
import appRouter from "./routes";
import { User_Model } from "./app/modules/user/user.model";
import { configs } from "./app/configs";
import bcrypt from "bcrypt";

// define app
const app = express();

// middleware
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
  })
);
app.use(express.json({ limit: "100mb" }));
app.use(express.raw());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use("/api/v1", appRouter);

// stating point
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Server is running successful !!",
    data: null,
  });
});

export const createDefaultSuperAdmin = async () => {
  try {
    const existingAdmin = await User_Model.findOne({
      email: "superAdmin123@gmail.com",
    });

    const hashedPassword = await bcrypt.hash(
      "superAdmin@123", // Default password for Admin
      Number(configs.bcrypt_salt_rounds) // Ensure bcrypt_salt_rounds is correctly pulled from config
    );

    if (!existingAdmin) {
      await User_Model.create({
        fullName: "Super Admin",
        email: "superAdmin123@gmail.com",
        password: hashedPassword,
        role: "superAdmin",
        userType: "pro",
      });
      console.log("✅ Default Admin created.");
    } else {
      console.log("ℹ️ SAdmin already exists.");
    }
  } catch (error) {
    console.error("❌ Failed to create Default Admin:", error);
  }
};

createDefaultSuperAdmin();

// global error handler
app.use(globalErrorHandler);
app.use(notFound);

// export app
export default app;

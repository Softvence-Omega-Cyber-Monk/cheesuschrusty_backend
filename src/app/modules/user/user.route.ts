import { Router } from "express";
import { UserController } from "./user.controller";
import multer from "multer";
import auth from "../../middlewares/auth";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post(
  "/create-user",
  upload.single("profilePicture"),
  UserController.createUser
);
router.get("/getAll", UserController.getAllUsers);
router.get("/getSingleUser/:id", UserController.getUserById);
router.put("/suspendUser/:id", UserController.suspendUser);
router.delete("/deleteUser/:id", UserController.deleteUser);
router.get(
  "/analytics/stats",
  auth("superAdmin", "contentManager", "supportManager"),
  UserController.getUserStatsAnalyticsAndSubscriptions
);

export const UserRoutes = router;

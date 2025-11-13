import { Router } from "express";
import { UserController } from "./user.controller";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

const router = Router();

router.post("/create-user",  upload.single("profilePicture"), UserController.createUser);
router.get("/getAll", UserController.getAllUsers);
router.get("/getSingleUser/:id", UserController.getUserById);

export const UserRoutes = router;

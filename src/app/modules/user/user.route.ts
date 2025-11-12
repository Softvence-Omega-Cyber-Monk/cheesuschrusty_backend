import { Router } from "express";
import { UserController } from "./user.controller";

const router = Router();

router.post("/create-user", UserController.createUser);
router.get("/getAll", UserController.getAllUsers);
router.get("/getSingleUser/:id", UserController.getUserById);

export const UserRoutes = router;

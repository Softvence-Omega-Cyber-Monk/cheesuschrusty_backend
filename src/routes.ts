import { Router } from "express";
import authRoute from "./app/modules/auth/auth.route";
import { UserRoutes } from "./app/modules/user/user.route";
import { NotificationRoutes } from "./app/modules/notification/notification.route";

const appRouter = Router();

const moduleRoutes = [
  { path: "/auth", route: authRoute },
  { path: "/user", route: UserRoutes },
  { path: "/notification", route: NotificationRoutes },
];

moduleRoutes.forEach((route) => appRouter.use(route.path, route.route));
export default appRouter;

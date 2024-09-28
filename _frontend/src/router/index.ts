import { createBrowserRouter } from "react-router-dom";
import AuthRoutes from "@/router/auth";
import ErrorRoutes from "@/router/errors";
import DashboardRoutes from "@/router/dashboard";
import SettingRoutes from "@/router/settings";
import ProductRoutes from "./products";
import UserRoutes from "./users";
import CreateRoutes from "@/router/new-test";
import ViewRoutes from "@/router/view";

const router = createBrowserRouter([

  ...AuthRoutes,
  ...DashboardRoutes,
  ...ProductRoutes,
  ...UserRoutes,
  ...SettingRoutes,
  ...ErrorRoutes,
  ...CreateRoutes,
  ...ViewRoutes,
]);
export default router;

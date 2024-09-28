import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Dashboard } from "@/pages";
import { RouteObject } from "react-router-dom";

const DashboardRoutes: RouteObject[] = [
  {
    path: "/dashboard",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "", // Matches "/dashboard"
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "/", // Matches the root path "/"
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "", // Matches the base route
        element: <Dashboard />,
      },
    ],
  },
];

export default DashboardRoutes;

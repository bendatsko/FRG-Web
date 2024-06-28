import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Users } from "@/pages";
import { RouteObject } from "react-router-dom";
import Administrator from "@/pages/administrator";

const UserRoutes: RouteObject[] = [
  {
    path: "/administrator",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <Administrator />,
      },
    ],
  },
];

export default UserRoutes;

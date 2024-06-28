import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { Users } from "@/pages";
import { RouteObject } from "react-router-dom";
import View from "@/pages/view";

const UserRoutes: RouteObject[] = [
  {
    path: "/view",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
        element: <View />,
      },
    ],
  },
];

export default UserRoutes;

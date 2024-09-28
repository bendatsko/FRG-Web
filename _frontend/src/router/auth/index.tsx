import { RouteObject } from "react-router-dom";
import { SignIn } from "@/pages";
import { AuthLayout } from "@/layouts";

const AuthRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <AuthLayout />,
    children: [
      {
        path: "",
        element: <SignIn />,
      },
    ],
  },
];
export default AuthRoutes;

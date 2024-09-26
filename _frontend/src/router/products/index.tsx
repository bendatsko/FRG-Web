import { ErrorBoundary } from "@/components";
import { MainLayout } from "@/layouts";
import { RouteObject } from "react-router-dom";

const ProductRoutes: RouteObject[] = [
  {
    path: "/products",
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "",
      },
    ],
  },
];
export default ProductRoutes;

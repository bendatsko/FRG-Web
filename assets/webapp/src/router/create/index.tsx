import {ErrorBoundary} from "@/components";
import {MainLayout} from "@/layouts";
import {RouteObject} from "react-router-dom";
import Create from "@/pages/create";

const CreateRoutes: RouteObject[] = [
    {
        path: "/create",
        element: <MainLayout/>,
        errorElement: <ErrorBoundary/>,
        children: [
            {
                path: "",
                element: <Create/>,
            },
        ],
    },
];
export default CreateRoutes;

import {ErrorBoundary} from "@/components";
import {MainLayout} from "@/layouts";
// import { Settings } from "@/pages";
import {RouteObject} from "react-router-dom";
import {Create } from "@/pages"

const NewTestRoutes: RouteObject[] = [
    {
        path: "/new-test",
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
export default NewTestRoutes;

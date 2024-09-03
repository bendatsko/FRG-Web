import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthGuard, SideBar } from "@/components";
import { MobileSideBar, ToggleMode } from "@/components";

const MainLayout: React.FC = () => {
    const isSideBarOpen = useSelector((state: any) => state.app.isSideBarOpen);

    return (
        <AuthGuard>
            <div className="flex h-screen bg-white dark:bg-black">
                <div className={`hidden lg:block w-52 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-700`}>
                    <SideBar />
                </div>
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-black border-b border-black/10 dark:border-white/10">
                        <MobileSideBar />
                        <ToggleMode />
                    </div>
                    <div className="flex-1 overflow-y-auto pr-0.5">
                        <Outlet />
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
};

export default MainLayout;
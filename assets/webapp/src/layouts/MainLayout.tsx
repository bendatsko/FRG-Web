import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { AuthGuard, SideBar } from "@/components";
import { Footer } from "../components/ui/footer";

const MainLayout: React.FC = () => {
    const isSideBarOpen = useSelector((state: any) => state.app.isSideBarOpen);

    return (
        <AuthGuard>
            <div className="flex h-screen overflow-hidden">
                <div className={`hidden lg:block transition-all duration-300 ease-in-out ${isSideBarOpen ? 'w-64' : 'w-20'}`}>
                    <SideBar />
                </div>
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex-1 overflow-y-auto">
                        <Outlet />
                    </div>
                    {/*<Footer />*/}
                </main>
            </div>
        </AuthGuard>
    );
};

export default MainLayout;
import React from "react";
import {Outlet} from "react-router-dom";
import {AuthGuard, SideBar, TopHeader} from "@/components";
import {useSelector} from "react-redux";
import {Footer} from "../components/ui/footer";

const MainLayout: React.FC = () => {
    const isSideBarOpen = useSelector((state: any) => state.app.isSideBarOpen);
    return (
        <AuthGuard>
            <div className="flex">
                <div className=" hidden lg:block">
                    <SideBar/>
                </div>
                <main
                    className={
                        " w-full   " + (isSideBarOpen ? "lg:ms-50" : "lg:ms-14")
                    }
                >
                    <TopHeader/>
                    <Outlet/>
                    <Footer/>

                </main>

            </div>
        </AuthGuard>
    );
};

export default MainLayout;

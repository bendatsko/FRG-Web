import React from "react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import Details from "./components/tabs/details";
import ChangePassword from "./components/tabs/analytics";

const View: React.FC = () => {
    const dispatch = useDispatch();
    dispatch(
        setBreadCrumb([
            {
                title: "Tests",
                link: "/dashboard",
            },
            {
                title: "Details",
                link: "/dashboard",
            },

        ])
    );

    return (
        <div>
            <Tabs defaultValue="account">
                <TabsList>
                    <TabsTrigger value="account" className="lg:w-[150px] w-full">
                        Test Details
                    </TabsTrigger>
                    <TabsTrigger value="change-password" className="lg:w-[150px] w-full">
                        Analytics
                    </TabsTrigger>

                </TabsList>
                <TabsContent value="account" className=" mt-4 ">
                    <Details/>
                </TabsContent>
                <TabsContent value="change-password" className=" mt-4 ">
                    <ChangePassword/>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default View;

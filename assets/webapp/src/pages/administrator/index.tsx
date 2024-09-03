import React, {useEffect} from 'react';
import {columns} from "./components/columns";
import {DataTable} from "./components/data-table";
import {useGetUsersQuery} from "@/store/api/v1/endpoints/user";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import {Loading} from "@geist-ui/core";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";

const Users = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            setBreadCrumb([
                {title: "Admin", link: "/dashboard"},
                {title: "Access Control", link: "/dashboard"},
            ])
        );
    }, [dispatch]);

    const {data, isLoading} = useGetUsersQuery({});
    if (isLoading) {
        return (
            <div className=" flex justify-center pt-10">
                <div className=" w-[250px] ">
                    <Loading/>
                </div>
            </div>
        );
    } else {
        return (
            <div className="min-h-screen bg-[#fafafa] dark:bg-[#0A0A0A] flex justify-center ">



                <div className="m-6 container bg-white dark:bg-[#0A0A0A] rounded-lg shadow-lg overflow-hidden border-b dark:border-[#333333] ">

                    <Card className="border-0 shadow-none">
                        <CardHeader>
                            <CardTitle className>Access Control</CardTitle>
                            <CardDescription>Userbase management tools</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <DataTable columns={columns} data={data}/>
                    </CardContent>
                </Card>

            </div>

            </div>

        );
    }
};

export default Users;

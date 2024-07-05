import React, { useState, useEffect } from 'react';
import {recentTestsColumns} from "./components/recent-tests-columns";
import {DataTable} from "./components/recent-tests-table.tsx";
import {useGetTestsQuery} from "@/store/api/v1/endpoints/test.ts";
import {Loading} from "@geist-ui/core";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const Dashboard = () => {
    const {data, isLoading} = useGetTestsQuery({});


    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
          setBreadCrumb([
            { title: "Dashboard", link: "/dashboard" },
          ])
        );
      }, [dispatch]);


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
            <div className="container mx-auto mb-4">
            <Card>
              <CardHeader>
                <CardTitle className>My Tests</CardTitle>
                <CardDescription>Manage the tests you have created and those that others have shared with you.</CardDescription>
              </CardHeader>
              <CardContent>
                <DataTable columns={recentTestsColumns} data={data}/>
              </CardContent>
            </Card>
            </div>
        );
    }
};

export default Dashboard;

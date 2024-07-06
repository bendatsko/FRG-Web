import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";

import {Loading} from "@geist-ui/core";

import {recentTestsColumns} from "./components/recent-tests-columns";
import {DataTable} from "./components/recent-tests-table";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useGetTestsQuery} from "@/store/api/v1/endpoints/test";
import {setBreadCrumb} from "@/store/slice/app";
import {selectUser} from "@/store/slice/auth";
import {User} from "../../store/slice/auth";

const Dashboard = () => {

    // Get initial state
    const user = useSelector(selectUser) as User;
    const {data, isLoading, error} = useGetTestsQuery(user.username);


    // Set breadcrumbs
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBreadCrumb([{title: "Dashboard", link: "/dashboard"}]));
    }, [dispatch]);

    // Display loading status
    if (isLoading) {
        return (<div className="flex justify-center pt-10">
            <div className="w-[250px]">
                <Loading/>
            </div>
        </div>);
    }

    // Display error status
    if (error) {
        return (<div className="container mx-auto mb-4">
            <Card>
                <CardHeader>
                    <CardTitle>Error</CardTitle>
                    <CardDescription>An error occurred while fetching the tests.</CardDescription>
                </CardHeader>
                <CardContent>
                    {error.toString()}
                </CardContent>
            </Card>
        </div>);
    }

    // Display the dashboard
    return (<div className=" w-full container mx-auto mb-4">
        <Card className="w-full bg-gray-900 border-gray-800">
            <CardHeader style={{
                borderBottom: '1px solid rgba(36, 36, 36, 1)'
            }}>
                <CardTitle className="text-4xl font-bold">DAQROC Test Manager</CardTitle>
                <CardDescription className="text-gray-400 mt-2">
                    A test management platform for digitally assisted quantum-inspired relaxed oscillator
                    computing (DAQROC) at Flynn Research Group, University of Michigan.
                    <br/><br/>
                    For technical details, visit the documentation. For support, please email
                    daqroc-admin@umich.edu.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h3 className="text-2xl font-semibold mt-6 mb-4">My Tests</h3>
                <DataTable columns={recentTestsColumns} data={data || []}/>
            </CardContent>
        </Card>
    </div>);
};

export default Dashboard;
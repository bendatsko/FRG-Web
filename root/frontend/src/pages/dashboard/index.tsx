import React, {useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Loading} from "@geist-ui/core";
import {recentTestsColumns} from "./components/recent-tests-columns";
import {DataTable} from "./components/recent-tests-table";
import {useDeleteTestMutation, useGetTestsQuery} from "@/store/api/v1/endpoints/test";
import {setBreadCrumb} from "@/store/slice/app";
import {selectUser} from "@/store/slice/auth";
import {User} from "../../store/slice/auth";
import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useNavigate} from "react-router-dom";

const Dashboard: React.FC = () => {
    const user = useSelector(selectUser) as User;
    const {data, isLoading, error} = useGetTestsQuery(user.username);
    const [deleteTest] = useDeleteTestMutation();
    const navigate = useNavigate();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setBreadCrumb([{title: "Dashboard", link: "/dashboard"}]));
    }, [dispatch]);

    const handleDeleteSelected = async (selectedRows: any[]) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedRows.length} selected test(s)?`);
        if (!confirmDelete) return;

        try {
            for (const row of selectedRows) {
                await deleteTest(row.id).unwrap();
            }
        } catch (error) {
            console.error('Error deleting tests:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loading/>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4">
                <h3 className="text-lg font-semibold text-red-600">Error</h3>
                <p className="mt-2">An error occurred while fetching the tests.</p>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{error.toString()}</p>
            </div>
        );
    }

    return (
        <div className="p-4 space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Tests</h1>
                <Button onClick={() => navigate('/create-ldpc')}>
                    <Plus className="mr-2 h-4 w-4"/>
                    New Test
                </Button>
            </div>
            <DataTable
                columns={recentTestsColumns}
                data={data || []}
                onDeleteSelected={handleDeleteSelected}
            />
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                © 2024 University of Michigan. All rights reserved.
            </div>
        </div>
    );
};

export default Dashboard;
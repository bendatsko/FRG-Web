import React, {useCallback, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {Loading} from "@geist-ui/core";
import {recentTestsColumns} from "./components/recent-tests-columns";
import {DataTable} from "./components/recent-tests-table";
import {useGetTestsQuery} from "@/store/api/v1/endpoints/test";
import {setBreadCrumb} from "@/store/slice/app";
import {selectUser} from "@/store/slice/auth";
import {User} from "../../store/slice/auth";
import {Button} from "@/components/ui/button";
import {Plus, RefreshCw} from "lucide-react";
import {useNavigate} from "react-router-dom";

const Dashboard: React.FC = () => {
    const user = useSelector(selectUser) as User;
    const {data, isLoading, error, refetch} = useGetTestsQuery(user.username);
    const [testsData, setTestsData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        dispatch(setBreadCrumb([{title: "Dashboard", link: "/dashboard"}]));
    }, [dispatch]);

    useEffect(() => {
        if (data) {
            setTestsData(data);
        }
    }, [data]);

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        const handleFocus = () => {
            refetch();
        };
        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [refetch]);

    const connectWebSocket = useCallback(() => {
        const ws = new WebSocket('ws://10.1.10.248:3001');

        ws.onopen = () => {
            console.log('WebSocket connected');
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.type === 'TEST_COMPLETED') {
                console.log("Test completed message received:", data);
                refetch();  // This should update the tests data if the backend sends updated information
            }
        };


        ws.onclose = () => {
            console.log('WebSocket disconnected. Attempting to reconnect...');
            setTimeout(connectWebSocket, 5000);  // Attempt to reconnect after 5 seconds
        };

        setSocket(ws);
    }, [refetch]);

    useEffect(() => {
        connectWebSocket();
        return () => {
            if (socket) {
                socket.close();
            }
        };
    }, [connectWebSocket]);

    const handleDeleteSelected = async (selectedRows) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${selectedRows.length} tests?`);
        if (!confirmDelete) return;

        const idsToDelete = selectedRows.map(row => row.id); // Collecting IDs to delete
        try {
            const response = await fetch('http://10.1.10.248:3001/api/tests/batch-delete', {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ids: idsToDelete})
            });

            if (!response.ok) throw new Error('Failed to delete tests.');

            const result = await response.json();
            console.log(result);  // Log the server response

            // Update your UI based on the successful deletion
            setTestsData(prevData => prevData.filter(row => !idsToDelete.includes(row.id)));

        } catch (error) {
            console.error('Error deleting tests:', error);
            alert('Failed to delete tests: ' + error.message);
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
            <div className="p-4 text-red-600 dark:text-red-400">
                <h3 className="text-lg font-semibold">Error</h3>
                <p className="mt-2">An error occurred while fetching the tests.</p>
                <p className="mt-1 text-sm opacity-75">{error.toString()}</p>
            </div>
        );
    }

    const filteredTests = testsData.filter(test =>
        test.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container mx-auto p-6 space-y-8 bg-white dark:bg-black text-black dark:text-white">
            <div className="flex justify-between items-center">
                {/* <h1 className="text-3xl font-bold">Dashboard</h1> */}
                <div className="flex space-x-2">
                    {/* <Button onClick={() => refetch()} variant="outline"
                            className="bg-white dark:bg-black border-black/10 dark:border-white/10">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Refresh
                    </Button> */}
                    {/* <Button onClick={() => navigate('/create-ldpc')}
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90">
                        <Plus className="mr-2 h-4 w-4"/>
                        New Test
                    </Button> */}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
                {[
                    {title: "Total Tests", value: testsData.length},
                    {title: "Running Tests", value: testsData.filter(test => test.status === 'Running').length},
                    {title: "Completed Tests", value: testsData.filter(test => test.status === 'Completed').length}
                ].map((item, index) => (
                    <div key={index} className="p-6 rounded-lg bg-outline dark:bg-[#0a0a0a] bg-[#FFFFF] border border-sm dark:border-[#282828]">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-3xl font-bold">{item.value}</p>
                    </div>
                ))}
            </div>

       
                <div className="p-6 rounded-lg bg-outline dark:bg-[#0a0a0a] bg-[#FFFFF] border border-sm dark:border-[#282828]">
                    <h2 className="text-xl font-semibold mb-4">Recent Tests</h2>

                    <DataTable
                        columns={recentTestsColumns}
                        data={filteredTests}
                        onDeleteSelected={handleDeleteSelected}
                    />
                </div>

        </div>
    );
};

export default Dashboard;
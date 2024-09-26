// Dashboard.tsx

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "@geist-ui/core";
import { recentTestsColumns } from "./components/recent-tests-columns";
import { DataTable } from "./components/recent-tests-table";
import { useGetTestsQuery } from "@/store/api/v1/endpoints/test";
import { setBreadCrumb } from "@/store/slice/app";
import { selectUser } from "@/store/slice/auth";
import { User } from "../../store/slice/auth";
import { Button } from "@/components/ui/button";
import { Plus, Activity, CheckCircle, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const baseUrl = import.meta.env.VITE_API_URL;
const POLLING_INTERVAL = 5000; // 5 seconds

const Dashboard = () => {
  const user = useSelector(selectUser) as User;
  const { data, isLoading, error, refetch } = useGetTestsQuery(user.username, {
    pollingInterval: POLLING_INTERVAL,
  });
  const [testsData, setTestsData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadCrumb([{ title: "Dashboard", link: "/dashboard" }]));
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      setTestsData(data);
    }
  }, [data]);

  const handleDeleteSelected = async (selectedRows) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${selectedRows.length} tests?`
    );
    if (!confirmDelete) return;

    const idsToDelete = selectedRows.map((row) => row.id);
    try {
      const response = await fetch(`${baseUrl}/api/tests/batch-delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: idsToDelete }),
      });

      if (!response.ok) throw new Error("Failed to delete tests.");

      setTestsData((prevData) =>
        prevData.filter((row) => !idsToDelete.includes(row.id))
      );
      refetch(); // Refetch data after deletion
    } catch (error) {
      console.error("Error deleting tests:", error);
      alert("Failed to delete tests: " + error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loading />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="m-6">
        <CardHeader>
          <CardTitle className="text-red-600 dark:text-red-400">
            Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mt-2">
            Failed to fetch tests from test API. Please try again later.
          </p>
          <p className="mt-1 text-sm opacity-75">{error.toString()}</p>
        </CardContent>
      </Card>
    );
  }

  const statusCounts = {
    total: testsData.length,
    running: testsData.filter((test) => test.status === "Running").length,
    completed: testsData.filter((test) => test.status === "Completed").length,
  };

  return (
    <div className="bg-[#fafafa] dark:bg-[#09090b] min-h-screen">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center border-b border-gray-200 dark:border-[#333333] pb-6">
          <h1 className="text-3xl font-bold text-black dark:text-white mb-4 md:mb-0">
            Dashboard
          </h1>
          <Button
            onClick={() => navigate("/new-test")}
            className="bg-[#09090b] dark:bg-white dark:text-black text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Test
          </Button>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {[
            {
              title: "Total Tests",
              value: statusCounts.total,
              icon: Database,
            },
            {
              title: "Running Tests",
              value: statusCounts.running,
              icon: Activity,
            },
            {
              title: "Completed Tests",
              value: statusCounts.completed,
              icon: CheckCircle,
            },
          ].map((item, index) => (
            <Card
              key={index}
              className="dark:border-[#333333] bg-white dark:bg-[#09090b] rounded-lg shadow-none"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-black dark:text-white">
                  {item.title}
                </CardTitle>
                <item.icon className="h-5 w-5 text-black dark:text-white" />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-black dark:text-white">
                  {item.value}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Data Table */}
        <div className="mt-6">
          <DataTable
            columns={recentTestsColumns}
            data={testsData}
            onDeleteSelected={handleDeleteSelected}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

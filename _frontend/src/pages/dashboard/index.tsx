import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loading } from "@geist-ui/core";
import { tableColumns } from "./components/table-columns.tsx";
import { DataTable } from "./components/table.tsx";
import { useGetTestsQuery } from "@/store/api/v1/endpoints/test";
import { setBreadCrumb } from "@/store/slice/app";
import { selectUser } from "@/store/slice/auth";
import { Button } from "@/components/ui/button";
import { Plus, Activity, CheckCircle, Database } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const baseUrl = import.meta.env.VITE_API_URL;
const POLLING_INTERVAL = 5000;

const Dashboard = () => {
  const user = useSelector(selectUser);
  const { data, isLoading, error, refetch } = useGetTestsQuery(user.username, {
    pollingInterval: POLLING_INTERVAL,
  });
  const [testsData, setTestsData] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setBreadCrumb([{ title: "Dashboard", link: "/dashboard" }]));
    if (data) setTestsData(data);

    window.scrollTo(0, 0);
  }, [dispatch, data]);

  const handleDeleteSelected = async (selectedRows) => {
    // ... (rest of the function remains unchanged)
  };

  const handleDeleteTest = (id) => {
    // ... (rest of the function remains unchanged)
  };

  if (isLoading)
    return (
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
    );

  if (error) {
    return (
        <Card className="m-6">
          <CardHeader>
            <CardTitle className="text-red-600 dark:text-red-400">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mt-2">Failed to fetch tests. Please try again later.</p>
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

  const statusCards = [
    { title: "Total Tests", value: statusCounts.total, icon: Database },
    { title: "Running Tests", value: statusCounts.running, icon: Activity },
    { title: "Completed Tests", value: statusCounts.completed, icon: CheckCircle },
  ];

  return (
      <div className="bg-background min-h-screen">


        <div className=" w-full border-none border-lightborder bg-background dark:bg-background dark:border-darkborder ">
          <div className="container mx-auto py-6">
            <div className="flex flex-row justify-between items-center">



              <h1 className="text-3xl font-bold text-lighth1">
                Dashboard
              </h1>


              <Button
                  onClick={() => navigate("/new-test")}
                  className="bg-foreground text-white hover:bg-foreground2"
              >
                <Plus className="h-4 w-4 mr-2"/>
                New Test
              </Button>


            </div>

            {/* Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 ">
              {statusCards.map(({title, value, icon: Icon}, index) => (
                  <Card key={index} className="bg-surface rounded-lg shadow-sm dark:border-darkborder border-lightborder">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className=" font-normal text-md text-lighth1">
                        {title}
                      </CardTitle>
                      <Icon className="h-5 w-5 text-lighth1"/>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg font-bold text-lighth1">{value}</p>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="container mx-auto">
          {/* Data Table */}
          <div className=" rounded-lg">
            <DataTable
                columns={tableColumns(handleDeleteTest)}
                data={testsData}
                onDeleteSelected={handleDeleteSelected}
            />
          </div>
        </div>
      </div>
  );
};

export default Dashboard;
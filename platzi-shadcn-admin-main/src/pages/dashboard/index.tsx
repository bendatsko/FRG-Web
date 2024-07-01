import { LoadingLottie } from "@/components";
import { columns } from "./components/columns";
import { DataTable } from "./components/recent-tests-table.tsx";
import { useGetTestsQuery } from "@/store/api/v1/endpoints/test.ts";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import { Loading } from "@geist-ui/core";
import Overview from "@/pages/dashboard/components/overview.tsx";
import React from "react";

const Dashboard = () => {
  const dispatch = useDispatch();
  // dispatch(setBreadCrumb([{ title: "Dashboard", link: "/dashboard" }]));
  const { data, isLoading } = useGetTestsQuery({});

  if (isLoading) {
    return (
      <div className=" flex justify-center pt-10">
        <div className=" w-[250px] ">
          <Loading />
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto p-6">
        <div className="text-2xl font-semibold mb-4">My Tests</div>

        <div className="border-b border-black/20 dark:border-white/20 mb-6" />

        <div className=" ">
          <DataTable columns={columns} data={data} />
        </div>
      </div>
    );
  }
};

export default Dashboard;

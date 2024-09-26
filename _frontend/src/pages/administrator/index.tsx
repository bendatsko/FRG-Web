// @ts-nocheck

import React, { useEffect } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useGetUsersQuery } from "@/store/api/v1/endpoints/user";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import { Loading } from "@geist-ui/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Users = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Admin", link: "/dashboard" },
        { title: "Access Control", link: "/dashboard" },
      ])
    );
  }, [dispatch]);

  const { data, isLoading } = useGetUsersQuery({});
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
      <div className="bg-[#fafafa] dark:bg-[#09090b] min-h-screen">
        <div className="container mx-auto px-4 ">
          <div className=" justify-between items-center py-6 border-b border-gray-200 dark:border-[#333333]">
            <h1 className="text-3xl font-bold text-black dark:text-white">
              Administrator
            </h1>
          </div>

          <div>
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    );
  }
};

export default Users;

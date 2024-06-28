import {LoadingLottie} from "@/components";
import {columns} from "./components/columns";
import {DataTable} from "./components/recent-tests-table.tsx";
import {useGetTestsQuery} from "@/store/api/v1/endpoints/test.ts";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import {Loading} from "@geist-ui/core";
import Overview from "@/pages/dashboard/components/overview.tsx";
import React from "react";

const Dashboard = () => {
    const dispatch = useDispatch();
    dispatch(setBreadCrumb([{title: "Dashboard", link: "/dashboard"}]));
    const {data, isLoading} = useGetTestsQuery({});


    if (isLoading) {
        return (
            <div className=" flex justify-center pt-10">
                {/*<Overview/>*/}
                <div className=" w-[250px] ">
                    <Loading/>
                </div>
            </div>
        );
    } else {
        return (<div>
            <div className="text-2xl font-semibold mb-4">My Tests</div>

            {/*<Overview/>*/}

            <DataTable columns={columns} data={data}/>

        </div>);
    }
};

export default Dashboard;

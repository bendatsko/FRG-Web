import { setBreadCrumb } from "@/store/slice/app";
import React from "react";
import { useDispatch } from "react-redux";
import Overview from "./components/overview";
import TotalIncome from "./components/totalIncome";
import TopProducts from "./components/top-product";

const Dashboard: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(setBreadCrumb([{ title: "Dashboard", link: "/" }]));

  return (
    <>
      <Overview />
      <div className=" flex flex-col lg:flex-row mt-6 gap-3 ">
        <div className=" basis-11/12 ">
        {/*  <TotalIncome />*/}


          <TopProducts />
        </div>
      </div>
    </>
  );
};

export default Dashboard;

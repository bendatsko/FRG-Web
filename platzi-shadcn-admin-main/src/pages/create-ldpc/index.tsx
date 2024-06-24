import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import Account from "./components/tabs/account";
import ChangePassword from "./components/tabs/change-password";
import Appearance from "./components/tabs/appearance";
import TestSettings from "./components/tabs/test-settings";

const Create: React.FC = () => {
  const dispatch = useDispatch();
  dispatch(
      setBreadCrumb([
        {
          title: "Dashboard",
          link: "/dashboard",
        },
        {
          title: "Create",
          link: "/",
        },
        {
          title: "LDPC",
          link: "/create-ldpc",
        },
      ])
  );

  return (
      <div>
        <TestSettings />
      </div>
  );
};

export default Create;

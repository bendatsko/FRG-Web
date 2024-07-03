import {columns} from "./components/columns";
import {DataTable} from "./components/data-table";
import {useGetUsersQuery} from "@/store/api/v1/endpoints/user";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import {Loading} from "@geist-ui/core";

const Users = () => {
    const dispatch = useDispatch();
    dispatch(
        setBreadCrumb([
            {title: "Dashboard", link: "/dashboard"},
            //   { title: "Admin", link: "/administrator" },
        ])
    );
    const {data, isLoading} = useGetUsersQuery({});
    if (isLoading) {
        return (
            <div className=" flex justify-center pt-10">
                <div className=" w-[250px] ">
                    <Loading/>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container mx-auto p-6">
                <div className="text-2xl font-semibold mb-4">Admin Panel</div>

                <div className="border-b border-black/20 dark:border-white/20 mb-6"/>

                <div className=" ">
                    <DataTable columns={columns} data={data}/>
                </div>
            </div>
        );
    }
};

export default Users;

import React from "react";
import {BreadCrumb, MobileSideBar, ToggleMode} from "@/components";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {RiMenuFoldLine, RiMenuUnfoldLine} from "react-icons/ri";
import {Button} from "@/components/ui/button";
import {useDispatch, useSelector} from "react-redux";
import {toggleSideBarOpen} from "@/store/slice/app";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Link, useNavigate} from "react-router-dom";
import {UserCircle2} from "lucide-react";
import {Logout, Settings2} from "tabler-icons-react";
import {removeUserInfo} from "@/store/slice/auth";

const TopHeader: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isSideBarOpen = useSelector((state: any) => state.app.isSideBarOpen);

  const handleLogout = () => {
    dispatch(removeUserInfo());
    navigate("/auth/sign-in");
  };

  return (
    <div className=" w-full h-14 py-3 flex justify-between items-center ">
      <div className=" flex gap-2 items-center ">
        <Button
          variant="outline"
          size="icon"
          className="  rounded-full border-none shadow-none hidden lg:flex items-center"
          onClick={() => dispatch(toggleSideBarOpen())}
        >
          {isSideBarOpen ? (
            <RiMenuFoldLine className=" text-xl"/>
          ) : (
            <RiMenuUnfoldLine className=" text-xl"/>
          )}
        </Button>

        {/* Only For Mobile Layout */}
        <MobileSideBar/>

        <BreadCrumb />
      </div>
      <div className=" flex justify-end items-center gap-3 ">
        <ToggleMode />
        <DropdownMenu>
          <DropdownMenuTrigger className=" focus-visible:outline-none ">
            <Avatar>
              <AvatarImage src="data:image/png;base64,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"/>
              <AvatarFallback></AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            className=" focus-visible:outline-none me-5 w-[150px] "
          >
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link to="/settings">
              <DropdownMenuItem className=" flex items-center gap-2 ">
                <UserCircle2 size={17} />
                Profile
              </DropdownMenuItem>
            </Link>
            <Link to="/settings">
              <DropdownMenuItem className=" flex items-center gap-2 ">
                <Settings2 size={18} />
                Settings
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className=" flex items-center gap-2 "
              onClick={handleLogout}
            >
              <Logout size={18} />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default TopHeader;

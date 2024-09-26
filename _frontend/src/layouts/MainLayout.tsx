import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthGuard, SideBar, MobileSideBar, ToggleMode } from "@/components";
import {
  AlertCircle,
  CheckCircle,
  Loader2,
  LogOut,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "@/components/ui/use-toast.ts";
import { removeUserInfo, selectUser } from "@/store/slice/auth";

const ServerStatus: React.FC<{ status: "online" | "offline" | "checking" }> = ({
  status,
}) => (
  <div className="flex items-center space-x-2">
    <span className="text-sm font-medium">Hardware API:</span>
    {status === "checking" && (
      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
    )}
    {status === "online" && <CheckCircle className="h-4 w-4 text-green-500" />}
    {status === "offline" && <AlertCircle className="h-4 w-4 text-red-500" />}
    <span className="text-sm text-muted-foreground capitalize">{status}</span>
  </div>
);

const MainLayout: React.FC = () => {
  const [serverStatus, setServerStatus] = useState<
    "online" | "offline" | "checking"
  >("checking");
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!(user && (user.id || user.uuid))) {
      toast({
        title: "Error",
        description:
          "User information is missing. Please try logging in again.",
        variant: "destructive",
      });
    }
  }, [user]);

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/health`);
      const data = await response.json();
      setServerStatus(data.status === "OK" ? "online" : "offline");
    } catch {
      setServerStatus("offline");
    }
  };

  useEffect(() => {
    checkServerHealth();
    const intervalId = setInterval(checkServerHealth, 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleLogout = () => {
    dispatch(removeUserInfo());
    navigate("/auth/sign-in");
  };

  return (
    <AuthGuard>
      <div className="bg-transparent dark:bg-[#09090b]">
        {/* Sidebar */}
        <div className="hidden lg:block fixed top-0 left-0 h-full w-52 bg-transparent dark:bg-dark">
          <SideBar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col ml-0 lg:ml-52">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-2 md:p-3.5 dark:bg-[#09090b]/70 backdrop-blur-md border-b border-gray-200 dark:border-white/20 ">
            {/* Left Side */}
            <div className="flex items-center space-x-4">
              <MobileSideBar />
              <ServerStatus status={serverStatus} />
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              <ToggleMode />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button>
                    <Avatar>
                      <AvatarImage src={user.avatarUrl} alt={user.username} />
                      <AvatarFallback>
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 dark:bg-[#09090b]"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.username}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="flex items-center"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 bg-light dark:bg-dark pb-16">
            <Outlet />
          </div>
        </div>
      </div>
    </AuthGuard>
  );
};

export default MainLayout;

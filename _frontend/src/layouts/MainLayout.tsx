import React, { useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthGuard, ToggleMode } from "@/components";
import { LogOut, Settings, Menu, Plus, Home, Settings as SettingsIcon, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { removeUserInfo, selectUser } from "@/store/slice/auth";
import MobileSideBar from "@/components/common/mobile-sidebar";
import SheetSideBar from "@/components/common/sheet-sidebar";
import LogoBlack from "@/components/common/logo-black.png";
import LogoWhite from "@/components/common/logo-white.png";

const MainLayout: React.FC = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && (user.id || user.uuid) && location.pathname === "/") {
      navigate("/dashboard");
    }
  }, [user, location.pathname, navigate]);

  useEffect(() => {
    if (!(user && (user.id || user.uuid))) {
      toast({
        title: "Error",
        description: "User information is missing. Please try logging in again.",
        variant: "destructive",
      });
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(removeUserInfo());
    navigate("/login");
  };

  return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-background">
          <header className="sticky top-0 z-10 bg-white dark:bg-dark1 border-b border-gray-200 dark:border-lightborder">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="flex items-center justify-between h-16">
                {/* Left section: Logo and Mobile Menu */}
                <div className="flex items-center">
                  <MobileSideBar />
                  <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">
                    <div className="relative w-8 h-8 mr-3 flex-shrink-0">
                      <img
                          src={LogoBlack}
                          alt="Logo"
                          className="absolute inset-0 w-full h-full object-contain dark:hidden"
                      />
                      <img
                          src={LogoWhite}
                          alt="Logo"
                          className="absolute inset-0 w-full h-full object-contain hidden dark:block"
                      />
                    </div>
                    <div className="font-semibold text-xl sm:text-2xl md:text-3xl text-gray-900 dark:text-white flex items-center">
                      <span className="inline-block transform translate-y-0.5">DAQROC</span>
                    </div>
                  </div>
                </div>

                {/* Center section: Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-4">
                  <SheetSideBar />
                </nav>

                {/* Right section: Theme toggle and user menu */}
                <div className="flex items-center">
                  <ToggleMode />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="ml-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatarUrl} alt={user.username} />
                          <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout} className="text-red-600 dark:text-red-400">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="container mx-auto px-4 lg:px-8 py-8">
            <Outlet />
          </main>
        </div>
      </AuthGuard>
  );
};

export default MainLayout;
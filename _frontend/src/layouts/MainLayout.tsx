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
import LogoBlack from "@/components/common/logoblackfull.png";
import LogoWhite from "@/components/common/logowhitefull.png";
import { Spacer, Tabs } from "@geist-ui/core";

const Footer = () => (
    <footer className="bg-white dark:bg-dark1 border-t dark:border-darkborder py-8">
      <div className="container mx-auto px-12">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-lighth1 dark:text-gray-400">© 2024 Flynn Research Group, University of Michigan</p>
          </div>
          <div className="flex space-x-6">
            <a href="https://github.com/your-github-link" className="text-sm text-lighth1 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">GitHub</a>
            <a href="https://ssel.eecs.umich.edu/" className="text-sm text-lighth1 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">MICL</a>
            <a href="https://flynn.engin.umich.edu/" className="text-sm text-lighth1 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white">Flynn Group</a>
          </div>
        </div>
      </div>
    </footer>
);


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

  const NavLink = ({ to, children }) => {
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            className={`
          px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ease-in-out
          ${isActive
                ? "font-black "
                : "text-gray-600 hover:text-light-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
            }
          ${isActive
                ? "dark:bg-primary-800 dark:text-white"
                : ""}
          relative
        `}
        >
          {children}
          {isActive && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-white dark:bg-primary-400"></span>
          )}
        </Link>
    );
  };

  return (
      <AuthGuard>
        <div className="min-h-screen bg-gray-50 dark:bg-background">
          <header className="sticky top-0 z-10 bg-white dark:bg-dark1 border-b dark:border-darkborder ">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between h-16">
                {/* Left section: Logo and Mobile Menu */}
                <div className="flex items-center w-1/3">
                  <Spacer w={1}/>
                  <MobileSideBar />
                  <div className="flex-shrink-0 flex items-center ml-2 lg:ml-0">

                    <div className="relative w-44">
                      <img
                          src={LogoBlack}
                          alt="Logo"
                          className="object-contain dark:hidden"
                      />
                      <img
                          src={LogoWhite}
                          alt="Logo"
                          className="hidden dark:block"
                      />
                    </div>
                  </div>
                </div>

                {/* Center section: Desktop Navigation */}
                <nav className="hidden lg:flex justify-center w-1/3">
                  <div className="flex space-x-4">
                    <NavLink to="/dashboard">Dashboard</NavLink>
                    <NavLink to="/new-test">New Test</NavLink>
                    <NavLink to="/settings">Settings</NavLink>
                  </div>
                </nav>


                {/* Right section: Theme toggle and user menu */}
                <div className="flex items-center justify-end w-1/3">
                  <ToggleMode />
                  <Spacer w={1}/>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                          variant="ghost"
                          size="sm"
                          className="p-0 hover:bg-transparent focus:bg-transparent active:bg-transparent focus:outline-none focus:ring-0 focus:opacity-80"
                      >
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
                  <Spacer w={1}/>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow">
            <Outlet />
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </AuthGuard>
  );
};

export default MainLayout;
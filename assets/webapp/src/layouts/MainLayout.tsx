import React, { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthGuard, SideBar } from "@/components";
import { MobileSideBar, ToggleMode } from "@/components";
import { AlertCircle, CheckCircle, Loader2, LogOut, Settings } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "@/components/ui/use-toast.ts";
import {removeUserInfo, selectUser} from "@/store/slice/auth";

const ServerStatus: React.FC<{ status: 'online' | 'offline' | 'checking' }> = ({ status }) => (
    <div className="flex items-center space-x-2">
        <span className="text-sm font-medium hidden sm:inline">Hardware API:</span>
        {status === 'checking' && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        {status === 'online' && <CheckCircle className="h-4 w-4 text-green-500" />}
        {status === 'offline' && <AlertCircle className="h-4 w-4 text-red-500" />}
        <span className="text-sm text-muted-foreground capitalize">{status}</span>
    </div>
);

const MainLayout: React.FC = () => {
    const isSideBarOpen = useSelector((state: any) => state.app.isSideBarOpen);
    const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        if (user && user.id) {
            setUserId(user.id);
        } else if (user && user.uuid) {
            setUserId(user.uuid);
        } else {
            toast({
                title: 'Error',
                description: 'User information is missing. Please try logging in again.',
                variant: 'destructive',
            });
        }
    }, [user]);

    const checkServerHealth = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/health`, { method: 'GET' });
            const data = await response.json();
            setServerStatus(data.status === "OK" ? 'online' : 'offline');
        } catch (error) {
            console.error('Error checking server health:', error);
            setServerStatus('offline');
        }
    };

    useEffect(() => {
        checkServerHealth();
        const intervalId = setInterval(checkServerHealth, 60000); // Check every minute
        return () => clearInterval(intervalId);
    }, []);
    const handleLogout = () => {
        dispatch(removeUserInfo());
        navigate("/auth/sign-in");
    };
    return (
        <AuthGuard>
            <div className="flex h-screen bg-white dark:bg-black">
                <div className="hidden lg:block w-52 bg-white dark:bg-dark border-r dark:border-white/20">
                    <SideBar />
                </div>
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center justify-between p-4 bg-white dark:bg-black border-b border-gray-200 dark:border-white/20">
                        <div className="flex items-center space-x-4">
                            <MobileSideBar />
                            <ServerStatus status={serverStatus} />
                        </div>
                        <div className="flex items-center space-x-4">
                            <ToggleMode />
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative border-none bg-transparent h-8 w-8 rounded-full">
                                        <Avatar>
                                            <AvatarImage src={user.avatarUrl} alt={user.username} />
                                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="end" forceMount>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex flex-col space-y-1">
                                            <p className="text-sm font-medium leading-none">{user.username}</p>
                                            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link to="/settings">
                                            <Settings className="mr-2 h-4 w-4" />
                                            <span>Settings</span>
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={handleLogout}>
                                        <LogOut  className="mr-2 h-4 w-4" />
                                        <span  > Log out</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-0.5 bg-white dark:bg-black">
                        <Outlet />
                    </div>
                </main>
            </div>
        </AuthGuard>
    );
};

export default MainLayout;
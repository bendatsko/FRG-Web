import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Link, useNavigate} from "react-router-dom";
import {Bell, LogOut, Menu, Settings} from "lucide-react";
import {toggleSideBarOpen} from "@/store/slice/app";
import {removeUserInfo, selectUser} from "@/store/slice/auth";
import {Button} from "@/components/ui/button";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {Badge} from "@/components/ui/badge";
import {BreadCrumb, MobileSideBar, ToggleMode} from "@/components";

const TopHeader: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isSideBarOpen = useSelector((state: any) => state.app.isSideBarOpen);
    const [notifications, setNotifications] = useState([]);
    const user = useSelector(selectUser);

    const handleLogout = () => {
        dispatch(removeUserInfo());
        navigate("/auth/sign-in");
    };

    const fetchNotifications = async () => {
        try {
            const response = await fetch(`http://10.1.10.248:3001/notifications?user_id=1`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Fetched notifications:', data);  // Print out the received data
            setNotifications(data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };


    const clearNotifications = async () => {
        try {
            const response = await fetch(`http://10.1.10.248:3001/notifications/clear`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({user_id: 1})  // Ensure user.id is the correct and intended ID
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            setNotifications([]);  // Clear notifications in state if successful
        } catch (error) {
            console.error('Error clearing notifications:', error);
        }
    };


    useEffect(() => {
        fetchNotifications();
    }, [user]);

    return (
        <header className="w-full h-16 flex justify-between items-center px-4 border-b dark:border-white/20">
            <div className="flex items-center space-x-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="lg:flex hidden"
                    onClick={() => dispatch(toggleSideBarOpen())}
                >
                    <Menu className="h-5 w-5"/>
                </Button>
                <MobileSideBar/>
                <BreadCrumb/>
            </div>
            <div className="flex items-center space-x-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <Bell className="h-5 w-5"/>
                            {notifications.length > 0 && (
                                <Badge variant="destructive" className="absolute -top-1 -right-1 px-1 py-0.5 text-xs">
                                    {notifications.length}
                                </Badge>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {notifications.length === 0 ? (
                            <DropdownMenuItem>No new notifications</DropdownMenuItem>
                        ) : (
                            notifications.map((notification, index) => (
                                <DropdownMenuItem key={index}>{notification.message}</DropdownMenuItem>
                            ))
                        )}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem onClick={clearNotifications}>
                            Clear all notifications
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                <ToggleMode/>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user.avatarUrl} alt={user.username}/>
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
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem asChild>
                            <Link to="/settings">
                                <Settings className="mr-2 h-4 w-4"/>
                                <span>Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleLogout}>
                            <LogOut className="mr-2 h-4 w-4"/>
                            <span>Log out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
};

export default TopHeader;
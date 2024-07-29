import React, {useEffect, useState} from "react";
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
import {Bell, UserCircle2} from "lucide-react";
import {Logout, Settings2} from "tabler-icons-react";
import {removeUserInfo, selectUser} from "@/store/slice/auth";
import {Badge} from "@/components/ui/badge";

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
        <>
            <div className="w-full h-16 flex justify-between items-center px-3 border-b-2 dark:border-foreground">
                <div className="flex gap-2 items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full lg:flex items-center hidden"
                        onClick={() => dispatch(toggleSideBarOpen())}
                    >
                        {isSideBarOpen ? (
                            <RiMenuFoldLine className="h-5 w-5"/>
                        ) : (
                            <RiMenuUnfoldLine className="h-5 w-5"/>
                        )}
                    </Button>

                    <MobileSideBar/>

                    <BreadCrumb/>
                </div>
                <div className="flex justify-end items-center gap-3">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="relative">
                                <Bell className="h-5 w-5"/>
                                {notifications.length > 0 && (
                                    <Badge className="absolute -top-1 -right-1 px-1.5 py-0.5 text-xs">
                                        {notifications.length}
                                    </Badge>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 mt-2">
                            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            {notifications.length === 0 ? (
                                <DropdownMenuItem>No new notifications</DropdownMenuItem>
                            ) : (
                                notifications.map((notification, index) => (
                                    <DropdownMenuItem key={index} className="py-2">
                                        {notification.message}
                                    </DropdownMenuItem>
                                ))
                            )}
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem onClick={clearNotifications} className="text-primary">
                                Clear all notifications
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <ToggleMode/>
                    <DropdownMenu>
                        <DropdownMenuTrigger className="focus:outline-none">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src="https://ui.shadcn.com/avatars/03.png"/>
                                <AvatarFallback>User</AvatarFallback>
                            </Avatar>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom" align="end" className="w-56 mt-2">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator/>
                            <Link to="/settings">
                                <DropdownMenuItem className="flex items-center gap-2 py-2">
                                    <UserCircle2 className="h-4 w-4"/>
                                    Profile
                                </DropdownMenuItem>
                            </Link>
                            <Link to="/settings">
                                <DropdownMenuItem className="flex items-center gap-2 py-2">
                                    <Settings2 className="h-4 w-4"/>
                                    Settings
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuSeparator/>
                            <DropdownMenuItem
                                className="flex items-center gap-2 py-2 text-red-500"
                                onClick={handleLogout}
                            >
                                <Logout className="h-4 w-4"/>
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>

            </div>

        </>
    );
};

export default TopHeader;
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
            const response = await fetch(`http://localhost:3001/notifications?user_id=1`);
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
            const response = await fetch(`http://localhost:3001/notifications/clear`, {
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
    }, [user]); // This ensures fetchNotifications is called when user data changes


    return (
        <div className="pl-2 w-full h-14 flex justify-between items-center pr-2"
             style={{backgroundColor: 'rgba(10, 10, 10, 1)', borderBottom: '2px solid rgba(36, 36, 36, 1)'}}>

            <div className="flex gap-2 items-center">
                <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-none shadow-none hidden lg:flex items-center"
                    onClick={() => dispatch(toggleSideBarOpen())}
                >
                    {isSideBarOpen ? (
                        <RiMenuFoldLine className="text-xl"/>
                    ) : (
                        <RiMenuUnfoldLine className="text-xl"/>
                    )}
                </Button>

                <MobileSideBar/>

                <BreadCrumb/>
            </div>
            <div className="flex justify-end items-center gap-3">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon" className="button-relative">
                            <Bell className="h-[1.2rem] w-[1.2rem]"/>
                            {notifications.length > 0 && (
                                <Badge className="badge">
                                    {notifications.length}
                                </Badge>
                            )}
                        </Button>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        {notifications.length === 0 ? (
                            <DropdownMenuItem>No new notifications</DropdownMenuItem>
                        ) : (
                            notifications.map((notification, index) => (
                                <DropdownMenuItem key={index}>
                                    {notification.message}
                                </DropdownMenuItem>
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
                    <DropdownMenuTrigger className="focus-visible:outline-none">
                        <Avatar>
                            <AvatarImage src="https://ui.shadcn.com/avatars/03.png"/>
                            <AvatarFallback></AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        side="bottom"
                        className="focus-visible:outline-none me-5 w-[150px]"
                    >
                        <DropdownMenuLabel>My Account</DropdownMenuLabel>
                        <DropdownMenuSeparator/>
                        <Link to="/settings">
                            <DropdownMenuItem className="flex items-center gap-2">
                                <UserCircle2 size={17}/>
                                Profile
                            </DropdownMenuItem>
                        </Link>
                        <Link to="/settings">
                            <DropdownMenuItem className="flex items-center gap-2">
                                <Settings2 size={18}/>
                                Settings
                            </DropdownMenuItem>
                        </Link>
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className="flex items-center gap-2"
                            onClick={handleLogout}
                        >
                            <Logout size={18}/>
                            Logout
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
};

export default TopHeader;
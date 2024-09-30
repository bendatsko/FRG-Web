import React, { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import menus from "@/services/data/menus";
import { selectUser } from "@/store/slice/auth";

const MenuItem = React.memo(({ menu, isActive, onClick, isMobile }) => (
    <Button
        variant="ghost"
        className={`justify-start rounded-none ${
            isActive ? " border-b border-black dark:bg-gray-800" : ""
        } ${isMobile ? "w-full py-3" : "py-2 px-3"}`}
        onClick={onClick}
    >
        {/*{menu.icon && <span className="">{menu.icon}</span>}*/}
        <span className="font-medium">{menu.title}</span>
    </Button>
));

const DropdownMenuItem = React.memo(
    ({ menu, onItemClick, activePathname, isMobile }) => (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={`justify-between ${isMobile ? "w-full py-3" : "py-2 px-3"}`}>
                    <span className="flex items-center">
                        {menu.icon && <span className="mr-3">{menu.icon}</span>}
                        <span className="font-medium">{menu.title}</span>
                    </span>
                    <ChevronDown className="ml-2" size={16} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className={isMobile ? "w-full" : ""}>
                {menu.children?.map((child) => (
                    <DropdownMenuItem
                        key={child.link}
                        onClick={() => onItemClick(child)}
                        className={activePathname === child.link ? "bg-gray-100 dark:bg-gray-800" : ""}
                    >
                        {child.icon && <span className="mr-3">{child.icon}</span>}
                        {child.title}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
);

const SheetSideBar = ({ isMobile = false }) => {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useSelector(selectUser);

    useEffect(() => {
        console.log("SheetSideBar isMobile prop:", isMobile);
    }, [isMobile]);

    const filteredMenus = menus.filter(
        (menu) => !menu.requiredRole || menu.requiredRole.includes(user.role)
    );

    const handleNavigate = useCallback(
        (menu) => {
            navigate(menu.link);
        },
        [navigate]
    );

    const mobileClassName = "flex flex-col space-y-1 w-full";
    const desktopClassName = "flex flex-row items-center space-x-2";

    const navClassName = isMobile ? mobileClassName : desktopClassName;

    console.log("SheetSideBar rendered with navClassName:", navClassName);

    return (
        <nav className={navClassName}>
            <div className={isMobile ? "text-red-500" : "text-blue-500"}>
                {isMobile ? "" : ""}
            </div>
            {filteredMenus.map((menu, index) =>
                menu.children ? (
                    <DropdownMenuItem
                        key={index}
                        menu={menu}
                        onItemClick={handleNavigate}
                        activePathname={pathname}
                        isMobile={isMobile}
                    />
                ) : (
                    <MenuItem
                        key={menu.link}
                        menu={menu}
                        isActive={pathname === menu.link}
                        onClick={() => handleNavigate(menu)}
                        isMobile={isMobile}
                    />
                )
            )}
        </nav>
    );
};

export default SheetSideBar;
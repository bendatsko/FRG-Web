import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DAQROCLogo } from "@/components/common/DaqrocSquareIcon";
import {ChevronDown, ChevronUp, LogOut} from "lucide-react";
import menus from "@/services/data/menus";
import { selectUser } from "@/store/slice/auth";
import { MenuItemType } from "@/types";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {Avatar} from "@geist-ui/core";
import {AvatarFallback, AvatarImage} from "@radix-ui/react-avatar";
import {ToggleMode} from "@/components";

const MenuItem: React.FC<{
    menu: MenuItemType;
    isActive: boolean;
    onClick: () => void;
}> = React.memo(({ menu, isActive, onClick }) => (
    <Button
        variant="ghost"
        className={`w-full justify-start py-2 px-0 text-sm `}
        onClick={onClick}
    >
        {menu.icon}
        <span className="ml-3 font-medium">{menu.title}</span>
    </Button>
));

const CollapsibleMenuItem: React.FC<{
    menu: MenuItemType;
    isOpen: boolean;
    onToggle: () => void;
    onItemClick: (item: MenuItemType) => void;
    activePathname: string;
}> = React.memo(({ menu, isOpen, onToggle, onItemClick, activePathname }) => (
    <Collapsible open={isOpen} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between py-2 px-3 text-sm">
                <span className="flex items-center">
                    {menu.icon}
                    <span className="ml-3 font-medium">{menu.title}</span>
                </span>
                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="pl-6">
            {menu.children?.map((child) => (
                <MenuItem
                    key={child.link}
                    menu={child}
                    isActive={activePathname === child.link}
                    onClick={() => onItemClick(child)}
                />
            ))}
        </CollapsibleContent>
    </Collapsible>
));

const Header: React.FC<{ onLogoClick: () => void }> = React.memo(({ onLogoClick }) => (
    <div className=" flex items-center mb-2 mt-2">
        <div className="flex items-center space-x-2 w-full">
            <DAQROCLogo className=" h-6 w-6 cursor-pointer" onClick={onLogoClick} />
                <span className="font-bold text-xl ">DAQROC</span>
        </div>
    </div>
));

const SheetSideBar: React.FC = () => {
    const [openMenus, setOpenMenus] = useState<Set<number>>(new Set());
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useSelector(selectUser);

    const filteredMenus = menus.filter(menu =>
        !menu.requiredRole || menu.requiredRole.includes(user.role)
    );



    const handleLogout = () => {
        dispatch(removeUserInfo());
        navigate("/auth/sign-in");
    };


    const handleOpenDropDownSideBar = useCallback((index: number) => {
        setOpenMenus((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(index)) {
                newSet.delete(index);
            } else {
                newSet.add(index);
            }
            return newSet;
        });
    }, []);

    const handleNavigate = useCallback((menu: MenuItemType) => {
        navigate(menu.link);
    }, [navigate]);

    return (
        <div className="flex flex-col h-screen bg-white dark:bg-black  mx-3 border-r dark:border-[#333333]">
            <div className="mt-4">

            
            <Header onLogoClick={() => navigate('/')} />
            <ScrollArea className="flex-grow">
                <nav className="">
                    {filteredMenus.map((menu, index) => (
                        menu.children ? (
                            <CollapsibleMenuItem
                                key={index}
                                menu={menu}
                                isOpen={openMenus.has(index)}
                                onToggle={() => handleOpenDropDownSideBar(index)}
                                onItemClick={handleNavigate}
                                activePathname={pathname}
                            />
                        ) : (
                            <MenuItem
                                key={menu.link}
                                menu={menu}
                                isActive={pathname === menu.link}
                                onClick={() => handleNavigate(menu)}
                            />
                        )
                    ))}
                </nav>
            </ScrollArea>
            </div>
        </div>
    );
};

export default SheetSideBar;



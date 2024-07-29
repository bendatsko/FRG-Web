import React, {useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {Collapsible} from "@/components/ui/collapsible";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {DAQROCLogo} from "@/components/common/DaqrocSquareIcon.tsx";
import menusList from "@/services/data/menus";
import {MenuItemType} from "@/types";

const SheetSideBar: React.FC = () => {
    const [menus, setMenus] = useState<MenuItemType[]>(menusList);
    const navigate = useNavigate();
    const {pathname} = useLocation();

    const handleOpenDropDownSideBar = (index: number) => {
        const updatedMenus = [...menus];
        updatedMenus[index].isOpen = !updatedMenus[index].isOpen;
        setMenus(updatedMenus);
    };

    const handleNavigate = (menu: MenuItemType) => {
        navigate(menu.link);
    };

    return (
        <div className="flex flex-col w-48 h-full border-r dark:border-white/20">
            <div className="h-16 flex items-center px-4 border-b dark:border-white/20">
                <div className="flex items-center justify-center">
                    <DAQROCLogo className="h-8 w-8 "/>
                    <span className="font-bold items-center text-3xl">DAQROC</span>
                </div>
            </div>
            <ScrollArea className="flex-grow">
                <nav className="p-2 space-y-1">
                    {menus.map((menu, index) => (
                        <React.Fragment key={index}>
                            {menu.children ? (
                                <Collapsible className="">

                                </Collapsible>
                            ) : (
                                <Button
                                    variant="ghost"
                                    className={`w-full justify-start py-2 px-3 text-sm ${pathname === menu.link ? "bg-accent" : ""}`}
                                    onClick={() => handleNavigate(menu)}
                                >
                                    {menu.icon}
                                    <span className="ml-3 font-medium">{menu.title}</span>
                                </Button>
                            )}
                        </React.Fragment>
                    ))}
                </nav>
            </ScrollArea>
        </div>
    );
};

export default SheetSideBar;
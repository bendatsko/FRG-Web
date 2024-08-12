import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DAQROCLogo } from "@/components/common/DaqrocSquareIcon";
import { ChevronDown, ChevronUp } from "lucide-react";
import menus from "@/services/data/menus";
import { selectUser } from "@/store/slice/auth";
import { MenuItemType } from "@/types";

const MenuItem = React.memo(({ menu, isActive, onClick }) => (
    <Button
        variant="ghost"
        className={`w-full justify-start py-3 px-4 text-base ${
            isActive ? "bg-gray-100 dark:bg-gray-800" : ""
        }`}
        onClick={onClick}
    >
        {menu.icon && <span className="mr-3">{menu.icon}</span>}
        <span className="font-medium">{menu.title}</span>
    </Button>
));

const CollapsibleMenuItem = React.memo(
    ({ menu, isOpen, onToggle, onItemClick, activePathname }) => (
        <Collapsible open={isOpen} onOpenChange={onToggle}>
            <CollapsibleTrigger asChild>
                <Button
                    variant="ghost"
                    className="w-full justify-between py-3 px-4 text-base"
                >
          <span className="flex items-center">
            {menu.icon && <span className="mr-3">{menu.icon}</span>}
              <span className="font-medium">{menu.title}</span>
          </span>
                    {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-8">
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
    )
);

const Header = React.memo(({ onLogoClick }) => (
    <div className="flex items-center p-4 mb-4">
        <DAQROCLogo
            className="h-8 w-8 cursor-pointer mr-3"
            onClick={onLogoClick}
        />
        <span className="font-bold text-2xl">DAQROC</span>
    </div>
));

const SheetSideBar = () => {
    const [openMenus, setOpenMenus] = useState(new Set());
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const user = useSelector(selectUser);

    const filteredMenus = menus.filter(
        (menu) => !menu.requiredRole || menu.requiredRole.includes(user.role)
    );

    const handleOpenDropDownSideBar = useCallback((index) => {
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

    const handleNavigate = useCallback(
        (menu) => {
            navigate(menu.link);
        },
        [navigate]
    );

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black border-r dark:border-gray-800">
            <Header onLogoClick={() => navigate("/")} />
            <ScrollArea className="flex-grow px-2">
                <nav className="space-y-1">
                    {filteredMenus.map((menu, index) =>
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
                    )}
                </nav>
            </ScrollArea>
        </div>
    );
};

export default SheetSideBar;
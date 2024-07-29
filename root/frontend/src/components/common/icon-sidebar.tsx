import React from "react";
import {Link, useLocation} from "react-router-dom";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {ScrollArea} from "@/components/ui/scroll-area";
import {DAQROCLogo} from "@/components/common/DaqrocSquareIcon.tsx";
import menusList from "@/services/data/menus";

const IconSidebar: React.FC = () => {
    const {pathname} = useLocation();

    return (
        <div className="w-16 h-screen fixed top-0 left-0 border-r dark:border-gray-800 flex flex-col">
            <div className="h-16 flex items-center justify-center border-b dark:border-gray-800">
                <DAQROCLogo className="h-8 w-8"/>
            </div>
            <ScrollArea className="flex-grow">
                <div className="py-4 space-y-2">
                    {menusList.map((menu: any, index) => (
                        <Tooltip key={index} delayDuration={300}>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    asChild
                                    className={`w-16 h-16 ${pathname === menu.link ? "bg-accent" : ""}`}
                                >
                                    <Link to={menu.link}>
                                        {menu.icon}
                                    </Link>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                                <p>{menu.title}</p>
                            </TooltipContent>
                        </Tooltip>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
};

export default IconSidebar;
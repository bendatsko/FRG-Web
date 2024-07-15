import React, {useEffect, useState} from "react";
import {Card, CardContent} from "@/components/ui/card";
import {Collapsible, CollapsibleContent, CollapsibleTrigger,} from "@/components/ui/collapsible";
import menusList from "@/services/data/menus";
import {ChevronDown, ChevronUp, LetterI} from "tabler-icons-react";
import {useLocation, useNavigate} from "react-router";
import {DAQROCLogo} from "@/components/common/DaqrocSquareIcon.tsx";

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

    const handleNavigate = (menus: MenuItemType) => {
        navigate(`${menus.link}`);
    };

    // Disable Pointer Envent None
    useEffect(() => {
        // Function to check and remove pointer-events style if it's set to 'none'
        const checkAndRemovePointerEvents = () => {
            const bodyElement = document.body;
            const bodyStyles = window.getComputedStyle(bodyElement);
            const currentPointerEvents = bodyStyles.pointerEvents;

            // Check if pointer-events is set to 'none' and remove it
            if (currentPointerEvents === "none") {
                bodyElement.style.pointerEvents = "";
            }
        };

        // Check and remove pointer-events initially
        checkAndRemovePointerEvents();

        // Set up an interval to periodically check and remove pointer-events style
        const intervalId = setInterval(checkAndRemovePointerEvents, 1000); // You can adjust the interval time as needed

        // Clean up interval on component unmount
        return () => clearInterval(intervalId);
    }, []);

    return (
        <Card className=" h-full w-60 fixed top-0 start-0 rounded-none overflow-y-auto  ">
            <CardContent className=" shadow-none m-0 p-0 focus-visible:outline-none">
                <div
                    className="w-full overflow-y-auto rounded-none shadow-none  dark:border-foreground ">
                    <div className="w-full h-14 flex justify-between items-center"
                         style={{
                             marginTop: '-1px',

                         }}>
                        <div className="w-full px-11 h-14 flex items-center gap-1 lg:text-lg">
                            <DAQROCLogo className=" lg:text-xl "/>
                            <a className="font-semibold text-2xl">
                                DAQROC
                            </a>

                        </div>
                    </div>

                    <div className="flex flex-col dark:text-light">
                        {menus?.map((menu, index) => (
                            <React.Fragment key={index}>
                                {menu.children ? (
                                    <Collapsible className="flex flex-col items-start">
                                        <CollapsibleTrigger
                                            className="nav-link hover:nav-active w-full flex justify-between items-center focus-visible:outline-none"
                                            onClick={() => handleOpenDropDownSideBar(index)}
                                        >
                                            <div className="flex gap-2 items-center">
                                                {menu.icon && menu.icon}
                                                {menu.title}
                                            </div>


                                            {menu.isOpen ? (
                                                <ChevronUp size={18} strokeWidth={2}/>
                                            ) : (
                                                <ChevronDown size={18} strokeWidth={2}/>
                                            )}
                                        </CollapsibleTrigger>
                                        <CollapsibleContent className="collapsibleDropdown" asChild>
                                            <ul className="w-full ps-2">
                                                {menu.children.map((child, childIndex) => (
                                                    <li
                                                        key={childIndex}
                                                        className="nav-link py-2 hover:nav-active "
                                                        onClick={() => handleNavigate(child)}
                                                    >
                                                        <LetterI size={18} strokeWidth={2}/>
                                                        {child.icon && child.icon}
                                                        {child.title}
                                                    </li>
                                                ))}
                                            </ul>
                                        </CollapsibleContent>
                                    </Collapsible>
                                ) : (
                                    <div
                                        className={
                                            "nav-link hover:nav-active " +
                                            (pathname == menu.link && "nav-active")
                                        }
                                        onClick={() => handleNavigate(menu)}
                                    >
                                        {menu.icon && menu.icon}
                                        {menu.title}
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SheetSideBar;

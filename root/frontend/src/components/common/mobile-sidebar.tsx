import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {Sheet, SheetContent, SheetTrigger} from "@/components/ui/sheet";
import {Button} from "@/components/ui/button";
import {Menu} from "lucide-react";
import {SheetSideBar} from "@/components";

const MobileSideBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setOpen(false);
    }, [location]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden dark:bg-black">
                    <Menu className="h-5 w-5"/>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-50 border-r-black/20 dark:border-r-white/20">
                <SheetSideBar/>
            </SheetContent>
        </Sheet>
    );
};

export default MobileSideBar;
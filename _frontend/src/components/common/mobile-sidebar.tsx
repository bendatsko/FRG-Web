import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import SheetSideBar from "@/components/common/sheet-sidebar";

const MobileSideBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Close the sidebar when the route changes
        setOpen(false);
    }, [location]);

    console.log("MobileSideBar rendering SheetSideBar with isMobile=true");

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>

                <Button variant="ghost" size="icon" className="lg:hidden display-none border border-none">
                    <Menu className="h-7 w-7" aria-label="Open Sidebar" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-4 w-64">
                <div className="text-sm text-gray-500 mb-4">Menu:</div>
                <SheetSideBar isMobile={true} />
            </SheetContent>
        </Sheet>
    );
};

export default MobileSideBar;
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { SheetSideBar } from "@/components";

const MobileSideBar: React.FC = () => {
    const [open, setOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // Close the sidebar when the route changes
        setOpen(false);
    }, [location]);

    return (
        <Sheet open={open} onOpenChange={setOpen}>
    <SheetTrigger asChild>
    <Button variant="ghost" size="icon" className="lg:hidden display-none border border-foreground">
        <Menu className="h-7 w-7 " aria-label="Open Sidebar" />
    </Button>
     </SheetTrigger>
        <SheetContent side="left" className="p-0 w-56">
        <SheetSideBar />
        </SheetContent>
        </Sheet>
);
};

export default MobileSideBar;
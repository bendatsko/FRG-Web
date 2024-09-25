// @ts-nocheck

import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, ChevronUp } from "lucide-react";
import menus from "@/services/data/menus";
import { selectUser } from "@/store/slice/auth";

// Import both logos
import logo from './logo-black.png';
import logoWhite from './logo-white.png'; // Adjust the path as necessary

const MenuItem = React.memo(({ menu, isActive, onClick }) => (
  <Button
    variant="ghost"
    className={`w-full justify-start py-2 px-4 text-sm ${
      isActive ? " bg-light dark:bg-dark" : ""
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
  <div className="flex items-center p-4 ml-1 border-b border-black/10 dark:border-white/20">
    {/* Light Mode Logo */}
    <img
      src={logo}
      alt="Logo"
      className="h-7 w-7 cursor-pointer mr-1 mt-0.5 bg-transparent dark:hidden"
      onClick={onLogoClick}
    />
    {/* Dark Mode Logo */}
    <img
      src={logoWhite}
      alt="Logo"
      className="h-7 w-7 cursor-pointer mr-1 mt-0.5 bg-transparent hidden dark:block"
      onClick={onLogoClick}
    />
    <span className="font-bold text-3xl">DAQROC</span>
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
    <div className="h-full bg-[#fafafa] dark:bg-[#09090b] border-r dark:border-white/20">
      <Header onLogoClick={() => navigate("/")} />
      <ScrollArea className="h-[calc(100%-64px)]">
        <nav className="space-y-1 p-2">
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

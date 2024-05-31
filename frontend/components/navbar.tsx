import {
  Image,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button, ButtonGroup, User, Avatar,
} from "@nextui-org/react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import DarkImg from "@/public/blockm-white.png";
import LightImg from "@/public/blockm-black.png";
import { useMsal } from "@azure/msal-react";




//=============================================================
//                         Navbar
//=============================================================
// This stores the user's account information throughout
// the time they're on the site. It's the root of much of the
// site's functionality along with the index.tsx page.


const Navbar = ({ userName, email, isAdmin, setCurrentPage }) => {
  const router = useRouter();
  const [currentPage, setCurrentPageInternal] = useState("home");
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { instance } = useMsal();



  useEffect(() => {
    setIsMounted(true);
  }, []);

  const logoSrc = !isMounted
      ? DarkImg.src
      : resolvedTheme === "dark"
          ? DarkImg.src
          : LightImg.src;

  const handleLogout = () => {
    router.push("/logout"); // Redirect to the logout page
  };

  const handleNavigation = (page) => {
    setCurrentPage(page);
    setCurrentPageInternal(page);
  };

  if (!isMounted) return null;

  return (
      <NextUINavbar maxWidth="xl" position="sticky" isBordered className="py-2 px-3">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <button onClick={() => handleNavigation('home')} className="flex justify-start items-center gap-1" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              <div style={{ display: "flex", justifyContent: "center", paddingRight: ".1rem" }}>
                <Image
                    src={logoSrc}
                    width={25}
                    height={25}
                    radius="none"
                    alt={`FRG Logo (${resolvedTheme || "default"} Mode)`}
                />
              </div>
              <p style={{ paddingLeft: ".1rem" }} className="text-white text-2xl hidden sm:inline font-semibold">
                DAQROC
              </p>
            </button>
            {/*<p className="text-white text-lg hidden sm:inline">*/}
            {/*  Hello, {userName || "User"}*/}
            {/*</p>*/}
            <NavbarItem>
              <Button className="bg-tr" disableRipple radius={"sm"} onClick={() => handleNavigation('home')} >
                Your History
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Button className="bg-tr" disableRipple radius={"sm"} onClick={() => handleNavigation('docs')} >
                Documentation
              </Button>
            </NavbarItem>
            <NavbarItem>
              <Dropdown placement="bottom-end">
                <DropdownTrigger>
                  <Button className="bg-white" color={"success"}  radius={"sm"} disableRipple>
                    New Test
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="New Test Options">
                  <DropdownItem key="ldpc" onClick={() => handleNavigation('create')}>
                    LDPC
                  </DropdownItem>

                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="basis-1/5 sm:basis-full flex items-center" justify="end">



            <NavbarItem>
              <Dropdown placement="bottom-start">
                <DropdownTrigger>
                  <User
                      as="button"
                      className="transition-transform"
                      description={email || "user@example.com"}
                      name={userName || "User"}
                  />
                </DropdownTrigger>
                <DropdownMenu aria-label="User Actions" variant="flat">

                  {isAdmin && (
                      <DropdownItem onClick={() => handleNavigation('admin')}>
                          Admin Panel
                      </DropdownItem>
                  )}
                  <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                    Log Out
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </NavbarItem>
        </NavbarContent>
      </NextUINavbar>
  );
};

export default Navbar;

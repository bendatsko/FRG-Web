import {
  Image,
  Link,
  Navbar as NextUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import NextLink from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import DarkImg from "@/public/blockm-white.png";
import LightImg from "@/public/blockm-black.png";
import { useMsal } from "@azure/msal-react";

const Navbar = ({ userName }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState("home");
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

  useEffect(() => {
    const handleRouteChange = (url) => {
      if (url.startsWith("/home")) {
        setCurrentPage("home");
      } else if (url.startsWith("/create")) {
        setCurrentPage("create");
      } else if (url.startsWith("/docs")) {
        setCurrentPage("docs");
      }
    };

    handleRouteChange(router.pathname);
    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const handleNavigation = (path) => {
    router.push(path);
  };


  if (!isMounted) return null;

  return (
      <NextUINavbar maxWidth="xl" position="sticky" isBordered className="py-2 px-3">
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            <NextLink className="flex justify-start items-center gap-1" href="/home">
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
            </NextLink>
            <p className="text-white text-md hidden sm:inline font-semibold">
              Hello, {userName || "User"}
            </p>
          </NavbarBrand>
        </NavbarContent>
        <NavbarContent className="basis-1/5 sm:basis-full flex items-center" justify="end">
          <NavbarItem>
            <NextLink href="/" passHref>
              <span className="text-md font-normal">Home</span>
            </NextLink>
          </NavbarItem>
          <NavbarItem>

            <Dropdown>

              <DropdownTrigger>
                <NextLink href="/" passHref>
                  <span className="text-md" >Create</span>
                </NextLink>
              </DropdownTrigger>
              <DropdownMenu aria-label="New Test Options">
                <DropdownItem key="ldpc" onClick={() => handleNavigation('/create/ldpc')}>
                  LDPC
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
          <NavbarItem>
            <NextLink href="/docs" passHref>
              <span className="text-md">Docs</span>
            </NextLink>
          </NavbarItem>
          <NavbarItem>
            <button onClick={handleLogout} className="text-md" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
              <NextLink href="/" passHref>
                <span className="text-md">Log out</span>
              </NextLink>
            </button>
          </NavbarItem>
        </NavbarContent>
      </NextUINavbar>
  );
};

export default Navbar;

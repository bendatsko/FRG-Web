import {Image, Link, Navbar as NextUINavbar, NavbarBrand, NavbarContent, NavbarItem,} from "@nextui-org/react";
import NextLink from "next/link";
import React, {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {ThemeSwitch} from "@/components/theme-switch";
import {useTheme} from "next-themes";
import DarkImg from "@/public/blockm-white.png";
import LightImg from "@/public/blockm-black.png";

export const Navbar = () => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState("home");
    const [isMounted, setIsMounted] = useState(false);
    const {resolvedTheme} = useTheme();
    const getColorForTab = (tab: string) =>
        currentPage === tab ? "primary" : "foreground";

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const logoSrc = !isMounted
        ? DarkImg.src
        : resolvedTheme === "dark"
            ? DarkImg.src
            : LightImg.src;

    const handleLogout = () => {
        router.push("/");
    };

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            if (url.startsWith("/home")) {
                setCurrentPage("home");
            } else if (url.startsWith("/create")) {
                setCurrentPage("create");
            }
        };

        // Set initial state based on the current route
        handleRouteChange(router.pathname);

        // Listen to route changes
        router.events.on("routeChangeComplete", handleRouteChange);
        return () => {
            router.events.off("routeChangeComplete", handleRouteChange);
        };
    }, [router]);

    if (!isMounted) return null;

    return (
        <>
            <NextUINavbar maxWidth="xl" position="sticky" isBordered>
                <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                    <NavbarBrand className="gap-3 max-w-fit">
                        <NextLink
                            className="flex justify-start items-center gap-1"
                            href="/home"
                        >
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    paddingRight: ".1rem",
                                }}
                            >
                                <Image
                                    src={logoSrc}
                                    width={20}
                                    height={20}
                                    radius="none"
                                    alt={`FRG Logo (${resolvedTheme || "default"} Mode)`}
                                />
                            </div>
                            {/*<p className="font-bold text-inherit">FLYNN LAB</p>*/}
                        </NextLink>
                        <p className="font-normal text-inherit">Hello, User</p>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="basis-1/5 sm:basis-full flex items-center" justify="end">
                    <NavbarItem isActive={currentPage === "home"}>
                        <NextLink href="/home" passHref>
                            <Link color={getColorForTab("home")} aria-current="page">
                                Home
                            </Link>
                        </NextLink>
                    </NavbarItem>
                    <NavbarItem isActive={currentPage === "create"}>
                        <NextLink href="/create" passHref>
                            <Link color={getColorForTab("create")}>New test</Link>
                        </NextLink>
                    </NavbarItem>
                    <NavbarItem>
                        <NextLink href="/" passHref onClick={handleLogout}>
                            <Link color="foreground">Log out</Link>
                        </NextLink>
                    </NavbarItem>
                    <NavbarItem className="flex items-center">
                        <ThemeSwitch/>
                    </NavbarItem>
                </NavbarContent>
            </NextUINavbar>
        </>
    );
};

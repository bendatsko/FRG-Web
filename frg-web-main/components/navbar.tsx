import {
    Badge,
    Button,
    Divider,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Input,
    Kbd,
    Link,
    Navbar as NextUINavbar,
    NavbarBrand,
    NavbarContent,
    NavbarMenu,
    NavbarMenuItem,
    Tab,
    Tabs,
    User,
} from "@nextui-org/react";
import {siteConfig} from "@/config/site";
import NextLink from "next/link";
import React, {useEffect, useState} from "react";
import {SearchIcon} from "@/components/icons";
import {useRouter} from "next/router";
import {ThemeSwitch} from "@/components/theme-switch";
import {useTheme} from "next-themes";
import DarkImg from "@/public/blockm-white.png";
import LightImg from "@/public/blockm-black.png";
import {NotificationIcon} from "@/components/NotificationIcon";


export const Navbar = () => {
    const searchInput = (
        <Input
            aria-label="Search"
            classNames={{
                inputWrapper: "bg-default-100",
                input: "text-sm",
            }}
            endContent={
                <Kbd className="hidden lg:inline-block" keys={["command"]}>
                    K
                </Kbd>
            }
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
                <SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0"/>
            }
            type="search"
        />
    );

    const router = useRouter();
    const [currentPage, setCurrentPage] = useState("home");

    const handleTabChange = (key: string) => {
        switch (key) {
            case "home":
                router.push("/home");
                break;
            case "create":
                router.push("/create");
                break;
            default:
                break;
        }
    };

    const [isMounted, setIsMounted] = useState(false);
    const {resolvedTheme} = useTheme();

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

    const tabs = [
        {
            id: "home",
            label: "Home",
        },
        {
            id: "create",
            label: "Run New Test",
        },
    ];

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

    return (
        <>
            <NextUINavbar maxWidth="xl" position="sticky">
                <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                    <NavbarBrand className="gap-3 max-w-fit">
                        <NextLink className="flex justify-start items-center gap-1" href="/home">
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent: "center",
                                }}
                            >
                                <Image
                                    src={logoSrc}

                                    width={30}
                                    height={30}
                                    radius={0}
                                    alt={`FRG Logo (${resolvedTheme || "default"} Mode)`}
                                />
                            </div>
                        </NextLink>
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
                    <Tabs
                        aria-label="Dynamic tabs"
                        items={tabs}
                        selectedKey={currentPage}
                        onSelectionChange={handleTabChange}
                    >
                        {(item) => (
                            <Tab key={item.id} title={item.label}></Tab>
                        )}
                    </Tabs>
                </NavbarContent>

                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <Button
                            radius="full"
                            isIconOnly
                            aria-label="notifications"
                            variant="light"
                        >

                            <NotificationIcon size={24}/>
                            <Badge content="2" shape="circle" color="danger">
                            </Badge>
                        </Button>

                    </DropdownTrigger>
                    <DropdownMenu
                        aria-label="Notification actions"
                        onAction={(key) => alert(key)}
                    >
                        <DropdownItem key="new">Simulation id 299 complete</DropdownItem>
                        <DropdownItem key="copy">Simulation id 298 complete</DropdownItem>
                        <DropdownItem key="edit">Simulation id 287 failed</DropdownItem>
                        <DropdownItem key="delete" className="text-danger" color="danger">
                            Clear notifications
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <ThemeSwitch/>
                <Dropdown placement="bottom-start">
                    <DropdownTrigger>
                        <User
                            as="button"
                            avatarProps={{
                                src: "https://images.unsplash.com/broken",
                            }}
                            description="@admin"
                            name="Administrator"
                        />
                    </DropdownTrigger>
                    <DropdownMenu aria-label="User Actions" variant="flat">
                        <DropdownItem key="settings">My Settings</DropdownItem>
                        <DropdownItem key="analytics">Analytics</DropdownItem>
                        <DropdownItem key="help_and_feedback">Help & Feedback</DropdownItem>
                        <DropdownItem key="logout" color="danger" onClick={handleLogout}>
                            Log Out
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>

                <NavbarMenu>
                    {searchInput}
                    <div className="mx-4 mt-2 flex flex-col gap-2">
                        {siteConfig.navMenuItems.map((item, index) => (
                            <NavbarMenuItem key={`${item}-${index}`}>
                                <Link
                                    color={
                                        index === 2
                                            ? "primary"
                                            : index === siteConfig.navMenuItems.length - 1
                                                ? "danger"
                                                : "foreground"
                                    }
                                    href="#"
                                    size="lg"
                                >
                                    {item.label}
                                </Link>
                            </NavbarMenuItem>
                        ))}
                    </div>
                </NavbarMenu>
            </NextUINavbar>
            <Divider className="my-4"/>
        </>
    );
};

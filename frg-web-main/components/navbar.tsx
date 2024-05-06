import {
	Button,
	Kbd,
	Link,
	Input,
	Navbar as NextUINavbar,
	NavbarContent,
	NavbarMenu,
	NavbarMenuToggle,
	NavbarBrand,
	NavbarItem,
	NavbarMenuItem,
} from "@nextui-org/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem,  User} from "@nextui-org/react";

import { link as linkStyles } from "@nextui-org/theme";
import {Avatar, AvatarGroup, AvatarIcon} from "@nextui-org/avatar";
import { siteConfig } from "@/config/site";
import NextLink from "next/link";
import clsx from "clsx";
import React from "react";

import { ThemeSwitch } from "@/components/theme-switch";
import {
	TwitterIcon,
	GithubIcon,
	DiscordIcon,
	HeartFilledIcon,
	SearchIcon,
} from "@/components/icons";

import { Logo } from "@/components/icons";
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/react";
import {Tabs, Tab, Card, CardBody, CardHeader} from "@nextui-org/react";
import {useRouter} from "next/router";

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
				<SearchIcon className="text-base text-default-400 pointer-events-none flex-shrink-0" />
			}
			type="search"
		/>
	);
    const [currentPage, setCurrentPage] = React.useState("home");
	let tabs = [
		{
			id: "home",
			label: "Home",
			content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."
		},
		{
			id: "run",
			label: "Run New Test",
			content: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
		},

	];

	const router = useRouter();

	const handleLogout = () => {
		router.push("/");
	};
	return (
		<NextUINavbar maxWidth="xl" position="sticky">
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">
				<NavbarBrand className="gap-3 max-w-fit">
					<NextLink className="flex justify-start items-center gap-1" href="/home">
						<Logo />
													</NextLink>
				</NavbarBrand>
			</NavbarContent>
			<NavbarContent className="basis-1/5 sm:basis-full" justify="start">

      <Tabs aria-label="Dynamic tabs" items={tabs}>
        {(item) => (
			<Tab key={item.id} title={item.label} >

          </Tab>
		)}
      </Tabs>

			</NavbarContent>



<Dropdown placement="bottom-start">

        <DropdownTrigger>
          <User
			  as="button"
			  avatarProps={{
				  src: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
			  }}
			  description="@tonyreichert"
			  name="Tony Reichert"
		  />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2">
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@tonyreichert</p>
          </DropdownItem>
          <DropdownItem key="settings">
            My Settings
          </DropdownItem>
          <DropdownItem key="team_settings">Team Settings</DropdownItem>
          <DropdownItem key="analytics">
            Analytics
          </DropdownItem>
          <DropdownItem key="system">System</DropdownItem>
          <DropdownItem key="configurations">Configurations</DropdownItem>
          <DropdownItem key="help_and_feedback">
            Help & Feedback
          </DropdownItem>
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

	);
};

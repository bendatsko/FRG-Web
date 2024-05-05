import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";
import React from "react";
import { Button } from "@nextui-org/react";
import FrgLogo from "../public/flynnlab-logo.svg";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useTheme } from "next-themes";

export default function IndexPage() {
  const [isVisible, setIsVisible] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);
  const { theme } = useTheme();

  const logoColor = theme === "dark" ? "white" : "black";

  return (
    <DefaultLayout showNavbar={false}>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "20rem",
            paddingBottom: "1rem",
          }}
        >
          <Image
            alt="FlynnLab Logo"
            src={FrgLogo}
            style={{ color: logoColor }}
          />
        </div>

        <Input
          isClearable
          type="email"
          label="Email"
          variant="bordered"
          placeholder="Email"
          defaultValue=""
          onClear={() => console.log("input cleared")}
          className="max-w-xs"
        />

        <Input
          label="Password"
          variant="bordered"
          placeholder="Password"
          endContent={
            <button
              className="focus:outline-none"
              type="button"
              onClick={toggleVisibility}
            >
              {isVisible ? (
                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
          }
          type={isVisible ? "text" : "password"}
          className="max-w-xs"
        />
        <div style={{ width: "20rem" }}>
          <Button radius="quarter" fullWidth="true" color="primary">
            Sign in
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}

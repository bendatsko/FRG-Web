import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import { Image } from "@nextui-org/image";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";
import React from "react";
import { Button } from "@nextui-org/react";

export default function IndexPage() {
  const [isVisible, setIsVisible] = React.useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <Image
          width={300}
          height={100}
          alt="NextUI hero Image with delay"
          src="https://app.requestly.io/delay/0/https://nextui-docs-v2.vercel.app/images/hero-card-complete.jpeg"
        />

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
          <Button
            radius="quarter"
            fullWidth="true"
            className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
          >
            Sign in
          </Button>
        </div>
      </section>
    </DefaultLayout>
  );
}

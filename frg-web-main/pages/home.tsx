import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";
import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import DefaultLayout from "@/layouts/default";
import {  } from "@nextui-org/image";
import { Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";
import { Button } from "@nextui-org/react";
import {Card, CardHeader, CardBody, CardFooter } from "@nextui-org/react";
import { Image } from "@nextui-org/react";
import HistoryTable from "@/components/table";
import {Divider} from "@nextui-org/react";
import {ThemeSwitch} from "@/components/theme-switch";
import React from "react";

export default function IndexPage() {

  return (
    <DefaultLayout>
       <Card className="max-w-[100%]">
      <CardHeader className="flex gap-3">
        <Image
            alt="nextui logo"
            height={40}
            radius="sm"
            src="https://avatars.githubusercontent.com/u/86160567?s=200&v=4"
            width={40}
        />
        <div className="flex flex-col">
          <p className="text-md">WebChip - Test ICs Remotely</p>
          <p className="text-small text-default-500">Flynn Research Group, University of Michigan</p>
        </div>
      </CardHeader>
      {/*<Divider/>*/}
      <CardBody>
        <p>Remotely interface with a variety of devices to run tests on provided preset/custom input, view test results, and visualize test statistics.</p>
      </CardBody>
      <Divider/>
      <CardFooter>
        <Link
            isExternal
            showAnchorIcon
            href="https://github.com/nextui-org/nextui"
        >
          Visit source code on GitHub.
        </Link>
      </CardFooter>
    </Card>
      <Divider className="my-5" />

      <HistoryTable/>
  <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
        <ThemeSwitch />
      </div>
    </DefaultLayout>
  );
}



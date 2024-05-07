import {Link} from "@nextui-org/link";
import DefaultLayout from "@/layouts/default";
import {Card, CardBody, CardFooter, CardHeader, Divider, Image, Spacer} from "@nextui-org/react";
import HistoryTable from "@/components/table";
import React from "react";
import {title} from "@/components/primitives";

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
                    <p>Remotely interface with a variety of devices to run tests on provided preset/custom input, view
                        test results, and visualize test statistics.</p>
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
            <Spacer y={6}/>

            <div className='flex justify-start inline-block max-w-med'>
                <h4 className={title()}>History</h4>
            </div>
            <Spacer x={4}/>

            <div className="overflow-x-auto">
                <HistoryTable/>
            </div>
            {/*<div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">*/}
            {/*    <ThemeSwitch/>*/}
            {/*</div>*/}
        </DefaultLayout>
    );
}



import DefaultLayout from "@/layouts/default";
import {Card, CardBody, CardHeader, Spacer,} from "@nextui-org/react";
import HistoryTable from "@/components/table";
import React from "react";
import {title} from "@/components/primitives";


export default function IndexPage() {
    return (
        <DefaultLayout>
            <section className="flex flex-col items-center min-h-screen py-4">
                <div className="max-w-[100%] w-full">
                    <h1 className={`${title()} text-left  top-0 z-10 py-4`}>
                        Your Tests
                    </h1>
                    <Spacer y={4}/>


                    <Card>
                        <CardHeader></CardHeader>
                        <CardBody>
                            <HistoryTable/>
                        </CardBody>
                    </Card>
                </div>
            </section>
        </DefaultLayout>
    );
}


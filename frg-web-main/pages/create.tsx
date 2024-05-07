import DefaultLayout from "@/layouts/default";
import React, {useState} from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, Chip, Input, Select, SelectItem,} from "@nextui-org/react";
import {title} from "@/components/primitives";


const chipList = [{label: "LDPC", value: "ldpc"}];
const statusColorMap = {
    success: "success",
    error: "error",
};


export default function CreatePage() {
    const [selectedAnimal, setSelectedAnimal] = useState("cat");
    const [userInput, setUserInput] = useState("");
    const [isInputValid, setIsInputValid] = useState(true);
    const [isTestBenchOnline, setIsTestBenchOnline] = useState(true);


    const handleInputChange = (event) => {
        const input = event.target.value;
        setUserInput(input);


        // Example validation logic: Parse as a JSON object
        try {
            JSON.parse(input);
            setIsInputValid(true);
        } catch (e) {
            setIsInputValid(false);
        }


        // Example logic to set test bench online/offline
        // Replace with your actual logic
        setIsTestBenchOnline(input === "validChipName");
    };


    const allChecksPassed = isInputValid && isTestBenchOnline;


    return (
        <DefaultLayout>
            <section className="flex flex-col items-center min-h-screen py-4">
                <div className="max-w-[800px] w-full">
                    <h1 className={`${title()} text-left  top-0 z-10 py-4`}>New Test</h1>


                    <Card className="mt-4">
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md font-bold">Select Chip</p>
                                <p className="text-small text-default-500">
                                    Device on which to run specified tests.
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Select items={chipList} placeholder="Select" className="max--xs">
                                {(animal) => (
                                    <SelectItem key={animal.value}>{animal.label}</SelectItem>
                                )}
                            </Select>
                        </CardBody>
                        {/*<Divider className="border-gray-700" />*/}
                        {/*<CardFooter className="flex justify-between items-center">*/}
                        {/*  <p className="text-sm text-white">*/}
                        {/*    Learn more about{" "}*/}
                        {/*    <a*/}
                        {/*      href="https://docs.example.com/available-chips"*/}
                        {/*      target="_blank"*/}
                        {/*      rel="noopener noreferrer"*/}
                        {/*      className="text-blue-500 hover:underline"*/}
                        {/*    >*/}
                        {/*      available chips*/}
                        {/*    </a>*/}
                        {/*  </p>*/}
                        {/*  <Button color="default" variant="faded" className="opacity-50">*/}
                        {/*    Save*/}
                        {/*  </Button>*/}
                        {/*</CardFooter>*/}
                    </Card>


                    <Card className="mt-4">
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md font-bold">
                                    Specify Signal-to-Noise Ratio
                                </p>
                                <p className="text-small text-default-500">
                                    Device on which to run specified tests.
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Input type="email" placeholder="Enter SNR"/>
                        </CardBody>
                        {/*<Divider className="border-gray-700" />*/}
                        {/*<CardFooter className="flex justify-between items-center">*/}
                        {/*  <p className="text-sm text-white">*/}
                        {/*    Learn more about{" "}*/}
                        {/*    <a*/}
                        {/*      href="https://docs.example.com/available-chips"*/}
                        {/*      target="_blank"*/}
                        {/*      rel="noopener noreferrer"*/}
                        {/*      className="text-blue-500 hover:underline"*/}
                        {/*    >*/}
                        {/*      available chips*/}
                        {/*    </a>*/}
                        {/*  </p>*/}
                        {/*  <Button color="default" variant="faded" className="opacity-50">*/}
                        {/*    Save*/}
                        {/*  </Button>*/}
                        {/*</CardFooter>*/}
                    </Card>


                    <Card className="mt-4">
                        <CardHeader className="flex gap-3">
                            <div className="flex flex-col">
                                <p className="text-md font-bold">
                                    Specify Number of Tests to Run
                                </p>
                                <p className="text-small text-default-500">
                                    Device on which to run specified tests.
                                </p>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <Input type="email" placeholder="Enter Number of Tests"/>
                        </CardBody>
                        {/*<Divider className="border-gray-700" />*/}
                        {/*<CardFooter className="flex justify-between items-center">*/}
                        {/*  <p className="text-sm text-white">*/}
                        {/*    Learn more about{" "}*/}
                        {/*    <a*/}
                        {/*      href="https://docs.example.com/available-chips"*/}
                        {/*      target="_blank"*/}
                        {/*      rel="noopener noreferrer"*/}
                        {/*      className="text-blue-500 hover:underline"*/}
                        {/*    >*/}
                        {/*      available chips*/}
                        {/*    </a>*/}
                        {/*  </p>*/}
                        {/*  <Button color="default" variant="faded" className="opacity-50">*/}
                        {/*    Save*/}
                        {/*  </Button>*/}
                        {/*</CardFooter>*/}
                    </Card>


                    <Card className="mt-4">
                        {/*<Divider className="border-gray-700" />*/}
                        <CardFooter className="flex justify-between items-center">
                            <div>
                                <div className="flex flex-col">
                                    <p className="text-md font-bold">Verify and Run</p>
                                    <p className="text-small text-default-500">
                                        Device on which to run specified tests.
                                    </p>
                                </div>
                                <Chip
                                    className="capitalize border-none gap-1 text-default-600"
                                    color={
                                        isTestBenchOnline
                                            ? statusColorMap["success"]
                                            : statusColorMap["error"]
                                    }
                                    size="sm"
                                    variant="dot"
                                >
                                    {isTestBenchOnline
                                        ? "Test Bench Online"
                                        : "Test Bench Online"}
                                </Chip>
                                <Chip
                                    className="capitalize border-none gap-1 text-default-600"
                                    color={
                                        isInputValid
                                            ? statusColorMap["success"]
                                            : statusColorMap["error"]
                                    }
                                    size="sm"
                                    variant="dot"
                                >
                                    {isInputValid ? "Input Validated" : "Input Validated"}
                                </Chip>
                            </div>
                            <Button color="primary" variant="flat">
                                Begin Test
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </DefaultLayout>
    );
}




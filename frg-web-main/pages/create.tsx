import DefaultLayout from "@/layouts/default";
import React, {useState} from "react";

import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
    Chip,
    ChipProps,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Select,
    SelectItem
} from "@nextui-org/react";
import {animals} from "@/components/data";
import {ChevronDownIcon} from '@/components/ChevronDownIcon';
import {title} from "@/components/primitives";

export default function CreatePage() {
    const text =
        "NextUI gives you the best developer experience with all the features you need for building beautiful and modern websites and applications.";
    const statusColorMap: Record<string, ChipProps["color"]> = {
        active: "success",
        paused: "danger",
        vacation: "warning",
    };

    const [selectedOption, setSelectedOption] = React.useState(new Set(["merge"]));

    const descriptionsMap = {
        merge:
            "All commits from the source branch are added to the destination branch via a merge commit.",
        squash:
            "All commits from the source branch are added to the destination branch as a single commit.",
        rebase: "All commits from the source branch are added to the destination branch individually.",
    };

    const labelsMap = {
        merge: "Create a merge commit",
        squash: "Squash and merge",
        rebase: "Rebase and merge",
    }

    // Convert the Set to an Array and get the first value.
    const selectedOptionValue = Array.from(selectedOption)[0];
    const [benchStatus, setBenchStatus] = useState("online"); // online or offline
    const [inputCheckPasses, setInputCheckPasses] = useState(true); // true or false
    const [selectedAnimal, setSelectedAnimal] = useState("cat");


    const benchStatusColor = benchStatus === "online" ? "success" : "danger";
    const benchStatusText = benchStatus.charAt(0).toUpperCase() + benchStatus.slice(1);
    const inputCheckStatusColor = inputCheckPasses ? "success" : "danger";
    const inputCheckStatusText = inputCheckPasses ? "Valid" : "Invalid";

    const handleAddToQueue = () => {
        // Add your logic to add the test to the queue
        console.log("Test added to the queue");
    };

    const handleClearInputs = () => {
        setSelectedAnimal("cat");
        console.log("Inputs cleared");
    };
    return (
        <DefaultLayout>


            <section className='flex flex-col items-center justify-center gap-4 py-8 md:py-10'>
                <div className='inline-block max-w-lg text-center justify-center'>
                    <h1 className={title()}>New Test</h1>
                </div>
            </section>


            <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">Step 1</p>

                        <h4 className="text-white font-medium text-large">Select Chip</h4>
                        <ButtonGroup variant="solid">
                            <Button>{labelsMap[selectedOptionValue]}</Button>
                            <Dropdown placement="bottom-end">
                                <DropdownTrigger>
                                    <Button isIconOnly>
                                        <ChevronDownIcon/>
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Merge options"
                                    selectedKeys={selectedOption}
                                    selectionMode="single"
                                    onSelectionChange={setSelectedOption}
                                    className="max-w-[300px]"
                                >
                                    <DropdownItem key="merge" description={descriptionsMap["merge"]}>
                                        {labelsMap["merge"]}
                                    </DropdownItem>
                                    <DropdownItem key="squash" description={descriptionsMap["squash"]}>
                                        {labelsMap["squash"]}
                                    </DropdownItem>
                                    <DropdownItem key="rebase" description={descriptionsMap["rebase"]}>
                                        {labelsMap["rebase"]}
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </ButtonGroup>

                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://nextui.org/images/card-example-4.jpeg"
                    />


                </Card>


                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">Step 2</p>

                        <h4 className="text-white font-medium text-large">Configure Test Suite</h4>
                        <Select
                            label=""
                            placeholder=""
                            defaultSelectedKeys={["cat"]}
                            className="max-w-xs"
                            scrollShadowProps={{
                                isEnabled: false
                            }}
                        >
                            {animals.map((animal) => (
                                <SelectItem key={animal.value} value={animal.value}>
                                    {animal.label}
                                </SelectItem>
                            ))}
                        </Select>

                    </CardHeader>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://nextui.org/images/card-example-4.jpeg"
                    />
                </Card>


                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny /60 uppercase font-bold">Step 3</p>
                        <h4 className="text font-medium text-large">Verify & Run</h4>


                        <div className="px-4 py-2">
                            <div className="flex items-center gap-2">
                                <p>Test bench status:</p>
                                <Chip color={benchStatusColor} size="sm" variant="shadow">
                                    {benchStatusText}
                                </Chip>
                            </div>
                            <div className="flex items-center gap-2">
                                <p>Test Suits:</p>
                                <Chip color={inputCheckStatusColor} size="sm" variant="shadow">
                                    {inputCheckStatusText}
                                </Chip>
                            </div>
                        </div>
                        <div className="px-4 py-2">
                            <Button color="primary" className="mb-2" onClick={handleAddToQueue}>
                                Add to Queue
                            </Button>
                            <Button color="secondary" variant="outline" onClick={handleClearInputs}>
                                Clear Inputs
                            </Button>
                        </div>
                    </CardHeader>


                    {/*<Image*/}
                    {/*    removeWrapper*/}
                    {/*    alt="Card background"*/}
                    {/*    className="z-0 w-full h-full object-cover"*/}
                    {/*    src="https://nextui.org/images/card-example-4.jpeg"*/}
                    {/*/>*/}
                </Card>

            </div>


        </DefaultLayout>
    );
}

import DefaultLayout from "@/layouts/default";
import React from "react";
import {
    Button,
    ButtonGroup,
    Card,
    CardHeader,
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

export default function CreatePage() {
    const text =
        "NextUI gives you the best developer experience with all the features you need for building beautiful and modern websites and applications.";


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


    return (
        <DefaultLayout>
            <div className="max-w-[900px] gap-2 grid grid-cols-12 grid-rows-2 px-8">
                <Card className="col-span-12 sm:col-span-4 h-[300px]">
                    <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                        <p className="text-tiny text-white/60 uppercase font-bold">1. Select</p>

                        <h4 className="text-white font-medium text-large">Chip to test</h4>
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
                        <p className="text-tiny text-white/60 uppercase font-bold">2. Set</p>

                        <h4 className="text-white font-medium text-large">Configurables</h4>
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
                        <p className="text-tiny text-white/60 uppercase font-bold">3. Verify and</p>

                        <h4 className="text-white font-medium text-large">Run</h4>
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
                    Test bench status: Online
                    Input Checking Passes: True

                    <Button color="primary">
                        Start
                    </Button>
                    <Image
                        removeWrapper
                        alt="Card background"
                        className="z-0 w-full h-full object-cover"
                        src="https://nextui.org/images/card-example-4.jpeg"
                    />
                </Card>

            </div>


        </DefaultLayout>
    );
}

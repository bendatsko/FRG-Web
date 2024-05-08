import DefaultLayout from "@/layouts/default";
import React, { useState } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Input,
  Select,
  Selection,
  SelectItem,
} from "@nextui-org/react";

export default function CreatePage() {
  const [chip, setChip] = useState<Selection>(new Set([]));
  const [snr, setSnr] = useState("");
  const [numTests, setNumTests] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [isTestBenchOnline, setIsTestBenchOnline] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const chipList = [{ label: "LDPC", value: "ldpc" }];

  const [buttonText, setButtonText] = useState("Begin Test");

  const statusColorMap = {
    success: "success",
    error: "danger",
  };

  // Validate inputs
  const validateInputs = () => {
    // Convert chip to Set and check its size
    const isChipSelected = new Set(chip).size > 0;
    const isSnrValid = /^[0-9]*\.?[0-9]+$/.test(snr);
    const isNumTestsValid = /^\d+$/.test(numTests);
    setIsInputValid(isChipSelected && isSnrValid && isNumTestsValid);
  };

  const handleFormSubmit = () => {
    if (!isInputValid) {
      alert("Please ensure all inputs are valid.");
      return;
    }

    setIsSubmitting(true);
    setButtonText("Running Test...");
    const uuid = "123";

    const selectedChip = Array.from(chip)[0] as string;

    const payload = {
      id: uuid,
      chip: selectedChip,
      snr,
      numTests,
    };

    console.log("Form Data: ", payload);

    // Set the button to loading and update the status
    setIsSubmitting(true);
    setButtonText("Submitting request...");

    // Simulate a test running
    setTimeout(() => {
      const success = Math.random() > 0.5; // Simulate test outcome
      const newMessage = success ? "Test started" : "Could not start";
      setStatusMessage(newMessage);
      setButtonText(newMessage);
      setTimeout(() => {
        setIsSubmitting(false);
        setButtonText("Begin Test");
      }, 2000); // Delay for 2 seconds after test outcome
    }, 2000); // Simulate a 2-second test run
  };

  const handleInputChange =
    (setter: {
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (arg0: any): void;
    }) =>
    (e: { target: { value: any } }) => {
      setter(e.target.value);
      validateInputs();
    };

  const handleChipChange = (keys: Selection) => {
    setChip(keys);
    validateInputs();
  };

  // @ts-ignore
  // @ts-ignore
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center min-h-screen py-4">
        <div className="max-w-[100%] w-full text-center">
          <Card className="mt-1">
            <CardHeader className="flex flex-col items-center gap-3 py-8">
              <h2 className="text-3xl">New Test</h2>
              <p className="text-small text-default-500">
                Complete the fields below.
              </p>
            </CardHeader>
            <Divider />

            <CardBody>
              <Card radius="sm" shadow="none" className="mt-0">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-bold">Select Chip</p>
                    <p className="text-small text-default-500">
                      Device on which to run specified tests.
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <Select
                    items={chipList}
                    placeholder="Select"
                    className="max--xs"
                    selectedKeys={chip}
                    onSelectionChange={handleChipChange}
                  >
                    {chipList.map((chip) => (
                      <SelectItem key={chip.value} value={chip.value}>
                        {chip.label}
                      </SelectItem>
                    ))}
                  </Select>
                </CardBody>
              </Card>

              <Card className="mt-4" radius="sm" shadow="none">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-bold">
                      Specify Signal-to-Noise Ratio (SNR)
                    </p>
                    <p className="text-small text-default-500">
                      Signal-to-Noise Ratio value in dB.
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <Input
                    placeholder="Enter SNR"
                    value={snr}
                    onChange={handleInputChange(setSnr)}
                  />
                </CardBody>
              </Card>

              <Card className="mt-4" radius="sm" shadow="none">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-bold">
                      Specify Number of Tests to Run
                    </p>
                    <p className="text-small text-default-500">
                      The total number of tests to execute.
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <Input
                    placeholder="Enter Number of Tests"
                    value={numTests}
                    onChange={handleInputChange(setNumTests)}
                  />
                </CardBody>
              </Card>

              <Card className="shadow-sm rounded-lg mt-4">
                <CardFooter className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center lg:justify-between items-center lg:items-start p-4">
                  <div className="flex flex-col gap-2 items-left lg:items-start">
                    <p className="text-md font-bold">Verify and Run</p>
                    <p className="text-small text-default-500 text-left lg:text-start">
                      Ensure all inputs are valid before starting the test.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                      <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        // color={
                        //   isTestBenchOnline
                        //     ? statusColorMap["success"]
                        //     : statusColorMap["error"]
                        // }
                        size="sm"
                        variant="dot"
                      >
                        {isTestBenchOnline
                          ? "Test Bench Online"
                          : "Test Bench Offline"}
                      </Chip>
                      <Chip
                        className="capitalize border-none gap-1 text-default-600"
                        // color={
                        //   isInputValid
                        //     ? statusColorMap["success"]
                        //     : statusColorMap["error"]
                        // }
                        size="sm"
                        variant="dot"
                      >
                        {isInputValid
                          ? "Input Validated"
                          : "Input Not Validated"}
                      </Chip>
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 items-center lg:items-end">
                    <Button
                      color="primary"
                      isLoading={isSubmitting}
                      disabled={!isInputValid || isSubmitting}
                      variant={!isInputValid || isSubmitting ? "flat" : "solid"}
                      onClick={handleFormSubmit}
                      className={`w-full max-w-xs lg:w-auto ${!isInputValid || isSubmitting ? "pointer-events-none" : ""}`}
                    >
                      {buttonText}
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}

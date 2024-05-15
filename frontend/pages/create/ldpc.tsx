import DefaultLayout from "@/layouts/default";
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  Checkbox,
} from "@nextui-org/react";
import PrivateRoute from "@/components/PrivateRoute";
import { v4 as uuidv4 } from "uuid";

export default function CreatePage() {
  const [chip, setChip] = useState<Selection>(new Set([]));
  const [snrRange, setSnrRange] = useState("");
  const [numTests, setNumTests] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [isTestBenchOnline, setIsTestBenchOnline] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [responseMessage, setResponseMessage] = useState("");
  const [isAuto, setIsAuto] = useState(false);
  const chipList = [
    { label: "LDPC0", value: "ldpc0" },
    { label: "LDPC1", value: "ldpc1" },
    { label: "LDPC2", value: "ldpc2" },
  ];
  const statusColorMap: Record<string, "success" | "danger"> = {
    success: "success",
    failure: "danger",
  };

  const [buttonText, setButtonText] = useState("Begin Test");

  useEffect(() => {
    if (chip.size > 0) {
      checkTestBenchStatus();
    }
  }, [chip]);

  // Validate inputs
  const validateInputs = () => {
    const isChipSelected = new Set(chip).size > 0;
    const isSnrRangeValid = /^(\d+db:\d+db:\d+dbsteps)$/.test(snrRange);
    const isNumTestsValid = isAuto || /^\d+$/.test(numTests);
    setIsInputValid(isChipSelected && isSnrRangeValid && isNumTestsValid);
    setIsInputValid(true);
  };

  const checkTestBenchStatus = async () => {
    try {
      const response = await axios.get("http://localhost:5000/status");
      const { data } = response;

      if (data.status === "success") {
        setIsTestBenchOnline(true);
        setStatusMessage(data.message);
      } else {
        setIsTestBenchOnline(false);
        setStatusMessage(data.message);
      }
    } catch (error) {
      console.error("Error checking test bench status:", error);
      setIsTestBenchOnline(false);
      setStatusMessage("Error checking test bench status");
    }
  };

  const handleFormSubmit = async () => {
    if (!isInputValid) {
      alert("Please ensure all inputs are valid.");
      return;
    }

    setIsSubmitting(true);
    setButtonText("Running Test...");

    const uuid = uuidv4();
    const userName = "User Name"; // Replace with the actual user name
    const currentDate = new Date().toISOString().split("T")[0];
    const startTime = new Date().toISOString();
    const snrValues = parseSnrRange(snrRange);

    const payload = {
      uuid,
      userName,
      chip: Array.from(chip)[0], // assuming single selection
      snrValues,
      numTests: isAuto ? -1 : parseInt(numTests),
      date: currentDate,
      startTime,
      endTime: "-", // end time will be updated when test completes
      status: "running",
      isAuto,
    };

    console.log("Form Data: ", payload);

    try {
      const response = await axios.post("http://localhost:5000/send", payload);
      console.log("Response: ", response);
      const { data } = response;

      if (data.status === "success") {
        setResponseMessage(`Success: ${data.response}`);
      } else {
        setResponseMessage(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error("Error sending request:", error);
      setResponseMessage("Error sending request");
    }

    // Reset form and state
    setIsSubmitting(false);
    setButtonText("Begin Test");
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

  const handleAutoChange = (e: { target: { checked: any } }) => {
    setIsAuto(e.target.checked);
    validateInputs();
  };

  const parseSnrRange = (range: string) => {
    const [start, end, step] = range
      .replace(/dbsteps/g, "")
      .split(":")
      .map((val) => parseFloat(val));
    const snrValues = [];
    for (let i = start; i <= end; i += step) {
      snrValues.push(i);
    }
    return snrValues;
  };

  return (
    <PrivateRoute>
      <DefaultLayout>
        <section className="flex flex-col items-center min-h-screen py-4">
          <div className="max-w-[100%] w-full text-center">
            <Card className="mt-1">
              <CardHeader className="flex flex-col items-center gap-3 py-8">
                <h2 className="text-3xl">New test</h2>
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
                        Specify Signal-to-Noise Ratio (SNR) Range
                      </p>
                      <p className="text-small text-default-500">
                        Signal-to-Noise Ratio value in dB (e.g., 1db:12db:1dbsteps).
                      </p>
                    </div>
                  </CardHeader>
                  <CardBody>
                    <Input
                      placeholder="Enter SNR Range"
                      value={snrRange}
                      onChange={handleInputChange(setSnrRange)}
                    />
                  </CardBody>
                </Card>
                {!isAuto && (
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
                )}
                <Card className="mt-4" radius="sm" shadow="none">
                  <CardBody>
                    <Checkbox checked={isAuto} onChange={handleAutoChange}>
                      Auto Calculate Number of Tests
                    </Checkbox>
                  </CardBody>
                </Card>
                <Card className="shadow-sm rounded-lg mt-4">
                  <CardFooter className="flex flex-col lg:flex-row gap-4 lg:gap-8 justify-center lg:justify-between items-center lg:items-start p-4 text-center lg:text-left">
                    <div className="flex flex-col gap-2 items-center lg:items-start">
                      <p className="text-md font-bold">Verify and Run</p>
                      <p className="text-small text-default-500">
                        Ensure all inputs are valid before starting the test.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                        <Chip
                          className="capitalize border-none gap-1 text-default-600"
                          color={
                            isTestBenchOnline
                              ? statusColorMap["success"]
                              : statusColorMap["failure"]
                          }
                          size="sm"
                          variant="dot"
                        >
                          {isTestBenchOnline
                            ? "Test Bench Online"
                            : "Test Bench Offline"}
                        </Chip>
                        <Chip
                          className="capitalize border-none gap-1 text-default-600"
                          color={
                            isInputValid
                              ? statusColorMap["success"]
                              : statusColorMap["failure"]
                          }
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
                        disabled={
                          !isInputValid || isSubmitting || !isTestBenchOnline
                        }
                        variant={
                          !isInputValid || isSubmitting || !isTestBenchOnline
                            ? "flat"
                            : "solid"
                        }
                        onClick={handleFormSubmit}
                        className={`w-full max-w-xs lg:w-auto ${
                          !isInputValid || isSubmitting || !isTestBenchOnline
                            ? "pointer-events-none"
                            : ""
                        }`}
                      >
                        {buttonText}
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
                <div className="mt-4">
                  <p>{responseMessage}</p>
                  <p>{statusMessage}</p>
                </div>
              </CardBody>
            </Card>
          </div>
        </section>
      </DefaultLayout>
    </PrivateRoute>
  );
}

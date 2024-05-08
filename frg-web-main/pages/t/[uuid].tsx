import {GetServerSideProps} from "next";
import DefaultLayout from "@/layouts/default";
import React, {useState} from "react";
import {Button, Card, CardBody, CardFooter, CardHeader, Chip, ChipProps, Divider, Input,} from "@nextui-org/react";
import {useRouter} from "next/navigation";

// Utility function to capitalize strings
const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

const statusColorMap: Record<string, ChipProps["color"]> = {
  active: "success",
  failed: "danger",
  paused: "warning",
};

type TestData = {
  id: string;
  chip: string;
  snr: string;
  numTests: string;
  status: string;
  created_at: string;
};

interface TestPageProps {
  testData: TestData;
}

export default function TestPage({ testData }: TestPageProps) {
  const router = useRouter();
  const [chip, setChip] = useState(testData.chip);
  const [snr, setSnr] = useState(testData.snr);
  const [numTests, setNumTests] = useState(testData.numTests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [buttonText, setButtonText] = useState("Update Test");

  const handleFormSubmit = () => {
    setIsSubmitting(true);
    setButtonText("Updating...");

    // Simulate a form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setButtonText("Update Test");
      setStatusMessage("Test updated successfully");
    }, 2000);
  };

  const handleInputChange =
    (setter: {
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (value: React.SetStateAction<string>): void;
      (arg0: any): any;
    }) =>
    (e: { target: { value: any } }) =>
      setter(e.target.value);

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center min-h-screen py-4">
        <div className="max-w-[100%] w-full text-center">
          <Card className="mt-1">
            <CardHeader className="flex flex-col items-center gap-3 py-8">
              <h2 className="text-3xl">Edit Test</h2>
              <p className="text-small text-default-500">
                Complete the fields below to update the test.
              </p>
            </CardHeader>
            <Divider />

            <CardBody>
              <Card radius="sm" shadow="none" className="mt-0">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-bold">Test Information</p>
                    <p className="text-small text-default-500">
                      Test created on {testData.created_at}.
                    </p>
                  </div>
                </CardHeader>
                <CardBody>
                  <Input
                    placeholder="Enter Chip"
                    value={chip}
                    onChange={handleInputChange(setChip)}
                  />
                </CardBody>
              </Card>

              <Card className="mt-4" radius="sm" shadow="none">
                <CardHeader className="flex gap-3">
                  <div className="flex flex-col">
                    <p className="text-md font-bold">Specify SNR</p>
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
                    <p className="text-md font-bold">Specify Number of Tests</p>
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
                    <p className="text-md font-bold">Verify and Update</p>
                    <p className="text-small text-default-500 text-left lg:text-start">
                      Ensure all inputs are correct before updating the test.
                    </p>
                    <Chip
                      className="capitalize border-none gap-1 text-default-600"
                      color={statusColorMap[testData.status]}
                      size="sm"
                      variant="dot"
                    >
                      {capitalize(testData.status)}
                    </Chip>
                  </div>
                  <div className="flex flex-col gap-4 items-center lg:items-end">
                    <Button
                      color="primary"
                      isLoading={isSubmitting}
                      onClick={handleFormSubmit}
                      className="w-full max-w-xs lg:w-auto"
                    >
                      {buttonText}
                    </Button>
                    {statusMessage && (
                      <div className="text-default-600 text-center lg:text-end">
                        {statusMessage}
                      </div>
                    )}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const uuid = "123";

  // Simulate fetching data based on the UUID
  const testData: TestData = {
    id: uuid as string,
    chip: "LDPC",
    snr: "20",
    numTests: "10",
    status: "active",
    created_at: "2024-05-01",
  };

  return {
    props: {
      testData,
    },
  };
};

import {GetServerSideProps} from "next";
import DefaultLayout from "@/layouts/default";
import React, {useState} from "react";
import {Button, Card, CardBody, CardHeader, ChipProps, Divider,} from "@nextui-org/react";
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
    (setter: React.Dispatch<React.SetStateAction<string>>) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setter(e.target.value);

  const handleDownloadResults = () => {
    // Simulate downloading results
    alert("Downloading results...");
  };

  return (
    <DefaultLayout>
      <section className="flex flex-col items-center min-h-screen py-4">
        <div className="max-w-[100%] w-full text-center">
          <Card className="mt-1">
            <CardBody>
              <Card className="mt-4" radius="sm" shadow="none">
                <CardHeader className="flex flex-col items-center gap-3 py-8">
                  <h2 className="text-3xl">Test Details</h2>
                  <div className="flex flex-row justify-around w-full text-small text-default-500 gap-4">
                    <p>UUID: {testData.id}</p>
                    <p>Chip: {testData.chip}</p>
                    <p>SNR: {testData.snr} dB</p>
                    <p>Number of Tests: {testData.numTests}</p>
                  </div>
                </CardHeader>
                <Divider />
                <CardBody className="text-center">
                  <h3 className="text-2xl mb-4">Results (Placeholder)</h3>
                  <p className="text-default-500 mb-4">
                    Actual results will be displayed here.
                  </p>
                  <div className="flex justify-center">
                    <Button
                      color="secondary"
                      onClick={handleDownloadResults}
                      className="w-full max-w-xs lg:w-auto"
                    >
                      Download Results
                    </Button>
                  </div>
                </CardBody>
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
    id: uuid,
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

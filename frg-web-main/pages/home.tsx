import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import HistoryTable from "@/components/table";
import React from "react";
import { title } from "@/components/primitives";

// Mock test data
const testData = [
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d7",
    chip: "LDPC",
    created_at: "2024-05-01",
    status: "active",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-02",
    status: "failed",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-03",
    status: "paused",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-01",
    status: "active",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-02",
    status: "failed",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-03",
    status: "paused",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-01",
    status: "active",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-02",
    status: "failed",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-03",
    status: "paused",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-01",
    status: "active",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-02",
    status: "failed",
  },
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d6",
    chip: "LDPC",
    created_at: "2024-05-03",
    status: "paused",
  },
];

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center min-h-screen py-4">
        <div className="max-w-[100%] w-full text-center">
          <Card>
            <CardHeader className="flex flex-col items-center gap-3 py-8">
              <h2 className="text-3xl">Your History</h2>
              <p className="text-small text-default-500">
                For keeping track of your tests.
              </p>
            </CardHeader>
            <CardBody>
              <HistoryTable data={testData} />
            </CardBody>
          </Card>
        </div>
      </section>
    </DefaultLayout>
  );
}

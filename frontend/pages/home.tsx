import DefaultLayout from "@/layouts/default";
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import HistoryTable from "@/components/HistoryTable";
import React, { useState } from "react";
import { title } from "@/components/primitives";
import PrivateRoute from '@/components/PrivateRoute';
import axios from 'axios';

// Mock test data
const initialTestData = [
  {
    id: "3fb2b76c-ae02-4aab-b7d7-b8eb28f790d7",
    chip: "LDPC",
    created_at: "2024-05-01",
    status: "active",
  },
  //...other data
];

const HomePage = () => {
  const [testData, setTestData] = useState(initialTestData);

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5000/tests/${id}`);
      setTestData(testData.filter(test => test.id !== id));
    } catch (error) {
      console.error("Error deleting test:", error);
    }
  };

  return (
    <PrivateRoute>
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
                <HistoryTable data={initialTestData} onDelete={handleDelete} />
              </CardBody>
            </Card>
          </div>
        </section>
      </DefaultLayout>
    </PrivateRoute>
  );
}

export default HomePage;


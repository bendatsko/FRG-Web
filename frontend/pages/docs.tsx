import DefaultLayout from "@/layouts/default";
import React from "react";
import { Card, CardBody, CardHeader, Divider } from "@nextui-org/react";
import PrivateRoute from '@/components/PrivateRoute';


//=============================================================
//                        Documentation
//=============================================================
// Documentation page for guiding users through the app with gifs
// Most of the utility of this page is in its UI design so come
// back to this once the product is more complete.

export default function DocsPage() {
  return (
    <PrivateRoute>
      <DefaultLayout>
        <section className="flex flex-col items-center min-h-screen py-4">
          <div className="max-w-[100%] w-full text-center">
            <Card className="mt-1">
              <CardHeader className="flex flex-col items-center gap-3 py-8">
                <h2 className="text-3xl">Documentation</h2>
                <p className="text-small text-default-500">
                  Learn how to use the platform.
                </p>
              </CardHeader>
              <Divider />
              <CardBody className="text-left">
                <h3 className="text-2xl font-bold">Running a New Test</h3>
                <p className="text-default-500">
                  To run a new test on a chip, follow these steps:
                </p>
                <ol className="list-decimal list-inside text-default-500">
                  <li>Select the chip you want to test from the dropdown menu.</li>
                  <li>Specify the Signal-to-Noise Ratio (SNR) in dB.</li>
                  <li>Enter the number of tests you want to run.</li>
                  <li>Verify that all inputs are valid and the test bench is online.</li>
                  <li>Click the Begin Test button to start the test.</li>
                </ol>
                <Divider className="my-6" />
                <h3 className="text-2xl font-bold">Viewing Test History</h3>
                <p className="text-default-500">
                  You can view your previously run tests in the <strong>History</strong> tab. Click on the details of any test to view associated MATLAB plots and other details.
                </p>
                <Divider className="my-6" />
                <h3 className="text-2xl font-bold">Sharing Tests via UUID</h3>
                <p className="text-default-500">
                  You can share your tests with other authenticated users via UUID. Simply provide the UUID of the test to another user, and they can access the test details using the UUID.
                </p>
                <Divider className="my-6" />
                <h3 className="text-2xl font-bold">Tabs Overview</h3>
                <p className="text-default-500">
                  The platform has the following tabs:
                </p>
                <ul className="list-disc list-inside text-default-500">
                  <li><strong>Home:</strong> View your test history and test details.</li>
                  <li><strong>Create new:</strong> Create and run a new test on a chip.</li>
                  <li><strong>Docs:</strong> This documentation page.</li>
                </ul>
                <Divider className="my-6" />
                <h3 className="text-2xl font-bold">Help</h3>
                <p className="text-default-500">
                  If you need further assistance, please contact support or refer to the detailed documentation available on the platform.
                </p>
              </CardBody>
            </Card>
          </div>
        </section>
      </DefaultLayout>
    </PrivateRoute>
  );
}

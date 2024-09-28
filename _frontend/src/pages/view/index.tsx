import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import {
  useGetTestByIdQuery,
  useLazyDownloadResultsQuery,
  useRerunTestMutation,
} from "@/store/api/v1/endpoints/test";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, Download, RefreshCw, Loader2, Clock, User, Server, Cpu, ArrowLeft } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const View = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { data: test, isLoading, error } = useGetTestByIdQuery(id);
  const [rerunTest, { isLoading: isRerunningTest }] = useRerunTestMutation();
  const [downloadResults] = useLazyDownloadResultsQuery();
  const { toast } = useToast();

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (id) {
      dispatch(
          setBreadCrumb([
            { title: "Dashboard", link: "/dashboard" },
            { title: `Test ${id}`, link: `/view/${id}` },
          ])
      );
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (test?.results_file) {
      try {
        const rows = test.results_file.trim().split("\n");
        const headers = rows[0].split(",");
        const parsedData = rows.slice(1).map((row) => {
          const values = row.split(",");
          return headers.reduce((obj, header, index) => {
            obj[header] = Number(values[index]);
            return obj;
          }, {});
        });
        setChartData(parsedData);
      } catch (error) {
        console.error("Error parsing results file:", error);
        toast({
          title: "Error",
          description: "Failed to parse test results. The data may be in an unexpected format.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }
  }, [test, toast]);

  const handleRerunTest = async () => {
    if (!id) return;
    try {
      await rerunTest(id).unwrap();
      toast({
        title: "Test Rerun Initiated",
        description: "The test is now rerunning. You'll be notified when it's complete.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Rerun Failed",
        description: "There was an error rerunning the test. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const handleDownloadResults = async () => {
    if (!id) return;
    try {
      const blob = await downloadResults(id).unwrap();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `test_${id}_results.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Results Downloaded",
        description: "The test results have been successfully downloaded.",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error downloading the results. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
        <div className="bg-background min-h-screen">
          <div className="container mx-auto px-4 w-11/12">
            <div className="flex flex-row justify-between items-center border-b border-lightborder py-4">
              <h1 className="text-3xl font-bold text-lighth1">
                <Skeleton className="h-9 w-32" />
              </h1>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
    );
  }

  if (error || !test) {
    return (
        <div className="bg-background min-h-screen">
          <div className="container mx-auto px-4 w-11/12">
            <div className="flex flex-row justify-between items-center border-b border-lightborder py-4">
              <h1 className="text-3xl font-bold text-lighth1">Error</h1>
            </div>
            <Alert variant="destructive" className="mt-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>{error ? "Error Occurred" : "Test Not Found"}</AlertTitle>
              <AlertDescription>
                {error instanceof Error
                    ? error.message
                    : "The requested test could not be found or loaded. Please check the test ID and try again."}
              </AlertDescription>
            </Alert>
          </div>
        </div>
    );
  }

  return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 w-11/12">
          <div className="flex flex-row justify-between items-center border-b border-lightborder py-4">
            <div className="flex items-center">
              <Button variant="ghost" className="mr-4" onClick={() => window.history.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-3xl font-bold text-lighth1">
                Test #{test.id}: {test.title}
              </h1>
            </div>
            <Badge
                variant={
                  test.status === "Failed"
                      ? "destructive"
                      : test.status === "Completed"
                          ? "success"
                          : "default"
                }
                className="text-sm font-medium px-3 py-1 rounded-full"
            >
              {test.status}
            </Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {/* Test Overview Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Test Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <User className="h-4 w-4 opacity-70" />
                    <span className="text-sm font-medium">Author: {test.author}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Server className="h-4 w-4 opacity-70" />
                    <span className="text-sm font-medium">DUT: {test.DUT}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 opacity-70" />
                    <span className="text-sm font-medium">Duration: {test.duration || "N/A"} ms</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Cpu className="h-4 w-4 opacity-70" />
                    <span className="text-sm font-medium">Test Bench: {test.testBench}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col space-y-2">
                <Button
                    onClick={handleRerunTest}
                    className="w-full"
                    disabled={isRerunningTest}
                >
                  {isRerunningTest ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                      <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Rerun Test
                </Button>
                <Button onClick={handleDownloadResults} className="w-full">
                  <Download className="mr-2 h-4 w-4" /> Download Results
                </Button>
              </CardContent>
            </Card>

            {/* Chart Card */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Test Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={chartData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="SNR" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Legend />
                      <Line yAxisId="left" type="monotone" dataKey="BER" stroke="#8884d8" activeDot={{ r: 8 }} />
                      <Line yAxisId="right" type="monotone" dataKey="FER" stroke="#82ca9d" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Additional Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    <span className="font-medium">SNR Range:</span> {test.snrRange}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Batch Size:</span> {test.batchSize?.toString() || "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Start Time:</span>{" "}
                    {test.start_time ? new Date(test.start_time).toLocaleString() : "N/A"}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">End Time:</span>{" "}
                    {test.end_time ? new Date(test.end_time).toLocaleString() : "N/A"}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Alert for Failed Test */}
          {test.status === "Failed" && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Test Failed</AlertTitle>
                <AlertDescription>
                  This test has failed. Please review the results and consider rerunning the test.
                </AlertDescription>
              </Alert>
          )}
        </div>
      </div>
  );
};

export default View;
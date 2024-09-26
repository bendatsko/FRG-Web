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
import { AlertCircle, Download, RefreshCw, Loader2 } from "lucide-react";
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
import { Card, CardContent } from "@/components/ui/card";

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
          { title: "Tests", link: "/dashboard" },
          { title: "Details", link: `/view/${id}` },
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
          description:
            "Failed to parse test results. The data may be in an unexpected format.",
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
        description:
          "The test is now rerunning. You'll be notified when it's complete.",
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
        description:
          "There was an error downloading the results. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !test) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <Alert variant="destructive">
          <AlertCircle className="h-5 w-5" />
          <div>
            <AlertTitle>
              {error ? "Error Occurred" : "Test Not Found"}
            </AlertTitle>
            <AlertDescription>
              {error instanceof Error
                ? error.message
                : "The requested test could not be found or loaded. Please check the test ID and try again."}
            </AlertDescription>
          </div>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            [#{test.id}] {test.title}
          </h1>
          <Badge
            variant={
              test.status === "Failed"
                ? "destructive"
                : test.status === "Completed"
                  ? "success"
                  : "default"
            }
            className="text-xs font-medium px-2 py-1 rounded-full flex items-center justify-center min-w-[80px]"
          >
            {test.status}
          </Badge>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Button
          onClick={handleRerunTest}
          className="flex items-center"
          disabled={isRerunningTest}
        >
          {isRerunningTest ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          Rerun Test
        </Button>
        <Button onClick={handleDownloadResults} className="flex items-center">
          <Download className="mr-2 h-4 w-4" /> Download Results
        </Button>
      </div>

      {/* Chart */}
      <Card className="mb-6 dark:bg-transparent dark:border-white/20">
        <CardContent className="p-6">
          <ResponsiveContainer width="100%" height={500}>
            <LineChart
              data={chartData}
              margin={{ top: 50, right: 10, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
              <XAxis
                dataKey="SNR"
                label={{ value: "SNR", position: "insideBottom", offset: -5 }}
              />
              <YAxis
                yAxisId="left"
                label={{ value: "BER", angle: -90, position: "insideLeft" }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{ value: "FER", angle: 90, position: "insideRight" }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="BER"
                stroke="#0ea5e9"
                activeDot={{ r: 8 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="FER"
                stroke="#a855f7"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Test Information */}
      <TestInfoCard test={test} />

      {/* Alert for Failed Test */}
      {test.status === "Failed" && (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Test Failed</AlertTitle>
          <AlertDescription>
            This test has failed. Please review the results and consider
            rerunning the test.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

const TestInfoCard = ({ test }) => {
  const infoItems = [
    { label: "Author", value: test.author },
    { label: "DUT", value: test.DUT },
    { label: "Duration", value: `${test.duration || "N/A"} ms` },
    { label: "Test Bench", value: test.testBench },
    { label: "SNR Range", value: test.snrRange },
    { label: "Batch Size", value: test.batchSize?.toString() || "N/A" },
    {
      label: "Start Time",
      value: test.start_time
        ? new Date(test.start_time).toLocaleString()
        : "N/A",
    },
    {
      label: "End Time",
      value: test.end_time ? new Date(test.end_time).toLocaleString() : "N/A",
    },
  ];

  return (
    <Card className="dark:bg-transparent dark:border-white/20">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {infoItems.map((item, index) => (
            <div key={index} className="space-y-1">
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </p>
              <p className="text-base font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default View;

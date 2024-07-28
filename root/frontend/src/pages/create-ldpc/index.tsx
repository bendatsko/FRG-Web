import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import { selectUser } from "@/store/slice/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const NewTestSchema = z.object({
  title: z.string().nonempty("Title is required"),
  testBench: z.string().nonempty("Test Bench is required"),
  snrRange: z.string().regex(/^\d+:\d+:\d+$/, "SNR Range must be in the format start:step:stop"),
  batchSize: z.string().regex(/^\d+$/, "Batch Size must be a positive integer"),
});

type NewTestSchema_INFERRED = z.infer<typeof NewTestSchema>;

const Create: React.FC = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [testBenchStatus, setTestBenchStatus] = useState({
    ldpc1: 'unknown',
    ldpc2: 'unknown',
    ldpc3: 'unknown'
  });
  const [serverStatus, setServerStatus] = useState<'online' | 'offline' | 'checking'>('checking');

  const checkServerStatus = async () => {
    try {
      const response = await fetch('http://localhost:3001/health', { method: 'GET' });
      setServerStatus(response.ok ? 'online' : 'offline');
    } catch (error) {
      console.error('Error checking server status:', error);
      setServerStatus('offline');
    }
  };

  useEffect(() => {
    checkServerStatus();
    const intervalId = setInterval(checkServerStatus, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Dashboard", link: "/dashboard" },
        { title: "New Test", link: "/dashboard" },
        { title: "LDPC Chip", link: "/dashboard" },
      ])
    );
  }, [dispatch]);

  const form = useForm<NewTestSchema_INFERRED>({
    resolver: zodResolver(NewTestSchema),
    defaultValues: {
      title: "",
      testBench: "",
      snrRange: "",
      batchSize: "",
    },
  });

  const checkTestBenchStatus = async (testBench: string) => {
    if (serverStatus !== 'online') return;
    try {
      const response = await fetch(`http://localhost:3001/status/${testBench}`, { method: 'GET' });
      if (response.ok) {
        const data = await response.json();
        setTestBenchStatus(prev => ({ ...prev, [testBench]: data.status }));
      } else {
        setTestBenchStatus(prev => ({ ...prev, [testBench]: 'offline' }));
      }
    } catch (error) {
      console.error(`Error checking status for ${testBench}:`, error);
      setTestBenchStatus(prev => ({ ...prev, [testBench]: 'offline' }));
    }
  };

  const onSubmit = async (data: NewTestSchema_INFERRED) => {
    const fullData = {
      ...data,
      author: user.username,
      DUT: data.DUT || 'Default DUT Value',
      username: user.username,
      accessible_to: JSON.stringify([user.username]),
      status: 'Queued',
      creationDate: '-',
      duration: '-', // Set to '-' initially
    };
  
    try {
      const response = await fetch("http://localhost:3001/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(fullData),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create test");
      }
  
      toast({
        title: "Success",
        description: "Test created successfully.",
        variant: "positive",
      });
  
      // Redirect to dashboard after successful creation
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "negative",
      });
    }
  };
  

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="inline-block w-4 h-4 text-green-500 ml-2" />;
      case 'offline':
        return <AlertCircle className="inline-block w-4 h-4 text-red-500 ml-2" />;
      case 'unstable':
        return <AlertTriangle className="inline-block w-4 h-4 text-yellow-500 ml-2" />;
      default:
        return null;
    }
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <Card className="bg-white shadow-lg rounded-lg overflow-hidden">
        <CardHeader className="bg-gray-50 border-b border-gray-200 p-6">
          <CardTitle className="text-2xl font-bold text-gray-900">New LDPC Chip Test</CardTitle>
          <CardDescription className="text-sm text-gray-600 mt-1">
            Configure your LDPC chip test parameters below.
          </CardDescription>
          <div className="mt-2 flex items-center">
            <span className="text-sm font-medium text-gray-700 mr-2">Server Status:</span>
            {serverStatus === 'checking' && <Loader2 className="w-4 h-4 animate-spin text-blue-500" />}
            {serverStatus === 'online' && <CheckCircle className="w-4 h-4 text-green-500" />}
            {serverStatus === 'offline' && <AlertCircle className="w-4 h-4 text-red-500" />}
            <span className="ml-1 text-sm text-gray-600">{serverStatus}</span>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Test Title</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="e.g., LDPC Performance Test 1" 
                        {...field} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </FormControl>
                    <FormDescription className="mt-1 text-sm text-gray-500">
                      Provide a descriptive title for your test.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testBench"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Test Bench</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value);
                        checkServerStatus(value);
                      }} 
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                        <SelectValue placeholder="Select a test bench" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available Test Benches</SelectLabel>
                          {['ldpc1', 'ldpc2', 'ldpc3'].map((bench) => (
                            <SelectItem key={bench} value={bench} className="flex items-center justify-between">
                              <span>{bench.toUpperCase()}</span>
                              {getStatusIcon(testBenchStatus[bench])}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormDescription className="mt-1 text-sm text-gray-500">
                      Choose the LDPC chip test bench for your experiment.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="snrRange"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">SNR Range</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="start:step:stop (e.g., 0:1:5)" 
                        {...field} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </FormControl>
                    <FormDescription className="mt-1 text-sm text-gray-500">
                      Specify the SNR range in the format start:step:stop.
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchSize"
                render={({field}) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Batch Size</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="e.g., 3" 
                        {...field} 
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </FormControl>
                    <FormDescription className="mt-1 text-sm text-gray-500">
                      Enter the number of batches (each containing 76,800 individual tests).
                    </FormDescription>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />

<div className="pt-5">
                <Button 
                  type="submit"
                  className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={serverStatus !== 'online'}
                >
                  Create LDPC Chip Test
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;

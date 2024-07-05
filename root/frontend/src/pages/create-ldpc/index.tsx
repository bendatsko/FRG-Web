import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slice/auth";

const TestSettingsSchema = z.object({
  title: z.string().nonempty("Title is required"),
  testBench: z.string().nonempty("Test Bench is required"),
  snrRange: z.string().regex(/^\d+:\d+:\d+$/, "SNR Range must be in the format start:step:stop"),
  batchSize: z.string().regex(/^\d+$/, "Batch Size must be a positive integer"),
});

type TestSettingsFormValues = z.infer<typeof TestSettingsSchema>;

const Create: React.FC = () => {
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const user = useSelector(selectUser);


  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Dashboard", link: "/dashboard" },
        { title: "New Test", link: "/dashboard" },
        { title: "LDPC Chip", link: "/dashboard" },
      ])
    );

    // Fetch the current user's ID
    const fetchUserId = async () => {
      // Replace this with your actual method of getting the current user's ID
      const response = await fetch("/api/current-user");
      const user = await response.json();
      setUserId(user.id);
    };

    fetchUserId();
  }, [dispatch]);

  const form = useForm<TestSettingsFormValues>({
    resolver: zodResolver(TestSettingsSchema),
    defaultValues: {
      title: "",
      testBench: "",
      snrRange: "",
      batchSize: "",
    },
  });

  const onSubmit = async (data: TestSettingsFormValues) => {
    const parsedData = {
        ...data,
        author: user.username,
        DUT: 'LDPC',
        username: user.username,
        accessible_to: [user.username],
        status: 'Queued',
        duration: 123
    };

    try {
        const response = await fetch("http://localhost:3001/tests", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(parsedData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to create test");
        }

        const result = await response.json();
        toast({
            title: "Test created",
            description: "Your LDPC chip test has been successfully created.",
        });
    } catch (error) {
        toast({
            title: "Error",
            description: error.message,
            variant: "destructive",
        });
    }
};



  return (
    <div className="container mx-auto mb-4">
      <Card>
        <CardHeader>
          <CardTitle>New LDPC Chip Test</CardTitle>
          <CardDescription>Complete the fields to create a new test suite for LDPC chip.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormDescription>Enter a title for your test.</FormDescription>
                    <FormControl>
                      <Input placeholder="LDPC Test 1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="testBench"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Test Bench</FormLabel>
                    <FormDescription>Select the available board with the LDPC chip.</FormDescription>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a test bench" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Available Test Benches</SelectLabel>
                          <SelectItem value="ldpc1">LDPC-1</SelectItem>
                          <SelectItem value="ldpc2">LDPC-2</SelectItem>
                          <SelectItem value="ldpc3">LDPC-3</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="snrRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SNR Range (Start:Step:Stop)</FormLabel>
                    <FormDescription>Enter the SNR range in the format start:step:stop (e.g., 0:1:5).</FormDescription>
                    <FormControl>
                      <Input placeholder="0:1:5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Size</FormLabel>
                    <FormDescription>Enter the number of batches (each containing 76800 individual tests).</FormDescription>
                    <FormControl>
                      <Input placeholder="3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end">
                <Button type="submit">Create LDPC Chip Test</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Create;
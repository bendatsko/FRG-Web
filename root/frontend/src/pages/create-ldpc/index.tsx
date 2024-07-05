"use client";

import {useState, useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";

// Validation schema
const TestSettingsSchema = z.object({
    title: z.string().nonempty("Title is required"),
    author: z.string().nonempty("Author is required"),
    DUT: z.string().nonempty("DUT is required"),
    status: z.string().nonempty("Status is required"),
    duration: z.string().nonempty("Duration is required"),
    user_id: z.string().nonempty("user_id is required"),
});

type TestSettingsFormValues = z.infer<typeof TestSettingsSchema>;

const Create: React.FC = () => {
    const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
          setBreadCrumb([
            { title: "Dashboard", link: "/dashboard" },
            { title: "New Test", link: "/dashboard" },
            { title: "LDPC Chip", link: "/dashboard" },
          ])
        );
      }, [dispatch]);
      
    const form = useForm<TestSettingsFormValues>({
        resolver: zodResolver(TestSettingsSchema),
        defaultValues: {
            title: "",
            author: "",
            DUT: "",
            status: "",
            duration: "",
            user_id: "",
        },
    });

    const onSubmit = async (data: TestSettingsFormValues) => {
        const parsedData = {
            ...data,
        };

        try {
            const response = await fetch("http://localhost:3001/tests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
            });

            const result = await response.json();
            if (response.ok) {
                toast({
                    title: "Test created",
                    description: (
                        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(result, null, 2)}
              </code>
            </pre>
                    ),
                });
            } else {
                throw new Error(result.message || "Failed to create test");
            }
        } catch (error) {
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const autoGenerateTests = () => {
        setAutoGenerateEnabled((current) => !current);
    };

    return (
        <div className="container mx-auto mb-4">
        <Card>
          <CardHeader>
            <CardTitle className>New Test</CardTitle>
            <CardDescription>Complete the fields to create a new test suite for LDPC chip.</CardDescription>
          </CardHeader>
          <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormDescription>description.</FormDescription>
                                    <FormControl>
                                        <Input placeholder="CoolGuy32" {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Test Bench</FormLabel>
                                    <FormDescription>description.</FormDescription>
                                    <Select>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a chip"/>
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Online</SelectLabel>
                                                <SelectItem value="ldpc1">LDPC-1</SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>SNR Range (Start:Step:Stop)</FormLabel>
                                    <FormDescription>description.</FormDescription>
                                    <FormControl>
                                        <Input placeholder="0:1:5" {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Test Groups (76336/Group)</FormLabel>
                                    <FormDescription>description.</FormDescription>
                                    <Input placeholder="3" {...field} />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="author"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Threshold</FormLabel>
                                    <FormDescription>description.</FormDescription>
                                    <FormControl>
                                        <Input placeholder="4" {...field} />
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormDescription>Test UUID: 123-4556-78910</FormDescription>

                        <div className="flex justify-end">
                            <Button type="submit">Add Test to Queue</Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
            </Card>
        </div>
    );
};

export default Create;

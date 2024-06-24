"use client";

import { useState} from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

// Validation schema
const TestSettingsSchema = z.object({
    testBench: z.string().nonempty("Test bench is required"),
    snrRange: z.string().nonempty("SNR range is required"),
    numTests: z
        .number()
        .positive()
        .int()
        .nonnegative()
        .refine((value) => value > 0, {
            message: "Number of tests must be a positive integer",
        }),
});

type TestSettingsFormValues = z.infer<typeof TestSettingsSchema>;

const TestSettings: React.FC = () => {
    const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false);

    const form = useForm<TestSettingsFormValues>({
        resolver: zodResolver(TestSettingsSchema),
        defaultValues: {
            testBench: "",
            snrRange: "",
            numTests: undefined,
        },
    });

    const onSubmit = (data: TestSettingsFormValues) => {
        toast({
            title: "Form submitted",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
            ),
        });
        console.log("Form data", data);
    };

    const autoGenerateTests = () => {
        setAutoGenerateEnabled(current => !current);
    };

    return (
        <div className="container mx-auto p-6">
            <div className="text-2xl font-semibold mb-4">Test Settings</div>
            <div className="dark:text-light mb-6">
                Configure the settings for your LDPC test.
            </div>
            <div className="border-b border-black/20 dark:border-white/20 mb-6" />

            <div className="max-w-lg mx-auto">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="testBench"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Test Bench</FormLabel>
                                    <FormControl>
                                        <Controller
                                            control={form.control}
                                            name="testBench"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a test bench" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="bench1">Test Bench 1</SelectItem>
                                                        <SelectItem value="bench2">Test Bench 2</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="snrRange"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>SNR Range</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter SNR range" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="numTests"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Number of Tests</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-2">
                                            <Input
                                                type="number"
                                                placeholder={autoGenerateEnabled ? "Auto-calculating number of tests needed." : "Enter number of tests"}
                                                {...field}
                                                disabled={autoGenerateEnabled}
                                                className="flex-1"
                                            />
                                            <Button type="button" onClick={autoGenerateTests} className="whitespace-nowrap">
                                                {autoGenerateEnabled ? "Manual Entry" : "Auto-Generate"}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <div className="flex justify-end">
                            <Button type="submit">
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default TestSettings;

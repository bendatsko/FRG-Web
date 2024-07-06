import React, {useEffect} from "react";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {toast} from "@/components/ui/use-toast";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useDispatch, useSelector} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import {selectUser} from "@/store/slice/auth";

// Define the schema for the form we'll use for filling out the test settings
const NewTestSchema = z.object({
    title: z.string().nonempty("Title is required"),
    testBench: z.string().nonempty("Test Bench is required"),
    snrRange: z.string().regex(/^\d+:\d+:\d+$/, "SNR Range must be in the format start:step:stop"),
    batchSize: z.string().regex(/^\d+$/, "Batch Size must be a positive integer"),
});

// Infer the type of the form values from the schema
type NewTestSchema_INFERRED = z.infer<typeof NewTestSchema>;

// Initialize the Create component
const Create: React.FC = () => {

    // Get current user
    const user = useSelector(selectUser);

    // Set breadcrumbs
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(
            setBreadCrumb([
                {title: "Dashboard", link: "/dashboard"},
                {title: "New Test", link: "/dashboard"},
                {title: "LDPC Chip", link: "/dashboard"},
            ])
        );

    }, [dispatch]);

    // Create an instance of the form. Define fields and initial values.
    const form = useForm<NewTestSchema_INFERRED>({
        resolver: zodResolver(NewTestSchema),
        defaultValues: {
            title: "",
            testBench: "",
            snrRange: "",
            batchSize: "",
        },
    });

    // Define the function to be called when the form is submitted
    const onSubmit = async (data: NewTestSchema_INFERRED) => {
        const parsedData = {
            ...data,
            author: '',
            DUT: 'LDPC',             // Device Under Test
            username: user.username, // User who created the test
            accessible_to: [user.username], // User who can access the test
            status: 'Queued',               // Initial status of the test
            duration: getFormattedStartTimestamp(), // Duration of the test
        };

        // Send the data to the backend
        try {
            const response = await fetch("http://localhost:3001/tests", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(parsedData),
            });

            // Handle errors
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to create test");
            }

            // Display success message
            await response.json();
            toast({
                title: "Test created",
                description: "Your LDPC chip test has been successfully created.",
            });
        }
            // Handle errors
        catch (error) {
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
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
                                        <FormDescription>Enter a title for your test.</FormDescription>
                                        <FormControl>
                                            <Input placeholder="LDPC Test 1" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="testBench"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Test Bench</FormLabel>
                                        <FormDescription>Select the available board with the LDPC
                                            chip.</FormDescription>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a test bench"/>
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
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="snrRange"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>SNR Range (Start:Step:Stop)</FormLabel>
                                        <FormDescription>Enter the SNR range in the format start:step:stop (e.g.,
                                            0:1:5).</FormDescription>
                                        <FormControl>
                                            <Input placeholder="0:1:5" {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="batchSize"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Batch Size</FormLabel>
                                        <FormDescription>Enter the number of batches (each containing 76800 individual
                                            tests).</FormDescription>
                                        <FormControl>
                                            <Input placeholder="3" {...field} />
                                        </FormControl>
                                        <FormMessage/>
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


const getFormattedStartTimestamp = (): string => {
    const now = new Date();
    const formattedTimestamp = now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
    return `${formattedTimestamp} ...`;
};

//
console.log(getFormattedStartTimestamp()); // Outputs: "MM/DD/YY HH:MM ..."
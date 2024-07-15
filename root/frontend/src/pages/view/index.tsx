import React from "react";
import {useParams} from "react-router-dom";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import Details from "./components/tabs/details";
import Analytics from "./components/tabs/analytics";
import {
    useGetTestByIdQuery,
    useLazyDownloadResultsQuery,
    useRerunTestMutation,
    useUpdateThresholdMutation
} from "@/store/api/v1/endpoints/test";
import {Loading} from "@geist-ui/core";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/components/ui/use-toast";

const View: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const {data: test, isLoading, error} = useGetTestByIdQuery(id);
    const [updateThreshold] = useUpdateThresholdMutation();
    const [rerunTest] = useRerunTestMutation();
    const [downloadResults] = useLazyDownloadResultsQuery();
    const {toast} = useToast();

    React.useEffect(() => {
        dispatch(
            setBreadCrumb([
                {
                    title: "Tests",
                    link: "/dashboard",
                },
                {
                    title: "Details",
                    link: `/view/${id}`,
                },
            ])
        );
    }, [dispatch, id]);

    const handleUpdateThreshold = async (newThreshold: number) => {
        try {
            await updateThreshold({id, threshold: newThreshold}).unwrap();
            toast({
                title: "Success",
                description: "Threshold updated successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update threshold",
                variant: "destructive",
            });
        }
    };

    const handleRerunTest = async () => {
        try {
            await rerunTest(id).unwrap();
            toast({
                title: "Success",
                description: "Test rerun successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to rerun test",
                variant: "destructive",
            });
        }
    };

    const handleDownloadResults = async () => {
        try {
            const blob = await downloadResults(id).unwrap();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = `test_${id}_results.csv`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            toast({
                title: "Success",
                description: "Results downloaded successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to download results",
                variant: "destructive",
            });
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center pt-10">
                <div className="w-[250px]">
                    <Loading/>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto mb-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Error</CardTitle>
                        <CardDescription>An error occurred while fetching the test details.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error instanceof Error ? error.message : 'Unknown error occurred'}
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!test) {
        return (
            <div className="container mx-auto mb-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Not Found</CardTitle>
                        <CardDescription>The requested test could not be found.</CardDescription>
                    </CardHeader>
                </Card>
            </div>
        );
    }

    return (
        <div>
            <Tabs defaultValue="details">
                <TabsList>
                    <TabsTrigger value="details" className="lg:w-[150px] w-full">
                        Test Details
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="lg:w-[150px] w-full">
                        Analytics
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                    <Details
                        test={test}
                        onUpdateThreshold={handleUpdateThreshold}
                        onRerunTest={handleRerunTest}
                        onDownloadResults={handleDownloadResults}
                    />
                </TabsContent>
                <TabsContent value="analytics" className="mt-4">
                    <Analytics testResults={test.results}/>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default View;
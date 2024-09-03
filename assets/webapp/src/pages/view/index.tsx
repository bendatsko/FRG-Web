import React from "react";
import {useParams} from "react-router-dom";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {useDispatch} from "react-redux";
import {setBreadCrumb} from "@/store/slice/app";
import Details from "./components/tabs/details";
import {
  useGetTestByIdQuery,
  useLazyDownloadResultsQuery,
  useRerunTestMutation,
  useUpdateThresholdMutation
} from "@/store/api/v1/endpoints/test";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {useToast} from "@/components/ui/use-toast";
import {AlertCircle, Loader2} from "lucide-react";

const View: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const dispatch = useDispatch();
    const {data: test, isLoading, error} = useGetTestByIdQuery(id);
    const [updateThreshold] = useUpdateThresholdMutation();
    const [rerunTest] = useRerunTestMutation();
    const [downloadResults] = useLazyDownloadResultsQuery();
    const {toast} = useToast();





    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-gray-100">{test.title}</h1>
            <Tabs defaultValue="details" className="space-y-6">
                <TabsList className="bg-secondary">
                    <TabsTrigger value="details"
                                 className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Test Details
                    </TabsTrigger>
                    <TabsTrigger value="analytics"
                                 className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                        Analytics
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="bg-card p-6 rounded-lg shadow-lg">

                </TabsContent>
                <TabsContent value="analytics" className="bg-card p-6 rounded-lg shadow-lg">
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default View;
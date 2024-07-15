import React, {useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {AlertCircle, Download, RefreshCw} from "lucide-react";

interface TestDetailsProps {
    test: {
        id: string;
        title: string;
        author: string;
        DUT: string;
        status: string;
        duration: number;
        testBench: string;
        snrRange: string;
        batchSize: number;
        threshold: number;
    };
    onUpdateThreshold: (newThreshold: number) => void;
    onRerunTest: () => void;
    onDownloadResults: () => void;
}

const TestDetails: React.FC<TestDetailsProps> = ({test, onUpdateThreshold, onRerunTest, onDownloadResults}) => {
    const [newThreshold, setNewThreshold] = useState(test.threshold);

    const handleThresholdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewThreshold(Number(e.target.value));
    };

    const handleUpdateThreshold = () => {
        onUpdateThreshold(newThreshold);
    };

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Test Details</h2>

            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Basic Information</h3>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Test ID:</p>
                        <p>{test.id}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Title:</p>
                        <p>{test.title}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Author:</p>
                        <p>{test.author}</p>
                    </div>
                    <div>
                        <p className="font-semibold">DUT:</p>
                        <p>{test.DUT}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Status:</p>
                        <p>{test.status}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Duration:</p>
                        <p>{test.duration} ms</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Test Configuration</h3>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="font-semibold">Test Bench:</p>
                        <p>{test.testBench}</p>
                    </div>
                    <div>
                        <p className="font-semibold">SNR Range:</p>
                        <p>{test.snrRange}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Batch Size:</p>
                        <p>{test.batchSize}</p>
                    </div>
                    <div>
                        <p className="font-semibold">Current Threshold:</p>
                        <p>{test.threshold}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Actions</h3>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center space-x-2">
                        <Input
                            type="number"
                            value={newThreshold}
                            onChange={handleThresholdChange}
                            placeholder="New threshold value"
                        />
                        <Button onClick={handleUpdateThreshold}>Update Threshold</Button>
                    </div>
                    <div className="flex space-x-2">
                        <Button onClick={onRerunTest} className="flex items-center">
                            <RefreshCw className="mr-2 h-4 w-4"/> Rerun Test
                        </Button>
                        <Button onClick={onDownloadResults} className="flex items-center">
                            <Download className="mr-2 h-4 w-4"/> Download Results
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {test.status === 'Failed' && (
                <Card className="bg-red-100 dark:bg-red-900">
                    <CardContent className="flex items-center space-x-2 text-red-800 dark:text-red-200">
                        <AlertCircle className="h-5 w-5"/>
                        <p>This test has failed. Please review the results and consider rerunning the test.</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default TestDetails;
import React, {useState} from "react";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';

// This is dummy data. Replace with actual data from your test results.
const dummyData = [
    {snr: -5, ber: 0.1, fer: 0.2},
    {snr: -2, ber: 0.05, fer: 0.1},
    {snr: 0, ber: 0.02, fer: 0.05},
    {snr: 2, ber: 0.01, fer: 0.02},
    {snr: 5, ber: 0.005, fer: 0.01},
];

interface AnalyticsProps {
    testResults: typeof dummyData;
}

const Analytics: React.FC<AnalyticsProps> = ({testResults}) => {
    const [chartType, setChartType] = useState<'ber' | 'fer'>('ber');

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Test Analytics</h2>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-semibold">Performance Curves</h3>
                        <Select onValueChange={(value: 'ber' | 'fer') => setChartType(value)}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select chart type"/>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ber">Bit Error Rate (BER)</SelectItem>
                                <SelectItem value="fer">Frame Error Rate (FER)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={testResults}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="snr"
                                   label={{value: 'SNR (dB)', position: 'insideBottomRight', offset: -10}}/>
                            <YAxis
                                label={{value: chartType.toUpperCase(), angle: -90, position: 'insideLeft'}}
                                scale="log"
                                domain={['auto', 'auto']}
                            />
                            <Tooltip/>
                            <Legend/>
                            <Line type="monotone" dataKey={chartType} stroke="#8884d8" activeDot={{r: 8}}/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <h3 className="text-xl font-semibold">Summary Statistics</h3>
                </CardHeader>
                <CardContent>
                    <table className="w-full">
                        <thead>
                        <tr>
                            <th className="text-left">Metric</th>
                            <th className="text-left">Value</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>Average BER</td>
                            <td>{(testResults.reduce((sum, result) => sum + result.ber, 0) / testResults.length).toExponential(2)}</td>
                        </tr>
                        <tr>
                            <td>Average FER</td>
                            <td>{(testResults.reduce((sum, result) => sum + result.fer, 0) / testResults.length).toExponential(2)}</td>
                        </tr>
                        <tr>
                            <td>Best SNR</td>
                            <td>{Math.max(...testResults.map(result => result.snr))} dB</td>
                        </tr>
                        <tr>
                            <td>Worst SNR</td>
                            <td>{Math.min(...testResults.map(result => result.snr))} dB</td>
                        </tr>
                        </tbody>
                    </table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Analytics;
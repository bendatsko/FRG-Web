import {Card, CardHeader} from "@/components/ui/card";
import React from "react";
import {Mail, User, UserCheck} from "tabler-icons-react";

const Details: React.FC = () => {
    return (
        <div>
            <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Test Details</div>
            <div className="mt-2 text-gray-600 dark:text-gray-300">
                Access and manage your personal information, including personal details, preferences, and settings.
            </div>
            <div className="my-4 border dark:border-gray-700"/>
            <div className="lg:w-6/12">
                <div className="flex flex-col lg:flex-row flex-wrap">
                    <div className="basis-1/2 p-1">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between text-gray-800 dark:text-gray-200">
                                    Username <User/>
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">John</div>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="basis-1/2 p-1">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between text-gray-800 dark:text-gray-200">
                                    Email <Mail/>
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">John@gmail.com</div>
                            </CardHeader>
                        </Card>
                    </div>
                    <div className="basis-1/2 p-1">
                        <Card>
                            <CardHeader>
                                <div className="flex justify-between text-gray-800 dark:text-gray-200">
                                    Role <UserCheck/>
                                </div>
                                <div className="text-gray-600 dark:text-gray-300">Admin</div>
                            </CardHeader>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Details;

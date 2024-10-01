import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
import { useGetUsersQuery } from "@/store/api/v1/endpoints/user";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { Loading } from "@geist-ui/core";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Bell, Server, Cpu, RefreshCw, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DatePickerDemo } from "@/components/ui/datepicker";
import { TimePicker } from "@/components/ui/time-picker";

const scheduleTaskAPI = async (type, time) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  if (Math.random() > 0.9) {
    throw new Error("API error");
  }
  return { success: true };
};

const AdminControlPanel = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [alertMessage, setAlertMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [newTestBench, setNewTestBench] = useState("");
  const [newChip, setNewChip] = useState("");
  const [newPreset, setNewPreset] = useState("");
  const [scheduleType, setScheduleType] = useState("restart");
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [scheduleTime, setScheduleTime] = useState("00:00");

  const { data: users, isLoading } = useGetUsersQuery({});

  useEffect(() => {
    dispatch(
        setBreadCrumb([
          { title: "Admin", link: "/admin" },
          { title: "Control Panel", link: "/admin/control-panel" },
        ])
    );
  }, [dispatch]);

  const handleAction = async (action, message) => {
    toast({
      title: action,
      description: message,
    });
  };

  const scheduleTask = async () => {
    if (!scheduleDate) {
      toast({
        title: "Invalid Date",
        description: "Please select a valid date for scheduling.",
        variant: "destructive",
      });
      return;
    }

    const scheduledTime = new Date(scheduleDate);
    const [hours, minutes] = scheduleTime.split(":");
    scheduledTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    try {
      await scheduleTaskAPI(scheduleType, scheduledTime);
      toast({
        title: "Task Scheduled",
        description: `${scheduleType.charAt(0).toUpperCase() + scheduleType.slice(1)} scheduled for ${scheduledTime.toLocaleString()}`,
      });
    } catch (error) {
      toast({
        title: "Scheduling Failed",
        description: "There was an error scheduling the task. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
        <div className="flex justify-center items-center h-screen">
          <Loading />
        </div>
    );
  }

  return (
      <div className=" w-full border-none border-lightborder bg-background dark:bg-background dark:border-darkborder ">
        <div className="container mx-auto py-6">
          <div className="flex flex-row justify-between items-center">


            <h1 className="text-3xl font-bold text-lighth1">
              Admin Hub
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 ">
             <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center text-lg font-medium">
                  <Bell className="w-5 h-5 mr-2"/>
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                      placeholder="Enter site-wide alert message"
                      value={alertMessage}
                      onChange={(e) => setAlertMessage(e.target.value)}
                      className="mb-2"
                  />
                  <Button
                      variant="outline"
                      onClick={() =>
                          handleAction("Alert Sent", "Site-wide alert has been sent successfully.")
                      }
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Send Alert
                  </Button>
                </div>
                <div>
                  <Input
                      placeholder="Email Subject"
                      value={emailSubject}
                      onChange={(e) => setEmailSubject(e.target.value)}
                      className="mb-2"
                  />
                  <Textarea
                      placeholder="Email Body"
                      value={emailBody}
                      onChange={(e) => setEmailBody(e.target.value)}
                      className="mb-2"
                  />
                  <Button
                      variant="outline"
                      onClick={() =>
                          handleAction("Emails Sent", "Emails have been sent to all users.")
                      }
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    Send Email to All Users
                  </Button>
                </div>
              </CardContent>
            </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-medium">
                    <Server className="w-5 h-5 mr-2"/>
                    Server Management
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                      variant="outline"
                      onClick={() =>
                          handleAction("Server Restarting", "The server is now restarting. This may take a few minutes.")
                      }
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2"/>
                    Restart Server Now
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() =>
                          handleAction("Updating and Restarting", "The server is updating from GitHub and will restart. This may take several minutes.")
                      }
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                  >
                    <RefreshCw className="w-4 h-4 mr-2"/>
                    Update and Restart Now
                  </Button>
                  <div className="space-y-2">
                    <Select onValueChange={setScheduleType} defaultValue={scheduleType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select task type"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="restart">Server Restart</SelectItem>
                        <SelectItem value="update">Software Update</SelectItem>
                      </SelectContent>
                    </Select>
                    <DatePickerDemo
                        date={scheduleDate}
                        setDate={setScheduleDate}
                        label="Select Date"
                    />
                    <TimePicker
                        time={scheduleTime}
                        setTime={setScheduleTime}
                        label="Select Time"
                    />
                    <Button
                        variant="outline"
                        onClick={scheduleTask}
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      <Clock className="w-4 h-4 mr-2"/>
                      Schedule Task
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-medium">
                    <Cpu className="w-5 h-5 mr-2"/>
                    Test Benches & Chips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Input
                        placeholder="New Test Bench Name"
                        value={newTestBench}
                        onChange={(e) => setNewTestBench(e.target.value)}
                        className="mb-2"
                    />
                    <Button
                        variant="outline"
                        onClick={() =>
                            handleAction("Test Bench Added", `New test bench "${newTestBench}" has been added.`)
                        }
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Add Test Bench
                    </Button>
                  </div>
                  <div>
                    <Input
                        placeholder="New Chip Name"
                        value={newChip}
                        onChange={(e) => setNewChip(e.target.value)}
                        className="mb-2"
                    />
                    <Button
                        variant="outline"
                        onClick={() =>
                            handleAction("Chip Added", `New chip "${newChip}" has been added.`)
                        }
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Add Chip
                    </Button>
                  </div>
                  <div>
                    <Input
                        placeholder="New Preset Name"
                        value={newPreset}
                        onChange={(e) => setNewPreset(e.target.value)}
                        className="mb-2"
                    />
                    <Button
                        variant="outline"
                        onClick={() =>
                            handleAction("Preset Added", `New preset "${newPreset}" has been added.`)
                        }
                        className="w-full border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Add Preset
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center text-lg font-medium">
                    <AlertCircle className="w-5 h-5 mr-2"/>
                    User Management
                  </CardTitle>
                  <CardDescription>Manage user access and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable columns={columns} data={users || []}/>
                </CardContent>
              </Card>
          </div>
        </div>
      </div>

);
};

export default AdminControlPanel;

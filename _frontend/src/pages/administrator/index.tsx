import React, { useEffect, useState } from "react";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import { useGetUsersQuery } from "@/store/api/v1/endpoints/user";
import { useDispatch } from "react-redux";
import { setBreadCrumb } from "@/store/slice/app";
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
import { AlertCircle, Mail, Bell, Server, Cpu, Bookmark, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AdminControlPanel = () => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [alertMessage, setAlertMessage] = useState("");
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [newTestBench, setNewTestBench] = useState("");
  const [newChip, setNewChip] = useState("");
  const [newPreset, setNewPreset] = useState("");

  useEffect(() => {
    dispatch(
        setBreadCrumb([
          { title: "Admin", link: "/admin" },
          { title: "Control Panel", link: "/admin/control-panel" },
        ])
    );
  }, [dispatch]);

  const { data: users, isLoading } = useGetUsersQuery({});

  const sendSiteWideAlert = async () => {
    // Implement the logic to send a site-wide alert
    toast({
      title: "Alert Sent",
      description: "Site-wide alert has been sent successfully.",
    });
    setAlertMessage("");
  };

  const sendEmailToUsers = async () => {
    // Implement the logic to send emails to users
    toast({
      title: "Emails Sent",
      description: "Emails have been sent to all users.",
    });
    setEmailSubject("");
    setEmailBody("");
  };

  const restartServer = async () => {
    // Implement server restart logic
    toast({
      title: "Server Restarting",
      description: "The server is now restarting. This may take a few minutes.",
    });
  };

  const addTestBench = async () => {
    // Implement adding test bench logic
    toast({
      title: "Test Bench Added",
      description: `New test bench "${newTestBench}" has been added.`,
    });
    setNewTestBench("");
  };

  const addChip = async () => {
    // Implement adding chip logic
    toast({
      title: "Chip Added",
      description: `New chip "${newChip}" has been added.`,
    });
    setNewChip("");
  };

  const addPreset = async () => {
    // Implement adding preset logic
    toast({
      title: "Preset Added",
      description: `New preset "${newPreset}" has been added.`,
    });
    setNewPreset("");
  };

  if (isLoading) {
    return (
        <div className="flex justify-center pt-10">
          <div className="w-[250px]">
            <Loading />
          </div>
        </div>
    );
  }

  return (
      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 w-11/12">
          <div className="flex justify-between items-center overflow-hidden py-6 border-b border-lightborder">
            <h1 className="text-3xl font-bold text-lighth1">Admin Control Panel</h1>
          </div>

          <Tabs defaultValue="notifications" className="mt-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-8">
              <TabsTrigger
                  value="notifications"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out rounded-l-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Notifications
              </TabsTrigger>
              <TabsTrigger
                  value="server"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Server Management
              </TabsTrigger>
              <TabsTrigger
                  value="testbenches"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Test Benches & Chips
              </TabsTrigger>
              <TabsTrigger
                  value="users"
                  className="px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out rounded-r-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                User Management
              </TabsTrigger>
            </TabsList>

            <TabsContent value="notifications">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bell className="mr-2" />
                      Send Site-Wide Alert
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                        placeholder=""
                        value={alertMessage}
                        onChange={(e) => setAlertMessage(e.target.value)}
                        className="mb-4 shadow-none border-foreground border"
                    />
                    <Button onClick={sendSiteWideAlert} className="w-full">
                      Send Alert
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Mail className="mr-2" />
                      Send Email to All Users
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                        placeholder="Email Subject"
                        value={emailSubject}
                        onChange={(e) => setEmailSubject(e.target.value)}
                        className="mb-2 border dark:border-foreground border-foreground placeholder-foreground text-sm"
                    />
                    <Textarea
                        placeholder="Email Body"
                        value={emailBody}
                        onChange={(e) => setEmailBody(e.target.value)}
                        className="mb-4 dark:border-foreground border-foreground placeholder-foreground text-sm"
                    />
                    <Button onClick={sendEmailToUsers} className="w-full">
                      Send
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="server">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Server className="mr-2" />
                    Server Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={restartServer} className="w-full">
                    <RefreshCw className="mr-2" />
                    Restart Server
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testbenches">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Cpu className="mr-2" />
                      Manage Test Benches and Chips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Input
                          placeholder="New Test Bench Name"
                          value={newTestBench}
                          onChange={(e) => setNewTestBench(e.target.value)}
                          className="mb-2 border dark:border-foreground border-foreground placeholder-foreground text-sm"
                      />
                      <Button onClick={addTestBench} className="w-full">
                        Add Test Bench
                      </Button>
                    </div>
                    <div>
                      <Input
                          placeholder="New Chip Name"
                          value={newChip}
                          onChange={(e) => setNewChip(e.target.value)}
                          className="mb-2 border dark:border-foreground border-foreground placeholder-foreground text-sm"
                      />
                      <Button onClick={addChip} className="w-full">
                        Add Chip
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Bookmark className="mr-2" />
                      Manage Presets
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                        placeholder="New Preset Name"
                        value={newPreset}
                        onChange={(e) => setNewPreset(e.target.value)}
                        className="mb-2 border dark:border-foreground border-foreground placeholder-foreground text-sm"
                    />
                    <Button onClick={addPreset} className="w-full">
                      Add Preset
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user access and permissions</CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable columns={columns} data={users} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
  );
};

export default AdminControlPanel;
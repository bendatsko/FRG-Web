import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/store/slice/auth";
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
import { useToast } from "@/components/ui/use-toast";
import { AlertCircle, CheckCircle, Loader2, Plus, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { setBreadCrumb } from "@/store/slice/app";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const baseUrl = import.meta.env.VITE_API_URL;

const NewTestSchema = z.object({
  title: z.string().nonempty("Title is required"),
  testBench: z.string().nonempty("Test Bench is required"),
  snrRange: z
      .string()
      .regex(/^\d+:\d+:\d+$/, "SNR Range must be in the format start:step:stop"),
  batchSize: z.string().regex(/^\d+$/, "Batch Size must be a positive integer"),
});

type NewTestSchema_INFERRED = z.infer<typeof NewTestSchema>;

type Preset = {
  id: string;
  name: string;
  config: Partial<NewTestSchema_INFERRED>;
};

const samplePresets: Preset[] = [
  {
    id: "1",
    name: "LDPC",
    config: {
      title: "LDPC Default",
      testBench: "LDPC1",
      snrRange: "0:1:5",
      batchSize: "3",
    },
  },
];

const PresetSelector: React.FC<{
  presets: Preset[];
  onSelect: (preset: Preset) => void;
  onSave: () => void;
}> = ({ presets, onSelect, onSave }) => (
    <div className="flex items-center space-x-2">
      <Select
          onValueChange={(value) => onSelect(presets.find((p) => p.id === value)!)}
      >
        <SelectTrigger className="w-full border-lightborder">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent>
          {presets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button variant="outline" disabled onClick={onSave} className="border-lightborder">
        <Save className="h-4 w-4 mr-2" />
        Save
      </Button>
    </div>
);

const Create: React.FC = () => {
  const user = useSelector(selectUser);
  const navigate = useNavigate();
  const [serverStatus, setServerStatus] = useState<
      "online" | "offline" | "checking"
  >("checking");
  const [presets, setPresets] = useState<Preset[]>(samplePresets);
  const dispatch = useDispatch();
  const { toast } = useToast();

  useEffect(() => {
    dispatch(
        setBreadCrumb([
          { title: "Dashboard", link: "/dashboard" },
          { title: "Create", link: "" },
          { title: "LDPC", link: "new-test" },
        ])
    );
  }, [dispatch]);

  const form = useForm<NewTestSchema_INFERRED>({
    resolver: zodResolver(NewTestSchema),
    defaultValues: {
      title: "",
      testBench: "",
      snrRange: "",
      batchSize: "",
    },
  });

  const checkServerHealth = async () => {
    try {
      const response = await fetch(`${baseUrl}/health`, { method: "GET" });
      const data = await response.json();
      setServerStatus(data.status === "OK" ? "online" : "offline");
    } catch (error) {
      console.error("Error checking server health:", error);
      setServerStatus("offline");
    }
  };

  useEffect(() => {
    checkServerHealth();
    const intervalId = setInterval(checkServerHealth, 60000); // Check every minute
    return () => clearInterval(intervalId);
  }, []);

  const onSubmit = async (data: NewTestSchema_INFERRED) => {
    const fullData = {
      ...data,
      author: user.username,
      DUT: data.testBench || "Default DUT Value",
      username: user.username,
      user_id: user.id,
      accessible_to: JSON.stringify([user.username]),
      status: "Queued",
      creationDate: "-",
      duration: "-",
    };

    try {
      const response = await fetch(`${baseUrl}/tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(fullData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create test");
      }

      toast({
        title: "Success",
        description: "Test created successfully.",
        variant: "default",
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const onPresetSelect = (preset: Preset) => {
    Object.entries(preset.config).forEach(([key, value]) => {
      form.setValue(key as keyof NewTestSchema_INFERRED, value as string);
    });
    // Set a default title based on the preset name
    const defaultTitle = preset.config.title || `${preset.name} Test`;
    form.setValue("title", defaultTitle);
  };

  const onPresetSave = () => {
    const currentValues = form.getValues();
    const newPreset: Preset = {
      id: (presets.length + 1).toString(),
      name: `Custom Preset ${presets.length + 1}`,
      config: currentValues,
    };
    setPresets([...presets, newPreset]);
    toast({
      title: "Preset Saved",
      description: `New preset "${newPreset.name}" has been created.`,
    });
  };

  return (
      <div className=" w-full border-none border-lightborder bg-background dark:bg-background dark:border-darkborder ">
        <div className="container mx-auto py-6">
          <div className="flex flex-row justify-between items-center">


            <h1 className="text-3xl font-bold text-lighth1">
              New Test
            </h1>
          </div>


          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-lighth1">Test Configuration</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="title"
                        render={({field}) => (
                            <FormItem>
                              <FormLabel className="text-lighth1">Title</FormLabel>
                              <FormControl>
                                <Input
                                    placeholder="Untitled test"
                                    {...field}
                                    className="border-lightborder placeholder-lighth2 dark:placeholder-foreground text-sm"
                                />
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
                              <FormLabel className="text-lighth1">Test Bench</FormLabel>
                              <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-lightborder">
                                    <SelectValue
                                        placeholder="Select a test bench"
                                        className="placeholder-lighth2"
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {["LDPC1"].map((bench) => (
                                      <SelectItem key={bench} value={bench}>
                                        {bench.toUpperCase()}
                                      </SelectItem>
                                  ))}
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
                              <FormLabel className="text-lighth1 ">SNR Range</FormLabel>
                              <FormControl>
                                <Input
                                    placeholder="start:step:stop (e.g., 0:1:5)"
                                    {...field}
                                    className="border-lightborder placeholder-lighth2 dark:placeholder-foreground text-sm"
                                />
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
                              <FormLabel className="text-lighth1">Batch Size</FormLabel>
                              <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g., 3"
                                    {...field}
                                    className="border-lightborder placeholder-lighth2 "
                                />
                              </FormControl>
                              <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                      <Button
                          type="submit"
                          className="w-auto"
                          disabled={serverStatus !== "online"}
                      >
                        <Plus className="h-4 w-4 mr-2"/>
                        Add Test to Queue
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lighth1">Presets</CardTitle>
                </CardHeader>
                <CardContent>
                  <PresetSelector
                      presets={presets}
                      onSelect={onPresetSelect}
                      onSave={onPresetSave}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lighth1">Server Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-2">
                    {serverStatus === "online" ? (
                        <CheckCircle className="h-5 w-5 text-green-500"/>
                    ) : serverStatus === "offline" ? (
                        <AlertCircle className="h-5 w-5 text-red-500"/>
                    ) : (
                        <Loader2 className="h-5 w-5 animate-spin text-yellow-500"/>
                    )}
                    <span className="text-lighth1 capitalize">{serverStatus}</span>
                  </div>
                </CardContent>
              </Card>

              {serverStatus === "offline" && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4"/>
                    <AlertTitle>Server Offline</AlertTitle>
                    <AlertDescription>
                      The server is currently offline. You can create a test, but it won't be added to the queue until
                      the server is back online.
                    </AlertDescription>
                  </Alert>
              )}
            </div>
          </div>
        </div>
      </div>
  );
};

export default Create;
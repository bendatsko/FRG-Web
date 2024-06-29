"use client";

import { useState } from "react";
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
  FormDescription,
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
import { InputPassword } from "@/components";
import { Textarea } from "@/components/ui/textarea";

// Validation schema
const TestSettingsSchema = z.object({
  title: z.string().nonempty("Title is required"),
  author: z.string().nonempty("Author is required"),
  DUT: z.string().nonempty("DUT is required"),
  status: z.string().nonempty("Status is required"),
  duration: z.string().nonempty("Duration is required"),
  user_id: z.string().nonempty("user_id is required"),
});

type TestSettingsFormValues = z.infer<typeof TestSettingsSchema>;

const TestSettings: React.FC = () => {
  const [autoGenerateEnabled, setAutoGenerateEnabled] = useState(false);

  const form = useForm<TestSettingsFormValues>({
    resolver: zodResolver(TestSettingsSchema),
    defaultValues: {
      title: "",
      author: "",
      DUT: "",
      status: "",
      duration: "",
      user_id: "",
    },
  });

  const onSubmit = async (data: TestSettingsFormValues) => {
    const parsedData = {
      ...data,
    };

    try {
      const response = await fetch("http://localhost:3001/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedData),
      });

      const result = await response.json();
      if (response.ok) {
        toast({
          title: "Test created",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(result, null, 2)}
              </code>
            </pre>
          ),
        });
      } else {
        throw new Error(result.message || "Failed to create test");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const autoGenerateTests = () => {
    setAutoGenerateEnabled((current) => !current);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="text-2xl font-semibold mb-4">Account</div>
      <div className="dark:text-light mb-6">
        Manage your account settings and set preferences.
      </div>
      <div className="border-b border-black/20 dark:border-white/20 mb-6" />

      <div className=" ">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="CoolGuy32" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="foo@umich.edu" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      defaultValue="I own a computer."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <InputPassword
                    name="password1"
                    id="password1"
                    placeholder="****"
                  />

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <InputPassword
                    name="password2"
                    id="password2"
                    placeholder="****"
                  />
                </FormItem>
              )}
            />
            <FormDescription>
              UUID: 123-4556-78910
              <br />
              Role: Authorized
            </FormDescription>
            <div className="flex justify-end">
              <Button type="submit">Update profile</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default TestSettings;

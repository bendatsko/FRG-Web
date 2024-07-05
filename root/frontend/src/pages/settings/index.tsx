import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "@/store/slice/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
// import { Separator } from "@/components/ui/se";
import { toast } from "@/components/ui/use-toast";
import {setBreadCrumb} from "@/store/slice/app";
import {useDispatch} from "react-redux";







  

const SettingsSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(160, "Bio must not exceed 160 characters").optional(),
});

const PasswordResetSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const Settings = () => {
  const user = useSelector(selectUser);
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadCrumb([
        { title: "Dashboard", link: "/dashboard" },
        { title: "Settings", link: "/settings" },

      ])
    );
  }, [dispatch]);


  const form = useForm({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  const resetForm = useForm({
    resolver: zodResolver(PasswordResetSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`http://localhost:3001/users/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Settings updated",
          description: "Your account settings have been updated successfully.",
        });
      } else {
        throw new Error('Failed to update settings');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    }
  };

  const onResetPassword = async (data) => {
    try {
      const response = await fetch('http://localhost:3001/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, newPassword: data.newPassword }),
      });

      if (response.ok) {
        toast({
          title: "Password reset",
          description: "Your password has been reset successfully.",
        });
        setIsResetDialogOpen(false);
        resetForm.reset();
      } else {
        throw new Error('Failed to reset password');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto mb-4">
      <Card>
        <CardHeader>
          <CardTitle className>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and set email preferences.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      This is your public display name. It can be your real name or a pseudonym.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormDescription>
                      You can manage verified email addresses in your email settings.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription>
                      Write a short bio about yourself. Max 160 characters.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Save changes</Button>
            </form>
          </Form>
        </CardContent>
        {/* <Separator className="my-4" /> */}
        <CardFooter className="flex justify-between">
          <div>
            <CardDescription>
              User ID: {user.id}
            </CardDescription>
            <CardDescription>
              Role: {user.role}
            </CardDescription>
          </div>
          <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Reset Password</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Reset Password</DialogTitle>
                <DialogDescription>
                  Enter your new password below. After resetting your password, you'll be logged out.
                </DialogDescription>
              </DialogHeader>
              <Form {...resetForm}>
                <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                  <FormField
                    control={resetForm.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={resetForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <Input {...field} type="password" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Reset Password</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Settings;
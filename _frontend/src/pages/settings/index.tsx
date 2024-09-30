import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, removeUserInfo } from "@/store/slice/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, Lock, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";

const passwordSchema = z
    .object({
      currentPassword: z.string().min(1, "Current password is required"),
      newPassword: z
          .string()
          .min(8, "New password must be at least 8 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

const UserSettingsPage = () => {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetPasswordForm,
  } = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const handleResetPassword = async (data) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    if (!token) {
      toast({
        title: "Error",
        description: "You are not authenticated. Please log in again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
          `${import.meta.env.VITE_API_URL}/change-password`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              email: user.email,
              currentPassword: data.currentPassword,
              newPassword: data.newPassword,
            }),
          }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to change password");
      }

      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });

      resetPasswordForm();
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      // Implement actual account deletion logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call

      toast({
        title: "Account Deleted",
        description: "Your account has been successfully deleted.",
        variant: "default",
      });
      dispatch(removeUserInfo());
      navigate("/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="bg-background min-h-screen">
        <div className="container ">
          <div className="flex flex-row justify-between items-center border-b border-lightborder py-4">
            <h1 className="text-3xl font-bold text-lighth1">Settings</h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lighth1">User Information</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage src={user.avatarUrl} alt={user.username}/>
                  <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-semibold text-lighth1 mb-1">{user.username}</h2>
                <p className="text-sm text-lighth2 dark:text-foreground mb-4">{user.email}</p>
              </CardContent>
              <CardFooter className="flex justify-center">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" className="text-lighth2 dark:text-foreground hover:text-red-600 transition-colors">
                      <Trash2 className="mr-2 h-4 w-4"/>
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your account and remove your data
                        from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDeleteAccount}
                                         className="bg-red-600 hover:bg-red-700 text-white">
                        Delete Account
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lighth1 ">Change Password</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-lighth1">Current Password</Label>
                    <div className="relative">
                      <Input
                          id="currentPassword"
                          type="password"
                          {...register("currentPassword")}
                          placeholder="Enter your current password"
                          className="border-lightborder placeholder-lighth2 pl-10 dark:placeholder-foreground text-sm"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lighth2 dark:text-foreground"/>
                    </div>
                    {errors.currentPassword && (
                        <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-lighth1">New Password</Label>
                    <div className="relative">
                      <Input
                          id="newPassword"
                          type="password"
                          {...register("newPassword")}
                          placeholder="Enter a new password"
                          className="border-lightborder placeholder-lighth2 pl-10 dark:placeholder-foreground text-sm"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lighth2 dark:text-foreground"/>
                    </div>
                    {errors.newPassword && (
                        <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-lighth1">Confirm New Password</Label>
                    <div className="relative">
                      <Input
                          id="confirmPassword"
                          type="password"
                          {...register("confirmPassword")}
                          placeholder="Confirm your new password"
                          className="border-lightborder placeholder-lighth2 pl-10 dark:placeholder-foreground text-sm"
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-lighth2 dark:text-foreground"/>
                    </div>
                    {errors.confirmPassword && (
                        <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full">
                    {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                          Updating...
                        </>
                    ) : (
                        "Update Password"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
  );
};

export default UserSettingsPage;
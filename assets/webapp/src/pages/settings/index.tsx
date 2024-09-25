// UserSettingsPage.tsx
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectUser, removeUserInfo } from "@/store/slice/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { DataTable } from "@/pages/administrator/components/data-table.tsx";
import { columns } from "@/pages/administrator/components/columns.tsx";

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
    const token = localStorage.getItem("token"); // Get the token from localStorage or Redux

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
            Authorization: `Bearer ${token}`, // Add the token in the header
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
        title: "Password updated successfully",
        description: "Your password has been updated.",
      });

      resetPasswordForm(); // Reset the form after successful submission
    } catch (error) {
      toast({
        title: "Error",
        description:
          error.message || "Failed to update password. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className=" bg-[#fafafa] dark:bg-[#09090b] min-h-screen">
      <div className="container ">
        <div className="flex justify-between items-center overflow-hidden py-6 border-b border-gray-200 dark:border-[#333333]">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            Settings
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(handleResetPassword)}
          className="space-y-4 mt-4"
        >
          <div className="flex items-center space-x-4 ">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user.avatarUrl} alt={user.username} />
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-xl font-semibold text-black dark:text-white">
                {user.username}
              </h2>
              <p className="text-sm text-black dark:text-white/50">
                {user.email}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              placeholder="Enter your current password"
              className={
                "dark:border-white/20 dark:placeholder-white/50 placeholder-black/50"
              }
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">
                {errors.currentPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              placeholder="Enter a new password"
              className={
                "dark:border-white/20 dark:placeholder-white/50 placeholder-black/50"
              }
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              placeholder="Confirm your new password"
              className={
                "dark:border-white/20 dark:placeholder-white/50 placeholder-black/50"
              }
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default UserSettingsPage;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "@/store/slice/auth";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from '@/components/ui/dialog';
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { setBreadCrumb } from "@/store/slice/app";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";

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
                {title: "Dashboard", link: "/dashboard"},
                {title: "Settings", link: "/settings"},
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
            const response = await fetch(`http://10.1.10.248:3001/users/${user.id}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
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
            const response = await fetch('http://10.1.10.248:3001/reset-password', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({userId: user.id, newPassword: data.newPassword}),
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
        <div className="container mx-auto py-10 ">
       
            <Card className="p-6 rounded-lg bg-outline dark:bg-[#0a0a0a] bg-[#FFFFF] border border-sm dark:border-[#282828]">

                
                <CardContent className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 pb-6">Your Profile</h3>

                    <div className="flex items-center space-x-4 mb-6">
                        
                        <Avatar className="p-6 rounded-lg bg-outline dark:bg-[#0a0a0a] bg-[#FFFFF] border border-sm dark:border-[#282828]">
                            <AvatarImage src={user.avatarUrl} alt={user.username}/>
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-2xl font-semibold text-black dark:text-white">{user.username}</h2>
                            <p className="text-sm text-black dark:text-white/50">[{user.role}] {user.email}</p>
                        </div>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-[#282828] dark:text-white/50">Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} className=" rounded-lg bg-outline dark:bg-[#0a0a0a] bg-[#FFFFF] border border-sm dark:border-[#282828]" />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 dark:text-white/50">
                                            This is your public display name.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-[#282828] dark:text-white/50">Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email" className=" rounded-lg bg-outline dark:bg-[#0a0a0a] bg-[#FFFFF] border border-sm dark:border-[#282828]"  />
                                        </FormControl>
                                        <FormDescription className="text-gray-500 dark:text-white/50">
                                            Your primary email address.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                    <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white mr-2">Save changes</Button>
                             <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="rounded-lg bg-outline dark:bg-[#000] bg-[#FFFFF] border border-sm dark:border-[#282828] mr-2">Reset Password</Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-lg bg-outline dark:bg-[#000] bg-[#FFFFF] border border-sm dark:border-[#282828]">
                                <DialogHeader>
                                    <DialogTitle className="text-gray-900 dark:text-gray-100">Reset Password</DialogTitle>
                                    <DialogDescription className="text-gray-500 dark:text-gray-400">
                                        Enter your new password below. After resetting your password, you'll be logged out.
                                    </DialogDescription>
                                </DialogHeader>
                                <Form {...resetForm}>
                                    <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                                        <FormField
                                            control={resetForm.control}
                                            name="newPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 dark:text-white">New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" className="rounded-lg bg-outline dark:bg-[#000] bg-[#FFFFF] border border-sm dark:border-[#282828] " />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={resetForm.control}
                                            name="confirmPassword"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-gray-700 dark:text-white">Confirm New Password</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} type="password" className="rounded-lg bg-outline dark:bg-[#000] bg-[#FFFFF] border border-sm dark:border-[#282828]" />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <DialogFooter>
                                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">Reset Password</Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    
                        </form>
                    </Form>
               
                </CardContent>
            </Card>
        </div>
    );
};

export default Settings;
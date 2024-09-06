// @ts-nocheck


import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectUser, saveUserInfo, removeUserInfo } from '@/store/slice/auth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import {LogOut, Key, User, Mail, FileText, Plus} from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const settingsSchema = z.object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    bio: z.string().max(160, 'Bio must not exceed 160 characters').optional(),
});

const passwordSchema = z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(8, 'New password must be at least 8 characters'),
    confirmPassword: z.string(),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

const UserSettingsPage = () => {
    const user = useSelector(selectUser);
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Setup useNavigate
    const [isLoading, setIsLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [role, setRole] = useState('');

    useEffect(() => {
        if (user && user.id) {
            setUserId(user.id);
        } else if (user && user.uuid) {
            setUserId(user.uuid);
        } else {
            toast({
                title: 'Error',
                description: 'User information is missing. Please try logging in again.',
                variant: 'destructive',
            });
        }
    }, [user]);

    const {
        register: registerSettings,
        handleSubmit: handleSettingsSubmit,
        formState: { errors: settingsErrors },
    } = useForm({
        resolver: zodResolver(settingsSchema),
        defaultValues: {
            username: user?.username || '',
            email: user?.email || '',
            bio: user?.bio || '',
        },
    });


    const {
        register: registerPassword,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm({
        resolver: zodResolver(passwordSchema),
    });

    const onSettingsSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (!userId) {
                throw new Error('User ID is not available');
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify(data),
            });

            let updatedUser;
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                updatedUser = await response.json();
            } else {
                const text = await response.text();
                if (response.ok) {
                    updatedUser = { ...user, ...data };
                } else {
                    throw new Error(text || 'Failed to update user information');
                }
            }

            if (!response.ok) {
                throw new Error(updatedUser.message || 'Failed to update user information');
            }

            dispatch(saveUserInfo({ token: user.token, user: { ...user, ...updatedUser } }));
            toast({
                title: 'Settings updated',
                description: 'Your profile has been successfully updated.',
            });
        } catch (error) {
            console.error('Error updating settings:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update settings. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };


    const onPasswordSubmit = async (data) => {
        setIsLoading(true);
        try {
            if (!userId) {
                throw new Error('User ID is not available');
            }

            const response = await fetch(`${import.meta.env.VITE_API_URL}/reset-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`,
                },
                body: JSON.stringify({ userId: userId, newPassword: data.newPassword }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update password');
            }

            toast({
                title: 'Password updated',
                description: 'Your password has been successfully changed.',
            });
            resetPasswordForm();
        } catch (error) {
            console.error('Error updating password:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to update password. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        dispatch(removeUserInfo());
        navigate('/auth/sign-in'); // Redirect to sign-in after logout
    };

    if (!user) {
        return <div>Loading user information...</div>;
    }

    return (
        <div className=" bg-[#fafafa] dark:bg-black flex justify-center ">


            <div className="container bg-white dark:bg-black pb-16">
                <div
                    className="flex justify-between items-center overflow-hidden py-6 border-b border-gray-200 dark:border-[#333333]">
                    <h1 className="text-3xl font-bold text-black dark:text-white">Settings</h1>

                </div>

                <div className="py-8 ">
                    <div className="flex items-center space-x-4 mb-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={user.avatarUrl} alt={user.username}/>
                            <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-semibold text-black dark:text-white">{user.username}</h2>
                            <p className="text-sm text-black dark:text-white/50">{user.email}</p>
                        </div>
                    </div>

                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 bg-gray-100 rounded-md p-1">
                            <TabsTrigger value="profile"
                                         className="text-sm font-medium text-black/50 dark:text-white/50">Profile</TabsTrigger>
                            <TabsTrigger value="security"
                                         className="text-sm font-medium text-black/50 dark:text-white/50">Security</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile">
                            <form onSubmit={handleSettingsSubmit(onSettingsSubmit)} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username"
                                           className="text-sm font-medium text-black/50 dark:text-white/50">Username</Label>
                                    <div className="relative">

                                        <Input
                                            id="username"
                                            {...registerSettings('username')}
                                            className="dark:bg-white/10 bg-white border-gray-300 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    {settingsErrors.username &&
                                        <p className="text-red-500 text-sm">{settingsErrors.username.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email"
                                           className="text-sm font-medium text-black/50 dark:text-white/50">Email</Label>
                                    <div className="relative">

                                        <Input
                                            id="email"
                                            type="email"
                                            {...registerSettings('email')}
                                            className="dark:bg-white/10 bg-white border-gray-300 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    {settingsErrors.email &&
                                        <p className="text-red-500 text-sm">{settingsErrors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bio"
                                           className="text-sm font-medium text-black/50 dark:text-white/50">Bio</Label>
                                    <div className="relative">

                                        <Textarea
                                            id="bio"
                                            {...registerSettings('bio')}
                                            className="dark:bg-white/10 bg-white border-gray-300 dark:border-white/10 focus:border-blue-500 focus:ring-blue-500"
                                            rows={4}
                                        />
                                    </div>
                                    {settingsErrors.bio &&
                                        <p className="text-red-500 text-sm">{settingsErrors.bio.message}</p>}
                                </div>

                            </form>
                        </TabsContent>
                        <TabsContent value="security">
                            <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4 mt-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currentPassword" className="text-sm font-medium text-black dark:text-white">Current
                                        Password</Label>
                                    <div className="relative">


                                        <Input
                                            id="currentPassword"
                                            type="password"
                                            {...registerPassword('currentPassword')}
                                            className="border-black/20  dark:border-white/20 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    {passwordErrors.currentPassword &&
                                        <p className="text-red-500 text-sm">{passwordErrors.currentPassword.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="newPassword" className="text-sm font-medium dark:text-white text-black">New
                                        Password</Label>
                                    <div className="relative">

                                        <Input
                                            id="newPassword"
                                            type="password"
                                            {...registerPassword('newPassword')}
                                            className="border-black/20 dark:border-white/20 focus:border-blue-500 focus:ring-blue-500"
                                        />
                                    </div>
                                    {passwordErrors.newPassword &&
                                        <p className="text-red-500 text-sm">{passwordErrors.newPassword.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-sm font-medium dark:text-white text-black">Confirm
                                        New Password</Label>
                                    <div className="relative">

                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            {...registerPassword('confirmPassword')}
                                            className="border-black/20 dark:border-white/20"
                                        />
                                    </div>
                                    {passwordErrors.confirmPassword &&
                                        <p className="text-red-500 text-sm">{passwordErrors.confirmPassword.message}</p>}
                                </div>
                                <Button type="submit" disabled={isLoading}
                                        className="w-full bg-black dark:bg-white text-white">
                                    {isLoading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>

                    {/*<div className="mt-6">*/}
                    {/*    <Button*/}
                    {/*        variant="destructive"*/}
                    {/*        className="w-full hover:bg-red-700 text-white"*/}
                    {/*        onClick={handleLogout}*/}
                    {/*    >*/}
                    {/*        <LogOut className="mr-2 h-4 w-4"/>*/}
                    {/*        Log out*/}
                    {/*    </Button>*/}
                    {/*</div>*/}

        </div>
</div></div>
)
    ;
};

export default UserSettingsPage;
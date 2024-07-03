import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import {selectUser} from "@/store/slice/auth"; // Ensure the path is correct
import {Button} from "@/components/ui/button";
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {Dialog, DialogClose, DialogContent, DialogTrigger} from '@/components/ui/dialog';
import {DialogTitle} from "@radix-ui/react-dialog";


const TestSettingsSchema = z.object({
    title: z.string().nonempty("Title is required"),
    author: z.string().nonempty("Author is required"),
    DUT: z.string().nonempty("DUT is required"),
    status: z.string().nonempty("Status is required"),
    duration: z.string().nonempty("Duration is required"),
    user_id: z.string().nonempty("user_id is required"),
});
type TestSettingsFormValues = z.infer<typeof TestSettingsSchema>;


const Settings: React.FC = () => {
    const user = useSelector(selectUser);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const form = useForm<TestSettingsFormValues>({
        resolver: zodResolver(TestSettingsSchema),
        defaultValues: {
            username: user.username,
            email: user.email,
            uuid: user.uuid,
            bio: user.bio,
            role: user.role,
        },
    });

    useEffect(() => {
        console.log("User information:", user);
    }, [user]);

    const onSubmit = async (data: TestSettingsFormValues) => {
        console.log("Form data submitted:", data);
    }


    return (
        <div className="container mx-auto p-6">
            <div className="text-2xl font-semibold mb-4">Account Settings</div>
            <div className="border-b border-black/20 dark:border-white/20 mb-6"/>

            <div className=" ">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormDescription>Your public-facing alias. Use your username to send and receive
                                        tests.</FormDescription>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormDescription>Submit a support ticket to change this.</FormDescription>
                                    <FormControl>
                                        <Input placeholder={user.email} {...field} disabled/>
                                    </FormControl>

                                    <FormMessage/>
                                </FormItem>
                            )}
                        />


                        <Dialog>
                            <DialogTrigger asChild>
                                <Button type="primary" onClick={() => setIsDialogOpen(true)}>Change password</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle className="text-lg font-semibold">Change Your Password</DialogTitle>
                                <form onSubmit={(e) => {
                                    e.preventDefault();
                                    const formData = new FormData(e.target);
                                    const currentPassword = formData.get('currentPassword');
                                    const newPassword = formData.get('newPassword');
                                    const confirmPassword = formData.get('confirmPassword');
                                    if (newPassword === confirmPassword) {
                                        console.log("New Password Set:", newPassword);
                                        setIsDialogOpen(false);  // Close the dialog
                                    } else {
                                        console.log("Passwords do not match.");
                                    }
                                }}>
                                    <Input type="password" name="currentPassword" placeholder="Current Password"
                                           required className="mb-2"/>
                                    <Input type="password" name="newPassword" placeholder="New Password" required
                                           className="mb-2"/>
                                    <Input type="password" name="confirmPassword" placeholder="Confirm New Password"
                                           required className="mb-6"/>
                                    <Button type="submit">Save and Close</Button>
                                    <DialogClose asChild>
                                        <Button variant="ghost" className="mx-3">Cancel</Button>
                                    </DialogClose>
                                </form>
                            </DialogContent>
                            <FormDescription>UUID: {user.uuid} <br/>Role: {user.role}</FormDescription>

                        </Dialog>


                        <div className="flex justify-end">
                            <Button type="submit">Save </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    );
};

export default Settings;

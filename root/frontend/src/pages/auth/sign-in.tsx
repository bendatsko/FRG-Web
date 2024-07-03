import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ReloadIcon} from "@radix-ui/react-icons";
import {ErrorMessage, Form, Formik} from "formik";
import {signInSchema} from "@/services/schemas";
import {useSignInMutation} from "@/store/api/v1/endpoints/auth";
import {useNavigate} from "react-router-dom";
import {useToast} from "@/components/ui/use-toast";
import {useDispatch} from "react-redux";
import {saveUserInfo} from "@/store/slice/auth";
import {InputPassword} from "@/components";
import {SignInType} from "@/types";
import Logo from "./components/logo";
import MobileLogo from "./components/mobile-logo";

const SignIn: React.FC = () => {
    const [signIn] = useSignInMutation();
    const navigate = useNavigate();
    const {toast} = useToast();
    const dispatch = useDispatch();

    // Initial form values
    const initialFormValues: SignInType = {
        email: "john@example.com",
        password: "123",
    };

    // Handle form submission
    const handleSubmit = async (values: SignInType, actions: any) => {
        try {
            const result = await signIn(values).unwrap();
            const userInfo = {
                email: result.user.email,
                username: result.user.username,
                role: result.user.role,
                uuid: result.user.uuid,
                bio: result.user.bio,
            };

            // Ensure the full payload is dispatched
            dispatch(
                saveUserInfo({
                    token: result.access_token,
                    user: userInfo,
                })
            );

            console.log("Component: User information to be saved:", userInfo);

            actions.resetForm();
            navigate("/settings"); // Navigate to settings page
        } catch (err) {
            toast({
                duration: 1000,
                variant: "destructive",
                title: "Error",
                description: "Authentication failed.",
            });
        }
    };

    return (
        <div className="w-screen h-screen flex flex-col lg:flex-row gap-5 lg:gap-0 justify-center items-center">
            <Logo/>
            <div
                className="lg:basis-1/2 dark:bg-white dark:text-dark flex flex-col justify-center lg:flex-row items-center h-screen">
                <div className="lg:w-7/12 w-screen px-12 lg:mt-0 lg:px-0 mx-auto">
                    <MobileLogo/>
                    <br/>
                    <div className="text-2xl mb-4">Sign In</div>
                    <Formik
                        initialValues={initialFormValues}
                        validationSchema={signInSchema}
                        onSubmit={handleSubmit}
                    >
                        {({values, handleBlur, handleChange, isSubmitting}) => (
                            <Form className="flex flex-col gap-3">
                                <div className="flex flex-col gap-2">
                                    <Label htmlFor="email">Email Address</Label>
                                    <Input
                                        className="dark:border-black/20"
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={values.email}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage
                                        name="email"
                                        component="div"
                                        className="text-sm text-danger"
                                    />
                                </div>

                                <div className=" flex flex-col gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <InputPassword
                                        className="dark:border-black/20"
                                        name="password"
                                        id="password"
                                        value={values.password}
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-sm text-danger"
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="default"
                                    disabled={isSubmitting}
                                    className="w-full dark:bg-black dark:text-slate-50 dark:shadow dark:hover:bg-black/90"
                                >
                                    {isSubmitting && (
                                        <ReloadIcon className="mr-2 h-4 w-4 animate-spin"/>
                                    )}
                                    Sign In
                                </Button>
                            </Form>
                        )}
                    </Formik>
                </div>
            </div>
        </div>
    );
};

export default SignIn;

import React from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {ReloadIcon} from "@radix-ui/react-icons";
import {ErrorMessage, Form, Formik} from "formik";
import {signInSchema} from "@/services/schemas";
import {useSignInMutation} from '@/store/api/v1/endpoints/auth';
import {useNavigate} from "react-router-dom";
import {useToast} from "@/components/ui/use-toast";
import {useDispatch} from "react-redux";
import {saveUserInfo} from "@/store/slice/auth";
import {InputPassword} from "@/components";
import {SignInType} from "@/types";
import Logo from "./components/logo";
import MobileLogo from "./components/mobile-logo";

const initialFormValues: SignInType = {
    email: "",
    password: "",
};

const SignIn: React.FC = () => {
    const [signIn] = useSignInMutation();
    const navigate = useNavigate();
    const {toast} = useToast();
    const dispatch = useDispatch();

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

            dispatch(saveUserInfo({token: result.access_token, user: userInfo}));
            console.log("Component: User information to be saved:", userInfo);

            actions.resetForm();
            navigate("/settings");
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
            <SignInForm onSubmit={handleSubmit}/>
        </div>
    );
};

const SignInForm: React.FC<{ onSubmit: (values: SignInType, actions: any) => Promise<void> }> = ({onSubmit}) => (
    <div
        className="lg:basis-1/2 dark:bg-white dark:text-dark flex flex-col justify-center lg:flex-row items-center h-screen">
        <div className="lg:w-7/12 w-screen px-12 lg:mt-0 lg:px-0 mx-auto">
            <MobileLogo/>
            <br/>
            <div className="text-2xl mb-4">Sign In</div>
            <Formik
                initialValues={initialFormValues}
                validationSchema={signInSchema}
                onSubmit={onSubmit}
            >
                {({values, handleBlur, handleChange, isSubmitting}) => (
                    <Form className="flex flex-col gap-3">
                        <FormField
                            label="Email Address"
                            name="email"
                            type="email"
                            value={values.email}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        <FormField
                            label="Password"
                            name="password"
                            type="password"
                            value={values.password}
                            onBlur={handleBlur}
                            onChange={handleChange}
                        />
                        <SubmitButton isSubmitting={isSubmitting}/>
                    </Form>
                )}
            </Formik>
        </div>
    </div>
);

const FormField: React.FC<{
    label: string;
    name: string;
    type: string;
    value: string;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({label, name, type, value, onBlur, onChange}) => (
    <div className="flex flex-col gap-2">
        <Label htmlFor={name}>{label}</Label>
        {type === "password" ? (
            <InputPassword
                className="dark:border-black/20"
                name={name}
                id={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
            />
        ) : (
            <Input
                className="dark:border-black/20"
                type={type}
                name={name}
                id={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
            />
        )}
        <ErrorMessage
            name={name}
            component="div"
            className="text-sm text-danger"
        />
    </div>
);

const SubmitButton: React.FC<{ isSubmitting: boolean }> = ({isSubmitting}) => (
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
);

export default SignIn;
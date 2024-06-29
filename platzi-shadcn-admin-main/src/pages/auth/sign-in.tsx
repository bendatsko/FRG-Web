// src/pages/sign-in.tsx
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReloadIcon } from "@radix-ui/react-icons";
import { Formik, Form, ErrorMessage } from "formik";
import { signInSchema } from "@/services/schemas";
import { useSignInMutation } from "@/store/api/v1/endpoints/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "@/store/slice/auth";
import { InputPassword } from "@/components";
import { SignInType } from "@/types";
import Logo from "./components/logo";
import MobileLogo from "./components/mobile-logo";
import { useTheme } from "@/services/providers/theme-provider";

const SignIn: React.FC = () => {
  const { theme } = "dark";
  const [signIn, { data, isSuccess, isError, error }] = useSignInMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();

  const initialValues: SignInType = {
    email: "",
    password: "",
  };

  const handleSubmit = async (values: SignInType, actions: any) => {
    console.log("Submitting form with values:", values);
    try {
      const result = await signIn(values).unwrap();
      console.log("Login successful, result from server:", result);

      const userInfo = {
        email: result.user.email,
        username: result.user.username,
        role: result.user.role,
      };

      dispatch(
        saveUserInfo({
          token: result.access_token,
          user: userInfo,
        })
      );

      console.log("Dispatched saveUserInfo action with:", {
        token: result.access_token,
        user: userInfo,
      });

      actions.resetForm();
      navigate("/settings"); // Ensure you navigate to settings after login
    } catch (err) {
      console.error("Authentication failed", err);
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error",
        description: "Authentication failed.",
      });
    }
  };

  useEffect(() => {
    if (isSuccess) {
      toast({
        duration: 1000,
        variant: "default",
        title: "Success",
        description: "Login successful.",
      });
    }
    if (isError && error) {
      toast({
        duration: 1000,
        variant: "destructive",
        title: "Error",
        description: "Authentication failed.",
      });
    }
  }, [isSuccess, isError, error, toast]);

  return (
    <div className="w-screen h-screen flex flex-col lg:flex-row gap-5 lg:gap-0 justify-center items-center">
      <Logo />
      <div className="lg:basis-1/2 dark:bg-black dark:text-light flex flex-col justify-center lg:flex-row items-center h-screen">
        <div className="lg:w-7/12 w-screen px-12 lg:mt-0 lg:px-0 mx-auto">
          <MobileLogo />
          <br />
          <div className="text-2xl mb-4">Sign In</div>
          <Formik
            initialValues={initialValues}
            validationSchema={signInSchema}
            onSubmit={handleSubmit}
          >
            {({ values, handleBlur, handleChange, isSubmitting }) => (
              <Form className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    className="border-black/20 border-black/20"
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="john@example.com"
                  />
                  <ErrorMessage
                    name="email"
                    component={"div"}
                    className="text-sm text-danger"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <InputPassword
                    className="border-black/20 border-black/20"
                    width="100%"
                    name="password"
                    id="password"
                    value={values.password}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="****"
                  />
                  <ErrorMessage
                    name="password"
                    component={"div"}
                    className="text-sm text-danger"
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting && (
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
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

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage, Form, Formik } from "formik";
import { signInSchema } from "@/services/schemas";
import { useSignInMutation } from "@/store/api/v1/endpoints/auth";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useDispatch } from "react-redux";
import { saveUserInfo } from "@/store/slice/auth";
import { SignInType } from "@/types";
import LogoBlack from "@/components/common/logoblackfull.png";
import LogoWhite from "@/components/common/logowhitefull.png";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const initialFormValues: SignInType = {
  email: "",
  password: "",
};

const Login: React.FC = () => {
  const [signIn] = useSignInMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const [emailForReset, setEmailForReset] = useState("");
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

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

      localStorage.setItem("token", result.access_token);
      dispatch(saveUserInfo({ token: result.access_token, user: userInfo }));
      actions.resetForm();
      navigate("/dashboard");
    } catch (err) {
      toast({
        duration: 3000,
        variant: "destructive",
        title: "Error",
        description: "Authentication failed. Please check your credentials and try again.",
      });
    }
  };

  const handlePasswordResetRequest = async () => {
    if (!emailForReset) {
      toast({
        title: "Error",
        description: "Please enter your email to reset your password.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`https://daqroc-api.bendatsko.com/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailForReset }),
      });

      if (response.ok) {
        toast({
          title: "Password Reset",
          description: "A temporary password has been sent to your email.",
          variant: "default",
        });
        setResetDialogOpen(false);
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.error || "Failed to reset password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while sending the reset email.",
        variant: "destructive",
      });
    }
  };

  return (
      <div className="flex min-h-screen bg-white dark:bg-black text-black dark:text-white items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-lg transition-all duration-300 ease-in-out">
          <div className="flex justify-center mb-8">
            <img
                src={LogoBlack}
                alt="Logo"
                className="w-48 object-contain dark:hidden"
            />
            <img
                src={LogoWhite}
                alt="Logo"
                className="w-48 object-contain hidden dark:block"
            />
          </div>
          <Formik
              initialValues={initialFormValues}
              validationSchema={signInSchema}
              onSubmit={handleSubmit}
          >
            {({ values, handleBlur, handleChange, isSubmitting }) => (
                <Form className="space-y-6">
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
                  <div className="transition-transform duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98]">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-black text-white dark:bg-white dark:text-black hover:bg-black/90 dark:hover:bg-white/90 transition-colors duration-200"
                    >
                      {isSubmitting ? "Signing In..." : "Sign In"}
                    </Button>
                  </div>
                </Form>
            )}
          </Formik>

          <div className="mt-4 text-center">
            <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
              <DialogTrigger asChild>
                <button
                    type="button"
                    className="text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white text-sm transition-colors duration-200"
                >
                  Forgot Password?
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="resetEmail" className="text-right">
                      Email
                    </Label>
                    <Input
                        id="resetEmail"
                        type="email"
                        className="col-span-3"
                        value={emailForReset}
                        onChange={(e) => setEmailForReset(e.target.value)}
                    />
                  </div>
                </div>
                <Button onClick={handlePasswordResetRequest} className="w-full">
                  Send Reset Email
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
  );
};

const FormField: React.FC<{
  label: string;
  name: string;
  type: string;
  value: string;
  onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ label, name, type, value, onBlur, onChange }) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-sm font-medium">
        {label}
      </Label>
      <Input
          className="bg-transparent border border-black/20 dark:border-white/20 focus:border-black dark:focus:border-white transition-colors duration-200"
          type={type}
          name={name}
          id={name}
          value={value}
          onBlur={onBlur}
          onChange={onChange}
      />
      <ErrorMessage
          name={name}
          component="div"
          className="text-sm text-red-500 dark:text-red-400"
      />
    </div>
);

export default Login;
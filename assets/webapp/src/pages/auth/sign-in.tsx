// @ts-nocheck

import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ErrorMessage, Form, Formik } from 'formik';
import { signInSchema } from '@/services/schemas';
import { useSignInMutation } from '@/store/api/v1/endpoints/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { useDispatch } from 'react-redux';
import { saveUserInfo } from '@/store/slice/auth';
import { InputPassword } from '@/components';
import { SignInType } from '@/types';
import Logo from './components/logo';
import MobileLogo from './components/mobile-logo';
import { useTheme } from 'next-themes';
import {DAQROCLogo} from "@/components/common/DaqrocSquareIcon.tsx";

const initialFormValues: SignInType = {
  email: '',
  password: '',
};




const SignIn: React.FC = () => {
  const [signIn] = useSignInMutation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { theme } = useTheme();


  // New function for auto-login
  const autoLogin = async () => {
    const demoCredentials = {
      email: 'user@umich.edu',
      password: 'password123'
    };
    toast({
      title: "Auto Login",
      description: "You've been logged in automatically.",
      variant: "",
      duration: 5000,
    });


    await handleSubmit(demoCredentials, { resetForm: () => {} });
  };

// Use useEffect to trigger auto-login when component mounts
  // useEffect(() => {
  //   autoLogin();
  // }, []);



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

      dispatch(saveUserInfo({ token: result.access_token, user: userInfo }));
      actions.resetForm();
      navigate('/dashboard');
    } catch (err) {
      toast({
        duration: 3000,
        variant: 'destructive',
        title: 'Error',
        description: 'Authentication failed. Please check your credentials and try again.',
      });
    }
  };

  return (
      <div className={`flex min-h-screen bg-white text-black`}>
        <div className="hidden lg:flex lg:w-1/2 bg-black items-center justify-center">
          <Logo />
        </div>
        <div className="w-full lg:w-1/2 flex flex-col justify-center items-center">
          <div className="lg:hidden ">
            {/*<MobileLogo />*/}
            <div className="lg:hidden basis-1/2 flex flex-col justify-center items-center">
              <div className="flex items-center justify-center ">
                <DAQROCLogo
                    className="text-[90px] lg:text-[150px]"
                    height="6rem"
                    width="6rem"
                    overrideColor="dark"
                />
              </div>
            </div>

            <h1 className="text-2xl font-bold text-center">DAQROC</h1>
            <h2 className="text-xs font-normal text-center">Flynn Lab, University of Michigan</h2>

          </div>

          <div className={`w-full max-w-md p-8 rounded-lg bg-white `}>
            <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
            <Formik
                initialValues={initialFormValues}
                validationSchema={signInSchema}
                onSubmit={handleSubmit}
            >
              {({values, handleBlur, handleChange, isSubmitting}) => (
                  <Form className="space-y-6 ">
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
}> = ({ label, name, type, value, onBlur, onChange }) => {
  const { theme } = useTheme();
  return (
      <div className="space-y-2">
        <Label htmlFor={name} className="text-sm font-medium">
          {label}
        </Label>
        {type === 'password' ? (
            <InputPassword
                name={name}
                id={name}
                value={value}
                onBlur={onBlur}
                onChange={onChange}
            />
        ) : (
            <Input
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
            className="text-sm text-red-500"
        />
      </div>
  );
};

const SubmitButton: React.FC<{ isSubmitting: boolean }> = ({ isSubmitting }) => (
    <Button
        type="submit"
        variant="default"
        disabled={isSubmitting}
        className="w-full bg-black dark:bg-black dark:text-white text-white hover:bg-blue-700 transition-colors duration-200"
    >
      {isSubmitting ? (
          <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
      ) : null}
      Sign In
    </Button>
);

export default SignIn;
import React, { useState, useEffect } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { Button } from "@nextui-org/react";
import { useTheme } from 'next-themes';

const SignInButton = () => {
    const { instance } = useMsal();
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        console.log("MSAL Instance: ", instance);
    }, [instance]);

    const handleLogin = async (loginType) => {
        setIsLoading(true);
        try {
            if (loginType === "popup") {
                await instance.loginPopup(loginRequest);
            } else {
                await instance.loginRedirect(loginRequest);
            }
        } catch (e) {
            console.error("Login error:", e);
            setIsLoading(false);
        }
    };

    const getButtonStyles = () => {
        if (!isMounted) {
            return { backgroundColor: 'white', color: 'black' };
        }

        if (resolvedTheme === 'dark') {
            return { backgroundColor: 'white', color: 'black' };
        }
        return { backgroundColor: 'rgba(0, 0, 0, 0.85)', color: 'white' };
    };

    return (
        <Button
            fullWidth
            className={`w-full max-w-xxs ${isLoading ? 'isLoading' : ''}`}
            style={getButtonStyles()}
            onClick={() => handleLogin("redirect")}
            disabled={isLoading}
        >
            {isLoading ? 'Signing in...' : 'Sign in with Azure'}
        </Button>
    );
}

export default SignInButton;

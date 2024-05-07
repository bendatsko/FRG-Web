// index.tsx (IndexPage)


import React, {useEffect, useState} from "react";
import DefaultLayout from "@/layouts/default";
import {Button, Image, Input} from "@nextui-org/react";
import {EyeFilledIcon} from "../components/EyeFilledIcon";
import {EyeSlashFilledIcon} from "../components/EyeSlashFilledIcon";
import {useTheme} from "next-themes";
import {useRouter} from "next/router";
import DarkImg from "@/public/blockm-white.png";
import LightImg from "@/public/blockm-black.png";
import NextLink from "next/link";


export default function IndexPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const {resolvedTheme} = useTheme();


    useEffect(() => {
        setIsMounted(true);
    }, []);


    const toggleVisibility = () => setIsVisible(!isVisible);
    const logoSrc = !isMounted
        ? DarkImg.src
        : resolvedTheme === "dark"
            ? DarkImg.src
            : LightImg.src;


    const handleLogin = () => {
        setIsLoading(true);
        // Simulate authentication process
        if (username === "admin@umich.edu" && password === "password") {
            setErrorMessage("");
            router.push("/home");
        } else {
            setErrorMessage("Invalid username or password.");
            setIsLoading(false);
        }
    };


    const getButtonStyles = () => {
        if (!isMounted) {
            return {backgroundColor: "white", color: "black"}; // Default dark theme style
        }


        if (resolvedTheme === "dark") {
            return {backgroundColor: "white", color: "black"};
        }


        return {backgroundColor: "rgba(0, 0, 0, 0.85)", color: "white"};
    };


    return (
        <DefaultLayout showNavbar={false}>
            <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4">
                {/*<LogoComponent />*/}


                <NextLink
                    className="flex justify-start items-center gap-2"
                    href="/home"
                >
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            paddingRight: ".1rem",
                        }}
                    >
                        <Image
                            src={logoSrc}
                            width={40} // Increase image size
                            height={40}
                            radius="none"
                            alt={`FRG Logo (${resolvedTheme || "default"} Mode)`}
                        />
                    </div>
                    <p className="font-bold text-inherit text-3xl">FLYNN LAB</p>{" "}
                    {/* Adjust font size here */}
                </NextLink>
                <Input
                    isClearable
                    type="email"
                    label="Username"
                    variant="bordered"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onClear={() => setUsername("")}
                    className="w-full max-w-xs"
                />
                <Input
                    label="Password"
                    variant="bordered"
                    placeholder="Password"
                    endContent={
                        <button
                            className="focus:outline-none"
                            type="button"
                            onClick={toggleVisibility}
                        >
                            {isVisible ? (
                                <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                            ) : (
                                <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>
                            )}
                        </button>
                    }
                    type={isVisible ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full max-w-xs"
                />
                {errorMessage && <p className="text-red-600">{errorMessage}</p>}
                <Button
                    fullWidth
                    className={`w-full max-w-xs ${isLoading ? "isLoading" : ""}`}
                    style={getButtonStyles()}
                    onClick={handleLogin}
                    isLoading={isLoading}
                >
                    {isLoading ? "Signing in..." : "Sign in"}
                </Button>
            </section>
            {/*<div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">*/}
            {/*    <ThemeSwitch/>*/}
            {/*</div>*/}
        </DefaultLayout>
    );
}




import React, {useState} from "react";
import DefaultLayout from "@/layouts/default";
import {Button, Input} from "@nextui-org/react";
import {EyeFilledIcon} from "../components/EyeFilledIcon";
import {EyeSlashFilledIcon} from "../components/EyeSlashFilledIcon";
import {useTheme} from "next-themes";
import {ThemeSwitch} from "@/components/theme-switch";
import Logo from "../components/Logo";
import {useRouter} from "next/router";


export default function IndexPage() {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const {theme} = useTheme();
    const toggleVisibility = () => setIsVisible(!isVisible);

    const handleButtonClick = () => {
        setIsLoading(true);
        router.push("/dashboard");
    };


    return (<DefaultLayout showNavbar={false}>
        <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4">
            <Logo/>
            <Input
                isClearable
                type="email"
                label="Email"
                variant="bordered"
                placeholder="Email"
                defaultValue=""
                onClear={() => console.log("input cleared")}
                className="w-full max-w-xs"
            />
            <Input
                label="Password"
                variant="bordered"
                placeholder="Password"
                endContent={<button
                    className="focus:outline-none"
                    type="button"
                    onClick={toggleVisibility}
                >
                    {isVisible ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none"/>) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none"/>)}
                </button>}
                type={isVisible ? "text" : "password"}
                className="w-full max-w-xs"
            />
            <Button
                fullWidth
                color="primary"
                className={`w-full max-w-xs ${isLoading ? "isLoading" : ""}`}
                onClick={handleButtonClick}
                isLoading={isLoading}
            >

                {isLoading ? "Signing in..." : "Sign in"}
            </Button>
        </section>
        <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
            <ThemeSwitch/>
        </div>

    </DefaultLayout>);
}

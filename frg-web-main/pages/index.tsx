// index.tsx (IndexPage)

import React, { useState } from "react";
import DefaultLayout from "@/layouts/default";
import { Button, Input } from "@nextui-org/react";
import { EyeFilledIcon } from "../components/EyeFilledIcon";
import { EyeSlashFilledIcon } from "../components/EyeSlashFilledIcon";
import { useTheme } from "next-themes";
import { ThemeSwitch } from "@/components/theme-switch";
import LogoComponent from "@/components/LogoComponent";
import { useRouter } from "next/router";




export default function IndexPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    const { resolvedTheme } = useTheme();

    const toggleVisibility = () => setIsVisible(!isVisible);


    const handleLogin = () => {
        setIsLoading(true);
        // Simulate authentication process
        if (username === "admin" && password === "password") {
            setErrorMessage("");
            router.push("/home");
        } else {
            setErrorMessage("Invalid username or password.");
            setIsLoading(false);
        }
    };


    const handleButtonClick = () => {
        setIsLoading(true);
        router.push("/home");
    };

    return (
        <DefaultLayout showNavbar={false}>
      <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4">
        <LogoComponent />
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
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
              )}
            </button>
            }
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full max-w-xs"
        />
          {errorMessage && (
              <p className="text-red-600">{errorMessage}</p>
          )}
          <Button
              fullWidth
              style={{ backgroundColor: "rgba(0, 0, 0, 0.85)", color: "white" }}
              className={`w-full max-w-xs ${isLoading ? "isLoading" : ""}`}
              onClick={handleLogin}
              isLoading={isLoading}
          >
          {isLoading ? "Signing in..." : "Sign in"}
        </Button>
      </section>
      <div className="fixed bottom-4 right-4 md:bottom-8 md:right-8">
        <ThemeSwitch />
      </div>
    </DefaultLayout>
    );
}

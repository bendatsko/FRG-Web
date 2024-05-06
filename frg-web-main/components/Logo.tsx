import { FC, useState, useEffect } from "react";
import { Image } from "@nextui-org/react";
import { useTheme } from "next-themes";
import DarkImg from "../public/frg-logo-black.png";
import LightImg from "../public/frg-logo-white.png";

const LogoComponent: FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    width: "20rem",
                }}
            >
                <Image
                    src="http://localhost:3000/frg-logo-white.png"
                    width={150}
                    height={150}
                    alt="NextUI Album Cover (Default Mode)"
                />
            </div>
        );
    }

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "20rem",
            }}
        >
            {resolvedTheme === "dark" ? (
                <Image
                    src="http://localhost:3000/frg-logo-white.png"
                    width={150}
                    height={150}
                    alt="NextUI Album Cover (Dark Mode)"
                />
            ) : (
                <Image
                    src="http://localhost:3000/frg-logo-black.png"
                    width={150}
                    height={150}
                    alt="NextUI Album Cover (Light Mode)"
                />
            )}
        </div>
    );
};

export default LogoComponent;

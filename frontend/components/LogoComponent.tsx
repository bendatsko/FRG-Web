// components/LogoComponent.tsx

import { FC, useEffect, useState } from "react";
import { Image } from "@nextui-org/react";
import { useTheme } from "next-themes";
import DarkImg from "../public/frg-logo-white.png";
import LightImg from "../public/frg-logo-black.png";

const LogoComponent: FC = () => {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const logoSrc = !isMounted
        ? DarkImg.src // or DarkImg.src as the default
        : resolvedTheme === "dark"
            ? DarkImg.src
            : LightImg.src;

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                width: "20rem",
            }}
        >
      <Image
          src={logoSrc}
          width={100}
          height={100}
          alt={`FRG Logo (${resolvedTheme || "default"} Mode)`}
      />
    </div>
    );
};

export default LogoComponent;

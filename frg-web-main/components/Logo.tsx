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
                    src="https://lh3.googleusercontent.com/pw/AP1GczPneeqbuXK02y0GyANVHn2SD3Rc7MRELcVzLgwqbz50LCLDbVV0_fXhjz7yIE9evCV-ZEyh6jeLwLFmmSTK2SQp6YWYb8ybmSPAq7KhJnz2rA1U8EpmqRdIq38SdTC_RYi-ZI_MZ1W-Jhz85Bioyide=w1347-h1508-s-no-gm?authuser=0"
                    width={150}
                    height={150}
                    alt="NextUI Album Cover (Dark Mode)"
                />
            ) : (
                <Image
                    src="https://lh3.googleusercontent.com/pw/AP1GczNIT0H6h6wP04N1QdAuvoeqwRs5YdVovGDWmpC8JOP_2rPLJqLCLvCYIRIaENB5m2iOX4IlDiQvCr9Qn_t23ZNx3bv8Dvu5Kgj6EP_Io7_3zuNYCvQOhOrdJI0RjG25rkfNXpwe1_taKsjHgTv1UsBY=w1347-h1508-s-no-gm?authuser=0"
                    width={150}
                    height={150}
                    alt="NextUI Album Cover (Light Mode)"
                />
            )}
        </div>
    );
};

export default LogoComponent;

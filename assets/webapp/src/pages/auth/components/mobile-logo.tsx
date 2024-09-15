import React from "react";
import { DAQROCLogo } from "@/components/common/DaqrocSquareIcon.tsx";
import { useTheme } from "@/services/providers/theme-provider.tsx";

const MobileLogo: React.FC = () => {
    const { theme } = useTheme();

    return (
        <div className="lg:hidden basis-1/2 flex flex-col justify-center items-center">
            <div className="flex items-center justify-center ">
                <DAQROCLogo
                    className="text-[90px] lg:text-[150px]"
                    height="6rem"
                    width="6rem"
                    overrideColor={theme as "light" | "dark"}
                />
            </div>
        </div>
    );
};

export default MobileLogo;
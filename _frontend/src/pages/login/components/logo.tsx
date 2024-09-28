import React from "react";
import { DAQROCLogo } from "@/components/common/DaqrocSquareIcon.tsx";

const Logo: React.FC = () => {
  return (
    <div className=" hidden lg:basis-1/2 bg-dark lg:h-full lg:flex flex-col justify-center items-center ">
      <div>
          <DAQROCLogo
            className=" text-light text-[90px] lg:text-[150px] "
            height="12rem"
            width="12rem"
            overrideColor="white"
          />
      </div>
      <div className="text-light text-center ">
        <div className="text-3xl text-white dark:text-white font-semibold">DAQROC</div>
        <div className="text-sm text-white/75 dark:text-white/75 ">
          Flynn Lab, University of Michigan
        </div>
      </div>
    </div>
  );
};

export default Logo;

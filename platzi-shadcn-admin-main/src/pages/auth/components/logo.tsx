import React from "react";
// import { SiPlatzi } from "react-icons/si";
import {DAQROCLogo} from "@/components/common/logo-d.tsx";

import { Plus } from "tabler-icons-react";

const Logo: React.FC = () => {
  return (
    <div className=" hidden lg:basis-1/2 bg-dark lg:h-full lg:flex flex-col justify-center items-center ">
      <div>
        <div className=" flex items-center gap-3 ">
          <DAQROCLogo className=" text-light text-[90px] lg:text-[150px] " height = "12rem"
                      width = "12rem" overrideColor="white"/>
          {/*<Plus size={70} strokeWidth={3} className=" text-light " />*/}
          {/*<svg*/}
          {/*  xmlns="http://www.w3.org/2000/svg"*/}
          {/*  viewBox="0 0 256 256"*/}
          {/*  className=" text-light w-[90px] h-[90px] lg:w-[150px] lg:h-[150px] "*/}
          {/*>*/}
          {/*  <rect width="256" height="256" fill="none"></rect>*/}
          {/*  <line*/}
          {/*    x1="208"*/}
          {/*    y1="128"*/}
          {/*    x2="128"*/}
          {/*    y2="208"*/}
          {/*    fill="none"*/}
          {/*    stroke="currentColor"*/}
          {/*    stroke-linecap="round"*/}
          {/*    stroke-linejoin="round"*/}
          {/*    stroke-width="16"*/}
          {/*  ></line>*/}
          {/*  <line*/}
          {/*    x1="192"*/}
          {/*    y1="40"*/}
          {/*    x2="40"*/}
          {/*    y2="192"*/}
          {/*    fill="none"*/}
          {/*    stroke="currentColor"*/}
          {/*    stroke-linecap="round"*/}
          {/*    stroke-linejoin="round"*/}
          {/*    stroke-width="16"*/}
          {/*  ></line>*/}
          {/*</svg>*/}
        </div>
      </div>
      <div className=" text-light text-center mt-8 ">
          <div className="text-2xl font-semibold mb-4">DAQROC</div>

          {/*<div className=" lg:text-xl ">DAQROC - Flynn Lab</div>*/}
        <div className="text-sm text-white/50 mt-3 ">
          Flynn Lab, University of Michigan
        </div>
      </div>
    </div>
  );
};

export default Logo;

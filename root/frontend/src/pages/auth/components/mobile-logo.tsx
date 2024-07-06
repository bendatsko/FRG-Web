import React from "react";
import {DAQROCLogo} from "@/components/common/DaqrocSquareIcon.tsx";

const MobileLogo: React.FC = () => {
    return (
        <div className=" lg:hidden basis-1/2 flex-col justify-center items-center ">
            <div>
                <div className=" flex items-center justify-center gap-3 ">
                    <DAQROCLogo
                        className=" text-dark text-[90px] lg:text-[150px] "
                        height="8rem"
                        width="12rem"
                        overrideColor="dark"
                    />
                </div>
            </div>
            <div className=" text-dark text-center mt-8 ">
                {/*<div className=" lg:text-xl ">DAQROC - Flynn Lab</div>*/}
                <div className="text-2xl font-semibold mb-4 text-black">DAQROC</div>
                <div className="text-sm text-black/70 mt-4 ">
                    Flynn Lab, University of Michigan
                </div>
            </div>
        </div>
    );
};

export default MobileLogo;

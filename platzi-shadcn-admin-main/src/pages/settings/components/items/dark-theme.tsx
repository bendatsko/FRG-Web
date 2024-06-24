import React from "react";

const DarkTheme: React.FC = () => {
  return (
    <div className="items-center rounded-md border-2 border-foreground border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground  w-full lg:w-[200px]">
      <div className="space-y-2 rounded-sm bg-gray-950 p-2">
        <div className="space-y-2 rounded-md bg-gray-800 p-2 shadow-sm">
          <div className="h-2 w-[80px] rounded-lg bg-gray-400"></div>
          <div className="h-2 w-[100px] rounded-lg bg-gray-400"></div>
        </div>
        <div className="flex items-center space-x-2 rounded-md  p-2 shadow-sm">
          <div className="h-4 w-4 rounded-full "></div>
          <div className="h-2 w-[100px] rounded-lg bg-gray-400"></div>
        </div>
        <div className="flex items-center space-x-2 rounded-md bg-gray-800 p-2 shadow-sm">
          <div className="h-4 w-4 rounded-full bg-gray-400"></div>
          <div className="h-2 w-[100px] rounded-lg bg-gray-400"></div>
        </div>
      </div>
    </div>
  );
};

export default DarkTheme;

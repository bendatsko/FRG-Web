import React from "react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/services/providers/theme-provider";
import router from "@/router";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';


const App: React.FC = () => {
  return (
    <>
      <ThemeProvider>
        <TooltipProvider>
          <RouterProvider router={router}></RouterProvider>
        </TooltipProvider>
        <Toaster />
      </ThemeProvider>
    </>
  );
};

export default App;

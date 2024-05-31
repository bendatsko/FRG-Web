// contexts/MsalProvider.js
import React, { createContext, useContext } from 'react';
import { MsalProvider as MsalReactProvider } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../pages/authConfig'; // Ensure the correct path

const msalInstance = new PublicClientApplication(msalConfig);

const MsalContext = createContext(msalInstance);

export const useMsalInstance = () => {
    return useContext(MsalContext);
};

// @ts-ignore
export const MsalProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
    return (
        <MsalContext.Provider value={msalInstance}>
            <MsalReactProvider instance={msalInstance}>
                {children}
            </MsalReactProvider>
        </MsalContext.Provider>
    );
};

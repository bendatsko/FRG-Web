import React, { createContext, useContext } from 'react';
import { MsalProvider as MsalReactProvider, useMsal } from '@azure/msal-react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from '../pages/authConfig';

const msalInstance = new PublicClientApplication(msalConfig);

const MsalContext = createContext(msalInstance);

export const useMsalInstance = () => {
  return useContext(MsalContext);
};

export const MsalProvider: React.FC = ({ children }) => {
  return (
    <MsalContext.Provider value={msalInstance}>
      <MsalReactProvider instance={msalInstance}>
        {children}
      </MsalReactProvider>
    </MsalContext.Provider>
  );
};

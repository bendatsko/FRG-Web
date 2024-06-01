// authConfig.js
import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "b1b65f58-fe30-4c6c-9362-7cd76a152e33",
        authority: "https://login.microsoftonline.com/d0d43762-49e6-4326-90ec-01635c1bd3d8",
        redirectUri: "https://68.59.5.5:3000/",
    },
    cache: {
        cacheLocation: "sessionStorage",
        storeAuthStateInCookie: false,
    },
    system: {
        loggerOptions: {
            loggerCallback: (level, message, containsPii) => {
                if (containsPii) {
                    return;
                }
                switch (level) {
                    case LogLevel.Error:
                        console.error(message);
                        return;
                    case LogLevel.Info:
                        console.info(message);
                        return;
                    case LogLevel.Verbose:
                        console.debug(message);
                        return;
                    case LogLevel.Warning:
                        console.warn(message);
                        return;
                    default:
                        return;
                }
            },
            logLevel: LogLevel.Info,
        },
    },
};

export const loginRequest = {
    scopes: ["User.Read"]
};

// Add the graphConfig definition
export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

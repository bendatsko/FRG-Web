import { LogLevel } from "@azure/msal-browser";

export const msalConfig = {
    auth: {
        clientId: "b1b65f58-fe30-4c6c-9362-7cd76a152e33",
        authority: "https://login.microsoftonline.com/d0d43762-49e6-4326-90ec-01635c1bd3d8",
        redirectUri: "http://localhost:3000/",
        postLogoutRedirectUri: "http://localhost:3000/logout-complete" // Ensure this is correctly set
    },
    cache: {
        cacheLocation: "sessionStorage", // This configures where your cache will be stored
        storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
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
            }
        }
    }
};

export const loginRequest = {
    scopes: ["User.Read"]
};

export const graphConfig = {
    graphMeEndpoint: "https://graph.microsoft.com/v1.0/me"
};

import React from "react";
import { useMsal } from "@azure/msal-react";
import {Button} from "@nextui-org/react";

/**
 * Renders a sign-out button
 */
export const SignOutButton = () => {
    const { instance } = useMsal();

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "https://68.59.5.5:3000/",
                mainWindowRedirectUri: "https://68.59.5.5:3000/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "https://68.59.5.5:3000/",
            });
        }
    }

    
    return (
            <Button onClick={() => handleLogout("redirect")}>Sign out using Redirect</Button>
    )
}
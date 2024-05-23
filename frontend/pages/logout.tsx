import React, { useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { useRouter } from 'next/router';
import DefaultLayout from "@/layouts/default";


const Logout = () => {
    const { instance } = useMsal();
    const router = useRouter();

    useEffect(() => {
        const handleLogout = async () => {
            // Clear session storage and cookies
            sessionStorage.clear();
            document.cookie = "yourCookieName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            try {
                // Perform logout
                await instance.logoutRedirect({
                    postLogoutRedirectUri: `${window.location.origin}/logout-complete`,
                });
            } catch (error) {
                console.error('Logout error:', error);
                // Redirect to the home page even if logout fails
                router.push('/');
            }
        };

        handleLogout();
    }, [instance, router]);

    return (
        <DefaultLayout>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Logging out...</p>
            </div>
        </DefaultLayout>
    );
};

export default Logout;

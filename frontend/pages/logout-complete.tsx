import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import DefaultLayout from "@/layouts/default";


// Just to redirect to the home page. Pretty much useless.
const LogoutComplete = () => {
    const router = useRouter();

    useEffect(() => {
        router.push('/');
    }, [router]);

    return (
        <DefaultLayout>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <p>Cleaning up...</p>
            </div>
        </DefaultLayout>
    );
};

export default LogoutComplete;

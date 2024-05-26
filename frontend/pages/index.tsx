import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/layouts/default';
import { Image } from '@nextui-org/react';
import { useTheme } from 'next-themes';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useAccount } from '@azure/msal-react';
import NextLink from 'next/link';
import SignInButton from '../components/SignInButton';
import DarkImg from '@/public/blockm-white.png';
import LightImg from '@/public/blockm-black.png';
import HomePage from "@/pages/home";
import CreatePage from "@/pages/create/ldpc";
import DocsPage from "@/pages/docs";
import Navbar from "@/components/navbar";
import AdminPanel from '@/pages/admin-portal';


//=============================================================
//                         Login Page
//=============================================================
// This is the only publically-available page on our website.
// 0. Set theme, render page.
// 1. Users authenticate with Microsoft Azure Active Directory
// 2. User permissions set using checkperms api (/api/checkperms.js).

export default function IndexPage() {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [currentPage, setCurrentPage] = useState('home');
    const [isAdmin, setIsAdmin] = useState(false);

    // Assign user permissions
    useEffect(() => {
        setIsMounted(true);

        if (account) {
            // Call the API to check if the user is an admin
            fetch('/api/checkperms', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId: account.username }),
            })
                .then(response => response.json())
                .then(data => {
                    setIsAdmin(data.isAdmin);
                })
                .catch(error => {
                    console.error('Error checking admin status:', error);
                });
            console.log("Home account id: " + account.username);
        }
    }, [account]);

    // Set theme to dark or light mode
    const logoSrc = !isMounted
        ? DarkImg.src
        : resolvedTheme === 'dark'
            ? DarkImg.src
            : LightImg.src;

    // Choose page to render
    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'create':
                return isAdmin ? <CreatePage /> : <HomePage />;
            case 'docs':
                return <DocsPage />;
            case 'admin':
                return isAdmin ? <AdminPanel /> : <HomePage />;
            default:
                return <HomePage />;
        }
    };


    // HTML for page layout
    return (
        <DefaultLayout showNavbar={true}>
            <UnauthenticatedTemplate>
                <div className="flex items-start justify-center min-h-screen">
                    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4 w-full max-w-xs mt-16">
                        <NextLink href="">
                            <div style={{ display: 'flex', justifyContent: 'center', paddingRight: '.1rem'}}>
                                <Image src={logoSrc} width={35} height={35} radius="none" alt={`FRG Logo (${resolvedTheme || 'default'} Mode)`}/>
                                <p style={{ paddingLeft: ".5rem" }} className="font-bold text-3xl">DAQROC</p>
                            </div>
                        </NextLink>
                        <SignInButton />
                    </section>
                </div>
            </UnauthenticatedTemplate>
            <AuthenticatedTemplate>
                <section className="flex flex-col items-center min-h-screen py-4">
                    <div className="max-w-[100%] w-full text-center">
                        <Navbar userName={account?.name} email={account?.username} isAdmin={isAdmin} setCurrentPage={setCurrentPage} />
                        {renderPage()}
                    </div>
                </section>
            </AuthenticatedTemplate>
        </DefaultLayout>
    );
}

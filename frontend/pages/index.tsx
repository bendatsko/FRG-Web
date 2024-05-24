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

export default function IndexPage() {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    const [currentPage, setCurrentPage] = useState('home');
    const userRoles = account?.idTokenClaims?.roles || [];  // Assuming roles are stored in an array

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const logoSrc = !isMounted
        ? DarkImg.src
        : resolvedTheme === 'dark'
            ? DarkImg.src
            : LightImg.src;

    const isAdmin = userRoles.includes('is_admin');  // Checking if the user is an admin

    const renderPage = () => {
        switch (currentPage) {
            case 'home':
                return <HomePage />;
            case 'create':
                return isAdmin ? <CreatePage /> : <HomePage />;  // Conditional access based on role
            case 'docs':
                return <DocsPage />;
            case 'admin':
                return <AdminPanel />;
            default:
                return <HomePage />;
        }
    };

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

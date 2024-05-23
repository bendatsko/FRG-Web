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
import Navbar from "@/components/navbar";

export default function IndexPage() {
    const [isMounted, setIsMounted] = useState(false);
    const { resolvedTheme } = useTheme();
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const logoSrc = !isMounted
        ? DarkImg.src
        : resolvedTheme === 'dark'
            ? DarkImg.src
            : LightImg.src;

    return (
        <DefaultLayout showNavbar={false}>
            <UnauthenticatedTemplate>
                <div className="flex items-start justify-center min-h-screen">
                    <section className="flex flex-col items-center justify-center gap-6 py-8 md:py-10 px-4 w-full max-w-xs mt-16">
                        <NextLink className="flex justify-start items-center gap-2" href="">
                            <div style={{ display: 'flex', justifyContent: 'center', paddingRight: '.1rem'}}>
                                <Image
                                    src={logoSrc}
                                    width={35}
                                    height={35}
                                    radius="none"
                                    alt={`FRG Logo (${resolvedTheme || 'default'} Mode)`}
                                />
                            </div>
                            <p className="font-bold text-inherit text-3xl">DAQROC</p>
                        </NextLink>
                        <SignInButton />
                    </section>
                </div>
            </UnauthenticatedTemplate>

            <AuthenticatedTemplate>
                <section className="flex flex-col items-center min-h-screen py-4">
                    <div className="max-w-[100%] w-full text-center">
                        <Navbar userName={account?.name} />
                        <HomePage />
                    </div>
                </section>
            </AuthenticatedTemplate>
        </DefaultLayout>
    );
}

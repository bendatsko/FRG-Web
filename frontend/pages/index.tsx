import React, { useState, useEffect } from 'react';
import DefaultLayout from '@/layouts/default';
import { Button, Image, Input } from '@nextui-org/react';
import { EyeFilledIcon } from '../components/Icons/EyeFilledIcon';
import { EyeSlashFilledIcon } from '../components/Icons/EyeSlashFilledIcon';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/router';
import DarkImg from '@/public/blockm-white.png';
import LightImg from '@/public/blockm-black.png';
import { useMsal } from '@azure/msal-react';
import { loginRequest } from './authConfig';
import NextLink from 'next/link';

export default function IndexPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { instance } = useMsal();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const toggleVisibility = () => setIsVisible(!isVisible);
  const logoSrc = !isMounted
    ? DarkImg.src
    : resolvedTheme === 'dark'
    ? DarkImg.src
    : LightImg.src;

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const response = await instance.loginPopup(loginRequest);
      if (response.account) {
        router.push('/home');
      }
    } catch (error) {
      setErrorMessage('Login failed. Please try again.');
      setIsLoading(false);
    }
  };

  const getButtonStyles = () => {
    if (!isMounted) {
      return { backgroundColor: 'white', color: 'black' };
    }

    if (resolvedTheme === 'dark') {
      return { backgroundColor: 'white', color: 'black' };
    }

    return { backgroundColor: 'rgba(0, 0, 0, 0.85)', color: 'white' };
  };

  return (
    <DefaultLayout showNavbar={false}>
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
          <Button
            fullWidth
            className={`w-full max-w-xs ${isLoading ? 'isLoading' : ''}`}
            style={getButtonStyles()}
            onClick={handleLogin}
            isLoading={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign in '}
          </Button>
        </section>
      </div>
    </DefaultLayout>
  );
}

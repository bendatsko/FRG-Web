// In DefaultLayout.tsx or wherever your DefaultLayout component is defined
import { Navbar } from "@/components/navbar";
import { Link } from "@nextui-org/link";
import { Head } from "./head";

interface DefaultLayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean; // Optional prop to control the visibility of the navbar
}

export default function DefaultLayout({
  children,
  showNavbar = true,
}: {
  children: React.ReactNode;
  showNavbar?: boolean;
}) {
  return (
    <div className="relative flex flex-col h-screen">
      <Head />

      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>

      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://nextui-docs-v2.vercel.app?utm_source=next-pages-template"
          title="nextui.org homepage"
        ></Link>
      </footer>
    </div>
  );
}

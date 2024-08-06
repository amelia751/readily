"use client";

import React, { useState, useEffect, ReactNode } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { Session } from 'next-auth';
import { usePathname } from 'next/navigation';
import SideBar from './Sidebar';

interface ClientLayoutProps {
  children: ReactNode;
  session: Session | null;
}

const ClientLayout: React.FC<ClientLayoutProps> = ({ children, session }) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const isRoadmapPage = pathname.startsWith('/roadmap');

  return (
    <NextAuthSessionProvider session={session}>
      <div className="flex">
        <SideBar />
        <main className="w-full flex flex-col">
          {children}
        </main>
      </div>
    </NextAuthSessionProvider>
  );
};

export default ClientLayout;

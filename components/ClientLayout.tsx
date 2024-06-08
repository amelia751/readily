"use client";

import React, { useState, useEffect } from 'react';
import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import SideBar from './Sidebar';

const ClientLayout = ({ children, session }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; 
  }

  return (
    <NextAuthSessionProvider session={session}>
      <div className="flex">
        <SideBar />
        <main className="p-4 w-full">{children}</main>
      </div>
    </NextAuthSessionProvider>
  );
};

export default ClientLayout;

"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, BookHeart, Map, LibraryBig, PanelLeftOpen, PanelLeftClose } from "lucide-react";

export function DocsSidebarNavItems({ items, pathname, isPinned }) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm z-100">
      {items.map((item, index) =>
        !item.disabled && item.href ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex items-center rounded-md p-2 m-2 hover:underline text-white font-medium",
              {
                "text-white": pathname === item.href,
              }
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            <div className="flex items-center">
              <div className="h-6 w-6">{item.icon}</div>
              {isPinned && <span className="ml-4">{item.title}</span>}
            </div>
          </Link>
        ) : (
          <span
            key={index}
            className="flex cursor-not-allowed items-center rounded-md p-2 opacity-60"
          >
            <div className="flex items-center">
              <div className="h-6 w-6">{item.icon}</div>
              {isPinned && <span className="ml-4">{item.title}</span>}
            </div>
          </span>
        )
      )}
    </div>
  ) : null;
}

const Sidebar = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isPinned, setIsPinned] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsPinned(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const navItems = [
    { title: "THERAPY", href: "/therapy", icon: <BookHeart /> },
    { title: "ROADMAP", href: "/roadmap", icon: <Map /> },
    { title: "LIBRARY", href: "/library", icon: <LibraryBig /> },
  ];

  if (status === "loading") {
    return null;
  }

  const handleMouseEnter = () => {
    if (!isPinned) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPinned) {
      setIsHovered(false);
    }
  };

  const isTherapyMapPath = pathname?.startsWith('/therapy/');

  return (
    <div
      className={cn(
        "p-2 z-50 flex flex-col justify-between h-screen transition-all duration-300 bg-white",
        isPinned || isHovered ? "z-100 w-72 md:w-64" : "w-20"
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex flex-col justify-between h-full bg-gradient-to-b from-[#FF7A01] to-[#FE9900] rounded-3xl">
        <div>
          <div className="p-4 flex items-center justify-between">
            <h2 className={cn("text-2xl font-bold text-white", !isPinned && !isHovered && "hidden")}>Readily</h2>
            <button onClick={() => setIsPinned(!isPinned)} className="text-white">
              {isPinned ? <PanelLeftClose className="h-6 w-6" /> : <PanelLeftOpen className="h-6 w-6" />}
            </button>
          </div>

          <nav className="mt-4 flex flex-col justify-center">
            <DocsSidebarNavItems items={navItems} pathname={pathname} isPinned={isPinned || isHovered} />
          </nav>

          <div className="mt-4 flex justify-center">
            <img src="/smile.png" className={cn("h-28", !isPinned && !isHovered && "h-12")} />
          </div>
        </div>

        {session && (
          <div className="p-3 md:p-4 flex flex-col">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center space-x-2 focus:outline-none">
                  <img
                    src={session.user.image}
                    alt={session.user.name}
                    className="w-8 h-8 rounded-full"
                  />
                  {(isPinned || isHovered) && (
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-white">{session.user.name}</span>
                      <span className="text-[10px] text-white">{session.user.email}</span>
                    </div>
                  )}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
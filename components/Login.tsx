"use client";

import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

function LogIn() {
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/therapy");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex flex-col items-center justify-start">
            <Button
              className="max-w-2/5 w-full my-4 bg-white text-black mx-auto p-8 space-y-8 rounded-xl shadow items-center justify-center text-center hover:bg-black hover:text-white transition duration-150"
              onClick={() => {
                signIn("google");
              }}
            >
              <Image className="object-contain" src="/googleicon.png" alt="Google Icon" width={50} height={50} />
              Sign in with Google
            </Button>
      </div>
    )
  );
}

export default LogIn;

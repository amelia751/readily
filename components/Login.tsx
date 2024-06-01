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
      router.replace("/onboard");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return <h1>Loading...</h1>;
  }

  return (
    sessionStatus !== "authenticated" && (
      <div className="flex flex-col items-center justify-start min-h-screen">
        <div className="xs:max-w-xs sm:max-w-sm bg-white w-full h-fit mx-auto p-8 space-y-8 rounded-xl shadow items-center justify-center text-center">
          <div className="bg-white container mx-auto p-4 h-fit flex flex-col items-center justify-center text-center space-y-4">
            <h1 className="text-4xl text-center font-semibold mb-3">Sign in</h1>
            <Button
              className="max-w-2/5 w-full my-4 bg-white text-black mx-auto p-8 space-y-8 rounded-xl shadow items-center justify-center text-center hover:bg-black hover:text-white transition duration-150"
              onClick={() => {
                signIn("google");
              }}
            >
              <Image className="object-contain" src="/googleicon.png" alt="Google Icon" width={50} height={50} />
              Sign in with Google
            </Button>
            <p className="text-sm text-black">
              Don't have an account?{" "}
              <Button className="underline bg-transparent text-black text-sm rounded-full hover:text-yellow-500 hover:bg-black transition duration-150">
                <Link href="/register">Register</Link>
              </Button>
            </p>
          </div>
        </div>
      </div>
    )
  );
}

export default LogIn;

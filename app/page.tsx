import LogIn from "@/components/Login";
import { Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col justify-start items-center h-screen overflow-hidden bg-gradient-to-b from-[#FF7A01] via-[#FE9900] to-orange-200">
      <div className="text-white text-center">
        <h1 className="text-5xl uppercase mt-24 font-light">Personalized Therapy For You And Your Loved Ones</h1>
        <div className="flex justify-center items-center gap-2 animate-pulse text-xl mt-4">
          <p>Enabled by Gemini AI</p>
          <Sparkles />
        </div>
      </div>
      <LogIn />
      <img src="/main.png" alt="Readily" className="mt-44 md:mt-16 fixed top-1/3 md:h-screen h-3/4"></img>
    </main>
  );
}


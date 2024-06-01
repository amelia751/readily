import SideBar from "@/components/Sidebar";
import Roadmap from "@/components/Roadmap";

export default function Home() {
  return (
    <main className="flex">
      <SideBar />
      <Roadmap />
    </main>
  );
}
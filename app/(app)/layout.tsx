import Sidebar from "@/components/sidebar";
import Ticker from "@/components/ticker";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto flex flex-col">
        <Ticker />
        <div className="max-w-[1480px] mx-auto p-6 pt-24 lg:pt-8 w-full">
          {children}
        </div>
      </main>
    </div>
  );
}

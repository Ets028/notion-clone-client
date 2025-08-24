"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { ImperativePanelGroupHandle } from "react-resizable-panels";
import Sidebar from "./Sidebar";
import { useAuth } from "@/hooks/useAuth";
import { useUIStore } from "@/store/uiStore";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import Header from "./Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const { sidebarOpen, setSidebarOpen, isMobile, setIsMobile } = useUIStore();
  const router = useRouter();
  const panelGroupRef = useRef<ImperativePanelGroupHandle>(null);
  
  const [lastSidebarSize, setLastSidebarSize] = useState(20);

  // Efek untuk mendeteksi ukuran layar
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarOpen(false); // Selalu tutup di seluler saat load/resize
      }
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [setIsMobile, setSidebarOpen]);

  // Efek untuk melindungi rute
  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);
  
  // Efek untuk mengontrol tata letak panel secara terprogram
  useEffect(() => {
    const panelGroup = panelGroupRef.current;
    if (panelGroup && !isMobile) {
      if (sidebarOpen) {
        panelGroup.setLayout([lastSidebarSize > 0 ? lastSidebarSize : 20, 100 - (lastSidebarSize > 0 ? lastSidebarSize : 20)]);
      } else {
        const currentLayout = panelGroup.getLayout();
        if (currentLayout[0] > 0) {
          setLastSidebarSize(currentLayout[0]);
        }
        panelGroup.setLayout([0, 100]);
      }
    }
  }, [sidebarOpen, isMobile, lastSidebarSize]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // --- Tata Letak Seluler ---
  if (isMobile) {
    return (
      <div className="h-screen flex flex-col bg-background">
        <Header />
        <div className="flex-1 relative overflow-hidden">
          <main className="h-full overflow-auto">
            {children}
          </main>
          {/* Sidebar sebagai overlay yang dianimasikan */}
          <div 
            className={cn(
              "fixed inset-0 bg-black/60 z-40 transition-opacity duration-300",
              sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
            onClick={() => setSidebarOpen(false)}
          />
          <div className={cn(
            "fixed left-0 top-0 h-full w-80 z-50 bg-sidebar transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}>
            <Sidebar />
          </div>
        </div>
      </div>
    );
  }

  // --- Tata Letak Desktop ---
  return (
    <div className="h-screen flex flex-col bg-background">
      <ResizablePanelGroup
        ref={panelGroupRef}
        direction="horizontal"
        className="flex-1"
        onLayout={(sizes: number[]) => {
          if (sizes[0] > 0) {
            setLastSidebarSize(sizes[0]);
          }
        }}
      >
        <ResizablePanel
          collapsible={true}
          collapsedSize={0}
          minSize={15}
          maxSize={35}
          className="min-w-[240px] bg-sidebar"
          onCollapse={() => setSidebarOpen(false)}
          onExpand={() => setSidebarOpen(true)}
        >
          <Sidebar />
        </ResizablePanel>
        
        <ResizableHandle withHandle className={cn(!sidebarOpen && "hidden")} />
        
        <ResizablePanel className="flex flex-col">
          <Header />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}

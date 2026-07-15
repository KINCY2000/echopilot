"use client";

import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SidebarNav } from "@/features/dashboard/components/sidebar-nav";

export function DashboardSidebar() {
  return (
    <>
      {/* Desktop: persistent sidebar */}
      <aside className="hidden w-64 shrink-0 bg-gradient-to-b from-[#092757] to-[#04162f] lg:block">
        <SidebarNav />
      </aside>

      {/* Mobile: slide-over sheet triggered by a floating button */}
      <Sheet>
        <SheetTrigger asChild>
          <button className="fixed left-4 top-4 z-50 rounded-xl bg-[#08234d] p-3 text-white shadow-lg lg:hidden">
            <Menu size={20} />
          </button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 bg-gradient-to-b from-[#092757] to-[#04162f] p-0">
          <SheetTitle>Menu de navigation</SheetTitle>
          <SheetDescription>Accès rapide aux sections d&apos;EchoPilot</SheetDescription>
          <SidebarNav />
        </SheetContent>
      </Sheet>
    </>
  );
}

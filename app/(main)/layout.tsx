import MobileSidebar from "@/components/mobile-sidebar";
import Navbar from "@/components/navbar";
import SearchFilter from "@/components/search-filter";
import React from "react";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-full w-full flex-col overflow-auto">
      <MobileSidebar />
      <nav className="bg-white">
        <Navbar />
        <SearchFilter />
      </nav>
      {children}
    </div>
  );
}

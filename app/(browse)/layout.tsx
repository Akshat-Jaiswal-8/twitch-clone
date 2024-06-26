import React, { Suspense } from "react";
import { Sidebar, SidebarSkeleton } from "@/app/(browse)/_components/sidebar";
import { Container } from "./_components/container";
import Navbar from "./_components/navbar";

const BrowseLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Navbar />
      <div className={"flex h-full pt-20"}>
        <Suspense fallback={<SidebarSkeleton />}>
          <Sidebar />
        </Suspense>
        <Container>{children}</Container>
      </div>
    </>
  );
};

export default BrowseLayout;

"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/shared/Sidebar";
import ResumeUpload from "@/components/ui/ResumeUpload";
import ResumeCreator from "@/components/ui/ResumeCreator";

const DashboardContent = () => {
  const searchParams = useSearchParams();
  const view = searchParams.get("view") || "analyze";
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto scroll-smooth custom-scrollbar">
          <div className="container mx-auto">
            {view === "create" ? <ResumeCreator /> : <ResumeUpload />}
          </div>
        </div>
      </main>
    </div>
  );
};

const DashboardPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default DashboardPage;

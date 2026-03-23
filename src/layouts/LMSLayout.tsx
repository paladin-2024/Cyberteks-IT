import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '@/components/lms/Sidebar';
import TopBar from '@/components/lms/TopBar';
import RightSidebar from '@/components/lms/RightSidebar';

export default function LMSLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <div className="flex flex-col flex-1 overflow-hidden min-w-0">
        <TopBar onMenuToggle={() => setMobileOpen((v) => !v)} />
        <div className="flex flex-1 overflow-hidden">
          <main className="flex-1 overflow-y-auto p-4 md:p-6 min-w-0 bg-muted/30">
            <Outlet />
          </main>
          <RightSidebar />
        </div>
      </div>
    </div>
  );
}

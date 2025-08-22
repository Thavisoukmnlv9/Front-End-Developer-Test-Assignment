import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { TodoCreateDialog } from "@/components/todos/TodoCreateDialog";
import { useIsMobile } from "@/hooks/use-mobile";

export const Layout = () => {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={handleSidebarClose}
        />
      )}

      {/* Sidebar */}
      <Sidebar 
        onAddTodo={() => setCreateDialogOpen(true)}
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
        isMobile={isMobile}
      />
      
      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Mobile Header */}
        {isMobile && (
          <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border px-4 py-3 lg:hidden">
            <div className="flex items-center justify-between">
              <button
                onClick={handleSidebarToggle}
                className="p-2 rounded-md hover:bg-accent transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h1 className="font-bold text-lg">TaskFlow</h1>
              </div>
              <button
                onClick={() => setCreateDialogOpen(true)}
                className="p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <div className="container max-w-6xl mx-auto p-4 lg:p-6">
          <Outlet />
        </div>
      </main>

      <TodoCreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
    </div>
  );
};
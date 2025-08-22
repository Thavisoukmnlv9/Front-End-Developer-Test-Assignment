import { NavLink } from "react-router-dom";
import {  Users, LayoutGrid, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/enhanced-button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onAddTodo?: () => void;
  isOpen?: boolean;
  onClose?: () => void;
  isMobile?: boolean;
}

export const Sidebar = ({ className, onAddTodo, isOpen = true, onClose, isMobile }: SidebarProps) => {
  const navigation = [
    { name: "Dashboard", href: "/", icon: LayoutGrid },
    { name: "All Users", href: "/users", icon: Users },
  ];

  return (
    <aside className={cn(
      "border-r border-sidebar-border bg-sidebar text-sidebar-foreground",
      "flex flex-col h-screen",
      isMobile && "fixed left-0 top-0 z-50 w-80 transform transition-transform duration-300 ease-in-out",
      isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
      !isMobile && "w-sidebar",
      className
    )}>
      {/* Header */}
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 group">
            {/* Enhanced Logo Container */}
            <div className="relative">
              {/* Main logo container with gradient and shadow */}
              <div className="relative p-3  from-primary via-primary/90 to-primary/80 rounded-xl shadow-lg shadow-primary/25 group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-105">
                {/* Background pattern overlay */}
                <div className="absolute inset-0  from-white/10 to-transparent rounded-xl"></div>

                {/* Logo image with better sizing */}
                <img
                  src="./AIF.webp"
                  alt="TaskFlow"
                  className="relative z-10 h-7 w-7 object-contain filter drop-shadow-sm"
                />

                {/* Subtle glow effect */}
                <div className="absolute inset-0 bg-primary/20 rounded-xl blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              {/* Decorative accent */}
              <div className="absolute -top-1 -right-1 w-3 h-3  from-yellow-400 to-orange-500 rounded-full shadow-sm animate-pulse"></div>
            </div>

            {/* Enhanced Text Content */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-xl  bg-clip-text">
                  TaskFlow
                </h1>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                Task Management
              </p>

            </div>
          </div>

          {/* Mobile close button */}
          {isMobile && onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-md hover:bg-sidebar-border transition-colors lg:hidden"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Quick Action */}
      <div className="p-4 border-b border-sidebar-border">
        <Button
          onClick={onAddTodo}
          className="w-full"
        >
          <Plus className="h-4 w-4" />
          Add New Todo
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navigation.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.href}
                onClick={() => isMobile && onClose?.()}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-border hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground">
          Front-End Developer Test Assignment
        </div>
      </div>
    </aside>
  );
};
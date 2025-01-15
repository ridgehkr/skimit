"use client";

import { LibraryBig, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import Link from "next/link";

interface AppHeaderProps {
  onOpenSidebar: () => void;
}

export function AppHeader({ onOpenSidebar }: AppHeaderProps) {
  return (
    <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 fixed top-0 left-0 right-0 z-50">
      <div className="h-full mx-auto px-4 flex items-center justify-between">
        <Link 
          href="/" 
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          onClick={() => window.history.pushState({}, '', '/')}
        >
          <LibraryBig className="h-6 w-6 text-primary" />
          <h1 className="text-base md:text-lg font-semibold">SkimIt</h1>
        </Link>

        <div className="flex items-center gap-4">
          {/* Desktop login button */}
          <div className="hidden md:block">
            <LoginButton />
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={onOpenSidebar}
          >
            <Menu className="h-6 w-6" />
          </Button>
        </div>
      </div>
    </header>
  );
}
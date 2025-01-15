"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRedditAuth } from "@/lib/auth/reddit-auth";
import { getAuthUrl } from "@/lib/auth/reddit-oauth";
import { LogIn, LogOut } from "lucide-react";

export function LoginButton() {
  const { isAuthenticated, username, logout } = useRedditAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    setIsLoading(true);
    window.location.href = getAuthUrl();
  };

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">u/{username}</span>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={handleLogin}
      disabled={isLoading}
    >
      <LogIn className="h-4 w-4 mr-2" />
      {isLoading ? "Redirecting..." : "Login with Reddit"}
    </Button>
  );
}
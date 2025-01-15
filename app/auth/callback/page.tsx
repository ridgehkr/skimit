"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRedditAuth } from "@/lib/auth/reddit-auth";
import { exchangeCode, fetchUserInfo } from "@/lib/auth/reddit-oauth";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useRedditAuth();

  useEffect(() => {
    async function handleCallback() {
      try {
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        
        if (!code || !state) {
          throw new Error("Missing code or state parameter");
        }

        // Exchange the code for tokens
        const tokens = await exchangeCode(code, state);
        
        // Fetch user information
        const userInfo = await fetchUserInfo(tokens.access_token);
        
        // Login with the tokens and user info
        login(tokens.access_token, tokens.refresh_token, userInfo.name);
        
        // Redirect back to the main page
        router.push("/");
      } catch (error) {
        console.error("Auth error:", error);
        router.push("/?auth_error=true");
      }
    }

    handleCallback();
  }, [searchParams, login, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Completing login...</h1>
        <p className="text-muted-foreground">Please wait while we authenticate you with Reddit</p>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import LandingPage from "./LandingPage";
import AuthForm from "./AuthForm";
import ChallengesPage from "./ChallengesPage";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type AppState = "landing" | "auth" | "challenges";

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [user, setUser] = useState<{ email: string; username?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const upsertUser = useMutation(api.myFunctions.upsertUser);

  // Check for saved authentication on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('ctf-user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser.email && parsedUser.username) {
          setUser(parsedUser);
          setAppState("challenges");
        }
      } catch (error) {
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('ctf-user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleGetStarted = () => {
    setAppState("auth");
  };

  const handleAuth = async (email: string, username: string) => {
    try {
      await upsertUser({email, username});
      const userData = { email, username };
      setUser(userData);
      // Save to localStorage for persistence
      localStorage.setItem('ctf-user', JSON.stringify(userData));
      setAppState("challenges");
    } catch (error) {
      throw error; // Re-throw to be handled by the AuthForm
    }
  };

  const handleSignOut = () => {
    setUser(null);
    localStorage.removeItem('ctf-user');
    setAppState("landing");
  };

  const handleBackToHome = () => {
    setAppState("landing");
  };

  // Show loading while checking for saved authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  if (appState === "landing") {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  if (appState === "challenges" && user) {
    return (
      <ChallengesPage
        onSignOut={handleSignOut}
        username={user.username!}
        email={user.email}
      />
    );
  }

  return (
    <AuthForm
      onAuth={handleAuth}
      onBackToHome={handleBackToHome}
    />
  );
}

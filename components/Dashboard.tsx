"use client";

import { useState } from "react";
import LandingPage from "./LandingPage";
import AuthForm from "./AuthForm";
import ChallengesPage from "./ChallengesPage";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type AppState = "landing" | "auth" | "challenges";
type AuthMode = "signin" | "signup";

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("signup");
  const [user, setUser] = useState<{ email: string; username?: string } | null>(null);
  const upsertUser = useMutation(api.myFunctions.upsertUser);

  const handleGetStarted = () => {
    setAppState("auth");
    setAuthMode("signup");
  };

  const handleAuth = (email: string, username: string) => {
    setUser({ email, username });
    setAppState("challenges");
    upsertUser({email, username});
  };

  const handleSignOut = () => {
    setUser(null);
    setAppState("landing");
    setAuthMode("signin");
  };

  const handleBackToHome = () => {
    setAppState("landing");
  };

  const handleToggleAuthMode = () => {
    setAuthMode(prev => prev === "signin" ? "signup" : "signin");
  };

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
      mode={authMode}
      onToggleMode={handleToggleAuthMode}
      onAuth={handleAuth}
      onBackToHome={handleBackToHome}
    />
  );
}

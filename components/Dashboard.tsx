"use client";

import { useState } from "react";
import LandingPage from "./LandingPage";
import AuthForm from "./AuthForm";
import ChallengesPage from "./ChallengesPage";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

type AppState = "landing" | "auth" | "challenges";

export default function Dashboard() {
  const [appState, setAppState] = useState<AppState>("landing");
  const [user, setUser] = useState<{ email: string; username?: string } | null>({
    email: "",
    username: ""
  });
  const upsertUser = useMutation(api.myFunctions.upsertUser);

  const handleGetStarted = () => {
    setAppState("auth");
  };

  const handleAuth = (email: string, username: string) => {
    setUser({ email, username });
    setAppState("challenges");
    upsertUser({email, username});
  };

  const handleSignOut = () => {
    setUser(null);
    setAppState("landing");
  };

  const handleBackToHome = () => {
    setAppState("landing");
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
      onAuth={handleAuth}
      onBackToHome={handleBackToHome}
    />
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AuthFormProps {
  mode: "signin" | "signup";
  onToggleMode: () => void;
  onAuth: (email: string, username?: string) => void;
  onBackToHome?: () => void;
}

export default function AuthForm({ mode, onToggleMode, onAuth, onBackToHome }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || (mode === "signup" && !username)) return;

    setIsLoading(true);
    setMessage("");

    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (mode === "signup") {
      setMessage("Account created successfully! Check your email for the first challenge.");
      setMessageType("success");
      onAuth(email, username);
    } else {
      setMessage("Signed in successfully! Redirecting to challenges...");
      setMessageType("success");
      onAuth(email);
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-950 border-gray-800">
        <CardHeader className="text-center">
          {onBackToHome && (
            <div className="flex justify-start mb-4">
              <Button
                variant="ghost"
                onClick={onBackToHome}
                className="text-gray-400 hover:text-gray-300 p-2"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </div>
          )}
          <div className="flex justify-center mb-4">
            {mode === "signin" ? (
              <LogIn className="h-12 w-12 text-gray-400" />
            ) : (
              <UserPlus className="h-12 w-12 text-gray-400" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold text-gray-100">
            {mode === "signin" ? "Sign In" : "Create Account"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {mode === "signin" 
              ? "Welcome back! Sign in to continue your CTF journey" 
              : "Join the CTF challenge and test your email security skills"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-200">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Choose a username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                    required
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-200">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                  required
                />
              </div>
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gray-800 hover:bg-gray-700 text-white" 
              disabled={isLoading || !email || (mode === "signup" && !username)}
            >
              {isLoading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account & Send Challenge"}
            </Button>
          </form>

          <div className="text-center">
            <button
              onClick={onToggleMode}
              className="text-sm text-gray-400 hover:text-gray-300 underline"
              disabled={isLoading}
            >
              {mode === "signin" 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {message && (
            <Alert className={`${
              messageType === "success" ? "border-green-600 bg-green-950" :
              messageType === "error" ? "border-red-600 bg-red-950" :
              "border-blue-600 bg-blue-950"
            }`}>
              <AlertDescription className={
                messageType === "success" ? "text-green-400" :
                messageType === "error" ? "text-red-400" :
                "text-blue-400"
              }>
                {message}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

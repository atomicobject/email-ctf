"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Mail, ArrowLeft } from "lucide-react";

interface AuthFormProps {
  onAuth: (email: string, username: string) => Promise<void>;
  onBackToHome?: () => void;
}

export default function AuthForm({ onAuth, onBackToHome }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !username) return;

    setIsLoading(true);
    setMessage("");

    try {
      setMessage("Processing authentication...");
      setMessageType("info");
      
      // Await the onAuth function which handles the actual authentication
      await onAuth(email, username);
      
      setMessage("Signed in successfully! Redirecting to challenges...");
      setMessageType("success");
    } catch (error) {
      setMessage("Authentication failed. Please try again.");
      setMessageType("error");
      console.error("Authentication error:", error);
    } finally {
      setIsLoading(false);
    }
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
          
          <CardTitle className="text-2xl font-bold text-gray-100">
            {"Sign In"}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {"Join the CTF challenge and test your email security skills"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {(
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
              disabled={isLoading || !email || !username}
            >
              {isLoading ? "Processing..." : "Let's go!"}
            </Button>
          </form>

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

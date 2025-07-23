"use client";
import { Button } from "@/components/ui/button";
import { 
  Flag, 
  ChevronRight,
} from "lucide-react";

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div className="space-y-8">

          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gray-700/20 rounded-full blur-2xl"></div>
              <Flag className="relative h-16 w-16 text-gray-300" />
            </div>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Email Security
              <span className="block bg-gradient-to-r from-gray-200 to-gray-400 bg-clip-text text-transparent">
                CTF Platform
              </span>
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
              Master email security through hands-on Capture The Flag challenges. 
              Learn to detect phishing, analyze headers, and understand email-based threats.
            </p>
          </div>


          <div className="pt-4">
            <Button 
              onClick={onGetStarted}
              className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-3 text-lg group"
              size="lg"
            >
              Start Your Journey
              <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

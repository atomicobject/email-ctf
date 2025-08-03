"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { 
  Flag, 
  Mail, 
  CheckCircle, 
  XCircle, 
  Trophy, 
  Target, 
  Lock,
  Unlock,
  FlagTriangleRight
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface Challenge {
  id: number;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  completed: boolean;
  emailSent: boolean;
  flag?: string;
}

interface ChallengesPageProps {
  onSignOut: () => void;
  username: string;
  email: string;
}

export default function ChallengesPage({ onSignOut, username, email }: ChallengesPageProps) {
  console.log(username, email);
  const user = useQuery(api.myFunctions.getUser, {username, email});
  //const completeChallenge = useMutation(api.myFunctions.completeChallenge);
  const challenges = [
    {
      id: 1,
      title: "Email Header Analysis",
      description: "Analyze the email headers to find the hidden flag. Look for suspicious routing information and authentication records.",
      category: "Headers",
      difficulty: "Easy" as const,
      completed: user?.challenge1 ?? false,
      emailSent: user?.challenge1EmailSent ?? false
    },
    {
      id: 2, 
      title: "Phishing Detection",
      description: "Identify the phishing indicators in this deceptive email. Check the sender authentication and find the concealed flag.",
      category: "Phishing",
      difficulty: "Medium" as const,
      completed: user?.challenge2 ?? false,
      emailSent: user?.challenge2EmailSent ?? false
    },
    {
      id: 3, 
      title: "Malware Obfuscation",
      description: "Analyze the email for hidden malware. Look for obfuscated Base64-encoded string, and decode it to find the flag.",
      category: "Malware",
      difficulty: "Hard" as const,
      completed: user?.challenge3 ?? false,
      emailSent: user?.challenge3EmailSent ?? false
    },
  ];

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingChallengeId, setLoadingChallengeId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info");
  const sendChallenge = useMutation(api.sendEmails.sendChallenge);
  const completeChallenge = useMutation(api.myFunctions.completeChallenge);
  const challengeData = useQuery(api.myFunctions.getChallenge, {challengeNumber: selectedChallenge?.id ?? 1});

  // Get challenge data for each challenge to show flags
  const challenge1Data = useQuery(api.myFunctions.getChallenge, {challengeNumber: 1});
  const challenge2Data = useQuery(api.myFunctions.getChallenge, {challengeNumber: 2});
  const challenge3Data = useQuery(api.myFunctions.getChallenge, {challengeNumber: 3});

  // Helper function to get flag data for a specific challenge
  const getChallengeFlag = (challengeId: number) => {
    switch (challengeId) {
      case 1: return challenge1Data?.flag;
      case 2: return challenge2Data?.flag;
      case 3: return challenge3Data?.flag;
      default: return null;
    }
  };

  // Display the complete message when a completed challenge is selected for review
  useEffect(() => {
    if (selectedChallenge && selectedChallenge.completed && challengeData?.completeMessage) {
      setMessage("🎉 Challenge completed successfully! " + challengeData.completeMessage);
      setMessageType("success");
    }
  }, [selectedChallenge, challengeData]);

  const handleSendChallenge = async (challenge: Challenge) => {
    // If the challenge is completed, show the review message instead of sending email
    if (challenge.completed) {
      setSelectedChallenge(challenge);
      setMessage("🎉 Challenge completed successfully!");
      setMessageType("success");
      return;
    }

    setLoadingChallengeId(challenge.id);
    setMessage("");

    // Simulate sending email
    await sendChallenge({email, username, challengeNumber: challenge.id});

    setMessage(`Challenge "${challenge.title}" sent to your email! Check your inbox.`);
    setMessageType("success");
    setSelectedChallenge(challenge);
    setLoadingChallengeId(null);
  };

  const handleChallengeCardClick = (challenge: Challenge) => {
    // Only allow clicking into challenge if email has been sent and challenge is not completed
    if (challenge.emailSent && !challenge.completed) {
      setSelectedChallenge(challenge);
      setMessage("");
    }
  };

  const handleSubmitFlag = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!answer || !selectedChallenge) return;

    setIsLoading(true);
    setMessage("");

    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const isCorrect = await completeChallenge({
      email, username, flagNumber: selectedChallenge.id, flag: answer.trim()
    });
    
    if (isCorrect) {
      // setChallenges(prev => prev.map(c => 
      //   c.id === selectedChallenge.id ? { ...c, completed: true, flag: answer } : c
      // ));
      setMessage("🎉 Correct! Challenge completed successfully! " + challengeData?.completeMessage);
      setMessageType("success");
      setAnswer("");
      
      // Move to next challenge if available
      const nextChallenge = challenges.find(c => c.id > selectedChallenge.id && !c.completed);
      if (nextChallenge) {
        setTimeout(() => {
          // setSelectedChallenge(nextChallenge);
          setMessage("");
        }, 2000);
      } else {
        setTimeout(() => {
          setSelectedChallenge(null);
          setMessage("🏆 Congratulations! You've completed all available challenges!");
          setMessageType("success");
        }, 2000);
      }
    } else {
      setMessage("Incorrect flag. Try again! (Hint: look for CTF or FLAG in the email)");
      setMessageType("error");
    }
    
    setIsLoading(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-900 text-green-300 border-green-700";
      case "Medium": return "bg-yellow-900 text-yellow-300 border-yellow-700";
      case "Hard": return "bg-red-900 text-red-300 border-red-700";
      default: return "bg-gray-900 text-gray-300 border-gray-700";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Headers": return "bg-blue-900 text-blue-300 border-blue-700";
      case "Phishing": return "bg-purple-900 text-purple-300 border-purple-700";
      case "Malware": return "bg-orange-900 text-orange-300 border-orange-700";
      default: return "bg-gray-900 text-gray-300 border-gray-700";
    }
  };

  const completedCount = challenges.filter(c => c.completed).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-950 border-b border-gray-800 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Flag className="h-8 w-8 text-gray-400" />
            <div>
              <h1 className="text-xl font-bold text-gray-100">Email CTF Platform</h1>
              <p className="text-sm text-gray-400">Welcome, {username}!</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-sm text-gray-400">
                {completedCount}/{challenges.length} challenges completed
              </div>
            </div>
            <Button 
              onClick={onSignOut}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {!selectedChallenge ? (
          <div className="space-y-6">
            {/* Progress & Achievements Overview */}
            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <CardTitle className="text-gray-100 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Your Progress
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Track your CTF journey and unlock achievements
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Achievements */}
                <div>
                  <div className="flex gap-4 justify-center">
                    {/* Achievement Card 1 */}
                    <div className={`rounded-lg p-4 text-center min-w-[120px] transition-all duration-300 ${
                      challenges[0].completed 
                        ? 'bg-yellow-900/20 border-yellow-600 shadow-lg shadow-yellow-500/20' 
                        : 'bg-gray-900 border border-gray-800'
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        challenges[0].completed ? 'text-yellow-300' : 'text-gray-300'
                      }`}>Quippy Name</div>
                      <Trophy className={`h-8 w-8 mx-auto mb-2 ${
                        challenges[0].completed ? 'text-yellow-400' : 'text-gray-600'
                      }`} />
                      <div className={`text-xs ${
                        challenges[0].completed ? 'text-yellow-200' : 'text-gray-500'
                      }`}>Header Analysis</div>
                    </div>
                    
                    {/* Achievement Card 2 */}
                    <div className={`rounded-lg p-4 text-center min-w-[120px] transition-all duration-300 ${
                      challenges[1].completed 
                        ? 'bg-yellow-900/20 border-yellow-600 shadow-lg shadow-yellow-500/20' 
                        : 'bg-gray-900 border border-gray-800'
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        challenges[1].completed ? 'text-yellow-300' : 'text-gray-300'
                      }`}>Return to Sender</div>
                      <Trophy className={`h-8 w-8 mx-auto mb-2 ${
                        challenges[1].completed ? 'text-yellow-400' : 'text-gray-600'
                      }`} />
                      <div className={`text-xs ${
                        challenges[1].completed ? 'text-yellow-200' : 'text-gray-500'
                      }`}>Phishing Detection</div>
                    </div>

                    {/* Achievement Card 3 */}
                    <div className={`rounded-lg p-4 text-center min-w-[120px] transition-all duration-300 ${
                      challenges[2].completed 
                        ? 'bg-yellow-900/20 border-yellow-600 shadow-lg shadow-yellow-500/20' 
                        : 'bg-gray-900 border border-gray-800'
                    }`}>
                      <div className={`text-2xl font-bold mb-2 ${
                        challenges[2].completed ? 'text-yellow-300' : 'text-gray-300'
                      }`}>Hidden in plain sight</div>
                      <Trophy className={`h-8 w-8 mx-auto mb-2 ${
                        challenges[2].completed ? 'text-yellow-400' : 'text-gray-600'
                      }`} />
                      <div className={`text-xs ${
                        challenges[2].completed ? 'text-yellow-200' : 'text-gray-500'
                      }`}>Malware Detection</div>
                    </div>
                  </div>
                </div>
                {/* Progress Stats */}
                <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-lg font-bold text-gray-100">
                      {completedCount}/{challenges.length} Challenges Completed!
                    </div>
                  </div>
                  <div className="w-full bg-gray-800 rounded-full h-2 relative">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(completedCount / challenges.length) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute top-1/2 transform -translate-y-1/2 transition-all duration-300"
                      style={{ left: `${(completedCount / challenges.length) * 100}%` }}
                    >
                      <FlagTriangleRight className="h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                </div>

                
              </CardContent>
            </Card>

            {/* Challenges List */}
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-100 mb-4">Available Challenges</h2>
              {challenges.map((challenge) => (
                <Card 
                  key={challenge.id} 
                  className={`bg-gray-950 border-gray-800 transition-all duration-200 ${
                    challenge.emailSent && !challenge.completed 
                      ? 'cursor-pointer hover:border-gray-600 hover:bg-gray-900' 
                      : ''
                  }`}
                  onClick={() => handleChallengeCardClick(challenge)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          {challenge.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-400" />
                          ) : (
                            <Lock className="h-5 w-5 text-gray-500" />
                          )}
                          <CardTitle className="text-gray-100">{challenge.title}</CardTitle>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getDifficultyColor(challenge.difficulty)}>
                            {challenge.difficulty}
                          </Badge>
                          <Badge className={getCategoryColor(challenge.category)}>
                            {challenge.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => handleSendChallenge(challenge as Challenge)}
                          disabled={loadingChallengeId === challenge.id}
                          className="bg-gray-800 hover:bg-gray-700 text-white"
                        >
                          {challenge.completed ? (
                            <>
                              <Unlock className="h-4 w-4 mr-2" />
                              Review
                            </>
                          ) : (
                            <>
                              <Mail className="h-4 w-4 mr-2" />
                              {loadingChallengeId === challenge.id 
                                ? "Sending..." 
                                : (challenge.emailSent && !challenge.completed) 
                                  ? "Resend Email" 
                                  : "Send Challenge"
                              }
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-400">{challenge.description}</p>
                    {challenge.emailSent && !challenge.completed && (
                      <div className="mt-3 p-2 bg-blue-900/20 rounded border border-blue-700/50">
                        <p className="text-sm text-blue-300">
                          💡 Click this card to work on the challenge, or resend the email above
                        </p>
                      </div>
                    )}
                    {challenge.completed && (
                      <div className="mt-3 p-3 bg-gray-900 rounded border border-gray-700">
                        <p className="text-sm text-gray-500 mb-1">Correct flag:</p>
                        <code className="text-green-400 font-mono">{getChallengeFlag(challenge.id) || 'Loading...'}</code>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          /* Challenge Submission Interface */
          <div className="space-y-6">
            <Button 
              onClick={() => setSelectedChallenge(null)}
              className="bg-gray-800 hover:bg-gray-700 text-white"
            >
              ← Back to Challenges
            </Button>

            <Card className="bg-gray-950 border-gray-800">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Flag className="h-5 w-5 text-gray-400" />
                  <CardTitle className="text-gray-100">{selectedChallenge.title}</CardTitle>
                </div>
                <CardDescription className="text-gray-400">
                  {selectedChallenge.description}
                </CardDescription>
                <div className="flex gap-2 mt-2">
                  <Badge className={getDifficultyColor(selectedChallenge.difficulty)}>
                    {selectedChallenge.difficulty}
                  </Badge>
                  <Badge className={getCategoryColor(selectedChallenge.category)}>
                    {selectedChallenge.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmitFlag} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="flag" className="text-gray-200">Submit Flag</Label>
                    <div className="relative">
                      <Flag className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="flag"
                        type="text"
                        placeholder="CTF{your_flag_here}"
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        className="pl-10 bg-gray-900 border-gray-700 text-gray-100 placeholder-gray-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-gray-800 hover:bg-gray-700 text-white" 
                    disabled={isLoading || !answer}
                  >
                    {isLoading ? "Verifying..." : "Submit Flag"}
                  </Button>
                </form>

                <div className="mt-6 p-4 bg-gray-900 rounded border border-gray-700">
                  <h4 className="font-semibold text-gray-200 mb-2">Instructions:</h4>
                  <ol className="text-sm text-gray-400 space-y-1">
                    <li>1. Check your email for the challenge content</li>
                    <li>2. Analyze the email headers, body, and attachments</li>
                    <li>3. Look for hidden flags in the format CTF&#123;...&#125;</li>
                    <li>4. Submit the complete flag including the CTF&#123;&#125; wrapper</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {message && (
          <Alert className={`mt-6 ${
            messageType === "success" ? "border-green-600 bg-green-950" :
            messageType === "error" ? "border-red-600 bg-red-950" :
            "border-blue-600 bg-blue-950"
          }`}>
            {messageType === "success" && <CheckCircle className="h-4 w-4 !text-green-400" />}
            {messageType === "error" && <XCircle className="h-4 w-4 !text-red-400" />}
            <AlertDescription className={
              messageType === "success" ? "text-green-400" :
              messageType === "error" ? "text-red-400" :
              "text-blue-400"
            }>
              {message}
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}

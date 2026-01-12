import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, MicOff, Phone, Clock, MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ArenaSimulationProps {
  track: "b2b" | "b2c";
  onComplete: (score: number) => void;
}

interface Message {
  role: "prospect" | "candidate";
  content: string;
  timestamp: Date;
}

const b2bPersona = {
  name: "Marcus Chen",
  role: "VP of Sales",
  company: "TechScale Solutions",
  avatar: "MC",
  openingMessage: "Look, I've got 10 minutes before my next call. What do you want?",
};

const b2cPersona = {
  name: "Sarah Mitchell",
  role: "Senior Partner",
  company: "Mitchell & Associates Law",
  avatar: "SM",
  openingMessage: "I saw your ad... honestly I'm skeptical. I've seen a dozen of these 'change your life' programs. What makes you different?",
};

const ArenaSimulation = ({ track, onComplete }: ArenaSimulationProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes
  const [currentScore, setCurrentScore] = useState(50);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const persona = track === "b2b" ? b2bPersona : b2cPersona;

  // Initialize with opening message
  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages([
        {
          role: "prospect",
          content: persona.openingMessage,
          timestamp: new Date(),
        },
      ]);
    }, 1000);
    return () => clearTimeout(timer);
  }, [persona.openingMessage]);

  // Timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          onComplete(currentScore);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentScore, onComplete]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const simulateProspectResponse = (userMessage: string) => {
    setIsTyping(true);
    
    // Simulate AI processing time
    const responseTime = 1500 + Math.random() * 2000;
    
    setTimeout(() => {
      setIsTyping(false);
      
      // Simulated responses based on track and message content
      const b2bResponses = [
        "Interesting, but we already have Salesforce. Why would I add another tool to my stack?",
        "My reps won't use this. Every time we roll out new software, adoption tanks.",
        "We froze all tech spend for Q3. Maybe reach out next quarter.",
        "Show me the ROI. What's the payback period?",
        "How is this different from Gong or Chorus?",
      ];

      const b2cResponses = [
        "I work 60 hours a week. When would I even have time to learn this?",
        "I need to talk to my husband first. He handles our investments.",
        "What's the catch? These programs always have hidden upsells.",
        "I've been burned before by coaches who couldn't deliver.",
        "My income is good. Why would I risk that for something uncertain?",
      ];

      const responses = track === "b2b" ? b2bResponses : b2cResponses;
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];

      // Update score based on simulated analysis
      const scoreChange = Math.floor(Math.random() * 10) - 3; // -3 to +7
      setCurrentScore((prev) => Math.min(100, Math.max(0, prev + scoreChange)));

      setMessages((prev) => [
        ...prev,
        {
          role: "prospect",
          content: randomResponse,
          timestamp: new Date(),
        },
      ]);
    }, responseTime);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || isProcessing) return;

    const newMessage: Message = {
      role: "candidate",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      simulateProspectResponse(inputValue);
    }, 500);
  };

  const handleEndCall = () => {
    onComplete(currentScore);
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center text-accent font-bold text-lg">
            {persona.avatar}
          </div>
          <div>
            <h2 className="font-bold text-lg">{persona.name}</h2>
            <p className="text-sm text-muted-foreground">
              {persona.role} at {persona.company}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Timer */}
          <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
            timeRemaining < 60 ? "bg-destructive/20 text-destructive" : "bg-secondary"
          }`}>
            <Clock className="w-4 h-4" />
            <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
          </div>

          {/* Live Score */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10">
            <div className="w-2 h-2 rounded-full bg-primary pulse-live" />
            <span className="font-mono font-bold text-primary">{currentScore}</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <Card variant="elevated" className="mb-4">
        <div className="h-[400px] overflow-y-auto p-6 space-y-4">
          {messages.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${message.role === "candidate" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  message.role === "candidate"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-secondary text-secondary-foreground rounded-bl-md"
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-secondary rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground typing-dot" />
                </div>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className={`p-3 rounded-xl transition-colors ${
                isMuted ? "bg-destructive/20 text-destructive" : "bg-secondary text-secondary-foreground"
              }`}
            >
              {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            <div className="flex-1 relative">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Type your response..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="w-full pl-12 pr-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isProcessing}
              size="icon"
              className="h-12 w-12 rounded-xl"
            >
              {isProcessing ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>

            <Button
              variant="destructive"
              onClick={handleEndCall}
              className="gap-2"
            >
              <Phone className="w-4 h-4" />
              End Call
            </Button>
          </div>
        </div>
      </Card>

      {/* Tips Panel */}
      <Card variant="glass" className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent flex-shrink-0">
            💡
          </div>
          <div>
            <p className="text-sm font-medium mb-1">Pro Tip</p>
            <p className="text-sm text-muted-foreground">
              {track === "b2b" 
                ? "Don't pitch features. Identify the business pain first—ask about hiring costs, ramp time, or lead waste."
                : "Build rapport before pitching. Acknowledge their success and explore the gap between income and lifestyle."}
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ArenaSimulation;

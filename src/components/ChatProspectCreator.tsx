import { useState, useRef, useEffect } from "react";
import { 
  MessageSquare, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Check,
  Phone,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface GeneratedProspect {
  name: string;
  role: string;
  company: string;
  personality: string;
  callType: string;
  description: string;
}

interface ChatProspectCreatorProps {
  onProspectCreated: (prospect: GeneratedProspect) => void;
  onClose: () => void;
}

const ChatProspectCreator = ({ onProspectCreated, onClose }: ChatProspectCreatorProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm here to help you create a custom prospect for roleplay practice. Tell me about the type of buyer you want to practice with. For example:\n\n• \"A skeptical CTO at a tech startup who's budget-conscious\"\n• \"A friendly VP of Sales who loves data but asks tough questions\"\n• \"An enterprise procurement manager who's been burned by vendors before\""
    }
  ]);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedProspect, setGeneratedProspect] = useState<GeneratedProspect | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const generateProspect = (userDescription: string): GeneratedProspect => {
    // Simulated AI generation based on user input
    const names = ["Alex Morgan", "Jordan Taylor", "Casey Rivera", "Sam Chen", "Riley Johnson"];
    const roles = ["VP of Sales", "CTO", "Head of Operations", "Director of Marketing", "CFO"];
    const companies = ["TechFlow", "SalesForce", "Innovate Corp", "DataDrive", "CloudScale"];
    const personalities = ["skeptical", "friendly", "busy", "analytical", "aggressive"];
    const callTypes = ["cold", "warm", "discovery"];

    const lowerInput = userDescription.toLowerCase();
    
    let personality = "neutral";
    if (lowerInput.includes("skeptical") || lowerInput.includes("tough")) personality = "skeptical";
    if (lowerInput.includes("friendly") || lowerInput.includes("nice")) personality = "friendly";
    if (lowerInput.includes("busy") || lowerInput.includes("rushed")) personality = "busy";
    if (lowerInput.includes("aggressive") || lowerInput.includes("rude")) personality = "aggressive";

    let callType = "cold";
    if (lowerInput.includes("follow-up") || lowerInput.includes("warm")) callType = "warm";
    if (lowerInput.includes("discovery")) callType = "discovery";

    return {
      name: names[Math.floor(Math.random() * names.length)],
      role: lowerInput.includes("cto") ? "CTO" : 
            lowerInput.includes("vp") ? "VP of Sales" :
            lowerInput.includes("cfo") ? "CFO" :
            roles[Math.floor(Math.random() * roles.length)],
      company: companies[Math.floor(Math.random() * companies.length)],
      personality,
      callType,
      description: `${userDescription}. This prospect will challenge you on key objections and help you practice real-world scenarios.`
    };
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsGenerating(true);

    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const prospect = generateProspect(input);
    setGeneratedProspect(prospect);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Perfect! I've created a prospect based on your description:\n\n**${prospect.name}**\n${prospect.role} @ ${prospect.company}\n\n• Personality: ${prospect.personality}\n• Call Type: ${prospect.callType}\n• ${prospect.description}\n\nWould you like to start a roleplay with this prospect, make changes, or create a different one?`
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsGenerating(false);
  };

  const handleConfirm = () => {
    if (generatedProspect) {
      onProspectCreated(generatedProspect);
      toast.success(`Created prospect: ${generatedProspect.name}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="border-primary/30 shadow-xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Sparkles className="w-5 h-5 text-primary" />
            Create Prospect with AI
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Messages */}
        <div className="h-64 overflow-y-auto space-y-4 p-2 bg-muted/30 rounded-xl">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-primary" />
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl p-3 ${
                message.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-br-md" 
                  : "bg-card border border-border rounded-bl-md"
              }`}>
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}
          {isGenerating && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary animate-pulse" />
              </div>
              <div className="bg-card border border-border rounded-2xl rounded-bl-md p-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-primary/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Generated Prospect Preview */}
        {generatedProspect && (
          <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-bold text-primary">
                  {generatedProspect.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-semibold">{generatedProspect.name}</p>
                  <p className="text-xs text-muted-foreground">{generatedProspect.role} @ {generatedProspect.company}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary">{generatedProspect.callType}</Badge>
                <Badge variant="outline">{generatedProspect.personality}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleConfirm} className="flex-1 gap-2">
                <Phone className="w-4 h-4" />
                Start Roleplay
              </Button>
              <Button variant="outline" onClick={() => setGeneratedProspect(null)}>
                Create Different
              </Button>
            </div>
          </div>
        )}

        {/* Input */}
        <div className="flex gap-2">
          <Input
            placeholder="Describe the prospect you want to practice with..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isGenerating}
          />
          <Button onClick={handleSend} disabled={!input.trim() || isGenerating}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatProspectCreator;

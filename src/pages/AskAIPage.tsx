import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Sparkles, 
  MessageSquare, 
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Target,
  Users,
  Phone,
  BarChart3,
  ChevronRight,
  Loader2,
  Bot,
  User,
  Lightbulb,
  Copy,
  ThumbsUp,
  ThumbsDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  insights?: AIInsight[];
}

interface AIInsight {
  type: "metric" | "recommendation" | "warning" | "trend";
  title: string;
  value?: string;
  description: string;
}

const suggestedQuestions = [
  {
    icon: TrendingDown,
    question: "Why did our close rate drop last week?",
    category: "Performance"
  },
  {
    icon: AlertCircle,
    question: "What's the biggest performance gap on my team?",
    category: "Analysis"
  },
  {
    icon: Users,
    question: "Which rep improved the most this month?",
    category: "Comparison"
  },
  {
    icon: Target,
    question: "What objections are we struggling with?",
    category: "Training"
  },
  {
    icon: Phone,
    question: "Show me calls where we lost deals",
    category: "Calls"
  },
  {
    icon: BarChart3,
    question: "Compare live calls vs AI roleplay scores",
    category: "Metrics"
  },
];

const exampleResponses: Record<string, Message> = {
  "biggest performance gap": {
    id: "resp-1",
    role: "assistant",
    content: `Based on my analysis of the last 30 days, here's what I found:

**Biggest Performance Gap: Closing Technique**

Your team scores an average of **72%** on closing, which is **18 points below** your discovery scores. This is the largest skill gap I've identified.

**Key Findings:**
• Only 3 out of 8 reps consistently ask for next steps
• 45% of calls end without a clear call-to-action
• Reps who use trial closes score 23% higher on conversions

**Recommended Actions:**
1. Schedule closing technique training session
2. Assign AI roleplays focused on trial closes
3. Review top performer Marcus Johnson's closing calls`,
    timestamp: new Date(),
    insights: [
      { type: "metric", title: "Closing Score", value: "72%", description: "18 points below discovery" },
      { type: "warning", title: "Action Gap", value: "45%", description: "Calls without clear CTA" },
      { type: "recommendation", title: "Suggested Action", value: "", description: "Schedule closing training" },
    ]
  },
  "close rate drop": {
    id: "resp-2",
    role: "assistant",
    content: `I analyzed your close rate trends and found the cause:

**Close Rate Drop: -12% week-over-week**

The drop is primarily attributed to:

**1. Talk Ratio Issues (Main Cause)**
Your team's average talk ratio increased from 40% to 52% last week. Reps are talking too much and listening too little.

**2. Discovery Quality Decline**
Open-ended questions decreased by 35%. Reps are jumping to pitches too quickly.

**3. New Rep Onboarding**
2 new reps joined and are still ramping. Their close rate is 15% vs team avg of 28%.

**Quick Wins:**
• Review last week's lost deals - I found 3 common objections
• Increase AI roleplay frequency for new reps
• Run a "listen more" challenge this week`,
    timestamp: new Date(),
    insights: [
      { type: "trend", title: "Close Rate", value: "-12%", description: "Week-over-week decline" },
      { type: "warning", title: "Talk Ratio", value: "52%", description: "Up from 40% target" },
      { type: "recommendation", title: "Focus Area", value: "", description: "Improve discovery quality" },
    ]
  },
};

const AskAIPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (question?: string) => {
    const messageText = question || inputValue;
    if (!messageText.trim()) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: messageText,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Find matching example response or generate generic one
    const matchKey = Object.keys(exampleResponses).find(key => 
      messageText.toLowerCase().includes(key)
    );

    const aiResponse: Message = matchKey ? exampleResponses[matchKey] : {
      id: `resp-${Date.now()}`,
      role: "assistant",
      content: `I've analyzed your call data for that question. Here's what I found:

**Summary**
Based on ${Math.floor(Math.random() * 100) + 50} calls from the past 30 days, your team is performing at **${Math.floor(Math.random() * 15) + 75}%** overall.

**Key Observations:**
• Discovery scores are strongest at 85%
• Objection handling needs improvement at 68%
• Top performers are outpacing avg by 15 points

**Next Steps:**
1. Review the calls I've flagged for coaching opportunities
2. Consider assigning targeted AI roleplays
3. Schedule 1:1 reviews with reps below benchmark

Would you like me to drill down into any specific area?`,
      timestamp: new Date(),
      insights: [
        { type: "metric" as const, title: "Team Score", value: `${Math.floor(Math.random() * 15) + 75}%`, description: "30-day average" },
        { type: "recommendation" as const, title: "Action", value: "", description: "Review flagged calls" },
      ]
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiResponse]);
  };

  const handleCopyResponse = (content: string) => {
    navigator.clipboard.writeText(content);
    toast.success("Response copied to clipboard");
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">Ask AI Sales Manager</h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          Ask natural-language questions about your team's performance, diagnose gaps, and get actionable insights.
        </p>
      </div>

      {/* Chat Container */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {messages.length === 0 ? (
            <div className="py-8">
              <p className="text-center text-muted-foreground mb-6">
                Try asking one of these questions to get started:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {suggestedQuestions.map((sq, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(sq.question)}
                    className="flex items-start gap-3 p-4 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 text-left transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                      <sq.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Badge variant="secondary" className="mb-2 text-xs">{sq.category}</Badge>
                      <p className="text-sm font-medium">{sq.question}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={cn(
                      "max-w-[80%] rounded-2xl p-4",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                  >
                    <div className="prose prose-sm max-w-none">
                      {message.content.split("\n").map((line, i) => {
                        if (line.startsWith("**") && line.endsWith("**")) {
                          return <p key={i} className="font-bold my-2">{line.replace(/\*\*/g, "")}</p>;
                        }
                        if (line.startsWith("•")) {
                          return <p key={i} className="ml-4 my-1">{line}</p>;
                        }
                        if (line.match(/^\d\./)) {
                          return <p key={i} className="ml-4 my-1">{line}</p>;
                        }
                        return <p key={i} className="my-1">{line}</p>;
                      })}
                    </div>
                    {message.role === "assistant" && message.insights && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border/50">
                        {message.insights.map((insight, i) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className={cn(
                              "gap-1",
                              insight.type === "warning" && "bg-warning/10 text-warning",
                              insight.type === "trend" && "bg-destructive/10 text-destructive",
                              insight.type === "metric" && "bg-primary/10 text-primary",
                              insight.type === "recommendation" && "bg-success/10 text-success"
                            )}
                          >
                            {insight.type === "warning" && <AlertCircle className="w-3 h-3" />}
                            {insight.type === "trend" && <TrendingDown className="w-3 h-3" />}
                            {insight.type === "metric" && <BarChart3 className="w-3 h-3" />}
                            {insight.type === "recommendation" && <Lightbulb className="w-3 h-3" />}
                            {insight.title}: {insight.value || insight.description}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {message.role === "assistant" && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border/50">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => handleCopyResponse(message.content)}
                        >
                          <Copy className="w-3 h-3" />
                          Copy
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => toast.success("Thanks for the feedback!")}
                        >
                          <ThumbsUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 gap-1 text-xs"
                          onClick={() => toast.info("We'll improve this response")}
                        >
                          <ThumbsDown className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {message.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">Analyzing your data...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Input */}
      <div className="flex gap-3">
        <Input
          placeholder="Ask anything about your team's performance..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button onClick={() => handleSend()} disabled={!inputValue.trim() || isTyping}>
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Example Questions */}
      {messages.length > 0 && (
        <div className="mt-6">
          <p className="text-sm text-muted-foreground mb-3">More questions to try:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 4).map((sq, i) => (
              <Button
                key={i}
                variant="outline"
                size="sm"
                className="text-xs"
                onClick={() => handleSend(sq.question)}
              >
                {sq.question}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AskAIPage;

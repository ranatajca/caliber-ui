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
  ThumbsDown,
  Zap,
  Award,
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";

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

// Manager-focused questions
const managerQuestions = [
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

// Rep-focused questions for personal coaching
const repQuestions = [
  {
    icon: Target,
    question: "How can I improve my discovery questions?",
    category: "Coaching"
  },
  {
    icon: TrendingUp,
    question: "What am I doing well on my calls?",
    category: "Strengths"
  },
  {
    icon: AlertCircle,
    question: "What's my biggest weakness right now?",
    category: "Growth"
  },
  {
    icon: Zap,
    question: "Give me tips for handling price objections",
    category: "Objections"
  },
  {
    icon: BookOpen,
    question: "What roleplay should I practice next?",
    category: "Practice"
  },
  {
    icon: Award,
    question: "How do I compare to top performers?",
    category: "Benchmark"
  },
];

// Manager example responses
const managerResponses: Record<string, Message> = {
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

// Rep example responses
const repResponses: Record<string, Message> = {
  "improve my discovery": {
    id: "resp-rep-1",
    role: "assistant",
    content: `Great question! Here's how you can level up your discovery:

**Your Current Discovery Score: 74%**

You're doing well at building rapport, but I noticed some opportunities:

**Areas to Improve:**
• You ask an average of 3 open-ended questions per call - aim for 5-7
• Try the "tell me more" technique when prospects give short answers
• Your discovery phase averages 2.5 minutes - top performers spend 4-5 minutes

**Specific Tips:**
1. Start with broader situational questions before diving into pain points
2. Use the SPICED framework: Situation → Pain → Impact → Critical Event → Decision
3. Pause for 3 seconds after questions - you tend to fill silence too quickly

**Practice Suggestion:**
I recommend the "Discovery Deep Dive" roleplay with a hesitant CFO persona. This will help you practice extracting information from guarded prospects.`,
    timestamp: new Date(),
    insights: [
      { type: "metric", title: "Discovery Score", value: "74%", description: "Room for improvement" },
      { type: "recommendation", title: "Focus", value: "", description: "More open-ended questions" },
    ]
  },
  "doing well": {
    id: "resp-rep-2",
    role: "assistant",
    content: `Here's what you're crushing it on, Saad! 🎉

**Your Top Strengths:**

**1. Rapport Building - 92%**
You're excellent at creating a comfortable atmosphere. Prospects often mention feeling understood.

**2. Objection Handling - 85%**
When you get price objections, you successfully redirect to value 80% of the time.

**3. Active Listening - 88%**
Your talk ratio (38%) is better than 75% of the team. You let prospects speak.

**Recent Wins:**
• Last Tuesday's call with Marcus Chen - perfect discovery flow
• You closed 2 deals this week using the "cost of inaction" technique
• Your NPS from prospects is 8.5/10

**Keep Doing:**
• Your "mirroring" technique in discovery
• The way you summarize before transitioning to next steps
• Your energy level in the first 30 seconds`,
    timestamp: new Date(),
    insights: [
      { type: "metric", title: "Rapport", value: "92%", description: "Your top skill" },
      { type: "metric", title: "Talk Ratio", value: "38%", description: "Better than 75% of team" },
    ]
  },
  "biggest weakness": {
    id: "resp-rep-3",
    role: "assistant",
    content: `Let's turn this into an opportunity:

**Your Biggest Growth Area: Closing**

Your closing score is **68%**, which is your lowest category.

**What I've Noticed:**
• You often get to the end of calls without a clear next step
• Only 60% of your calls have a confirmed calendar invite at the end
• You hesitate when it's time to ask for the commitment

**Why This Matters:**
Prospects who don't book next steps within 24 hours are 40% less likely to close.

**Action Plan:**
1. Practice trial closes mid-call: "Based on what you've shared, would this be valuable?"
2. Always propose a specific date/time, not "let's find a time"
3. Try the assumptive close: "I'll send over the proposal - does Tuesday or Wednesday work for our next call?"

**Roleplay Assignment:**
I've queued up 3 "Closing Mastery" roleplays for you. The first one focuses on the hesitant buyer who needs a gentle push.`,
    timestamp: new Date(),
    insights: [
      { type: "warning", title: "Closing Score", value: "68%", description: "Needs improvement" },
      { type: "recommendation", title: "Next Step", value: "", description: "Practice trial closes" },
    ]
  },
  "price objection": {
    id: "resp-rep-4",
    role: "assistant",
    content: `Price objections are common - here's your playbook:

**Your Price Objection Success Rate: 72%**

**Top Techniques That Work for You:**

**1. The "Cost of Inaction" Play**
When you've used this technique, your success rate jumps to 85%.
"What's it costing you each month to *not* solve this problem?"

**2. Break It Down**
Works 78% of the time: "That's $X per day, less than your team's coffee budget"

**3. ROI Redirect**
"You mentioned losing 5 hours/week on this. At your team's hourly rate, that's $Y/month - we'd pay for ourselves in 2 months"

**Phrases to Avoid:**
• "I understand price is a concern" (sounds scripted)
• "Let me check if I can get a discount" (kills your leverage)

**Practice This:**
Try the "Budget-Conscious CFO" roleplay - it specifically drills price objection handling with a tough negotiator.`,
    timestamp: new Date(),
    insights: [
      { type: "metric", title: "Objection Win Rate", value: "72%", description: "On price objections" },
      { type: "recommendation", title: "Best Technique", value: "85%", description: "Cost of Inaction" },
    ]
  },
};

const AskAIPage = () => {
  const { isManager } = useRole();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = isManager ? managerQuestions : repQuestions;
  const exampleResponses = isManager ? managerResponses : repResponses;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Clear messages when role changes
  useEffect(() => {
    setMessages([]);
  }, [isManager]);

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
      content: isManager 
        ? `I've analyzed your team's call data for that question. Here's what I found:

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

Would you like me to drill down into any specific area?`
        : `Based on your recent calls, here's my analysis:

**Your Performance Summary**
Looking at your last ${Math.floor(Math.random() * 15) + 10} calls, you're scoring **${Math.floor(Math.random() * 10) + 75}%** overall.

**What You're Doing Well:**
• Your rapport building is solid at 88%
• You've improved talk ratio by 5% this week
• Great job on the discovery in your last 3 calls

**Opportunities:**
• Try asking one more follow-up question before pitching
• Consider using the "feel, felt, found" technique for objections
• Your closing could be more assertive

**Suggested Practice:**
I'd recommend the "Assertive Close" roleplay to work on that last point.

Want me to break down any of these areas further?`,
      timestamp: new Date(),
      insights: isManager 
        ? [
            { type: "metric" as const, title: "Team Score", value: `${Math.floor(Math.random() * 15) + 75}%`, description: "30-day average" },
            { type: "recommendation" as const, title: "Action", value: "", description: "Review flagged calls" },
          ]
        : [
            { type: "metric" as const, title: "Your Score", value: `${Math.floor(Math.random() * 10) + 75}%`, description: "Recent performance" },
            { type: "recommendation" as const, title: "Practice", value: "", description: "Assertive Close roleplay" },
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
        <div className={cn(
          "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4",
          isManager 
            ? "bg-gradient-to-br from-primary to-accent" 
            : "bg-gradient-to-br from-accent to-primary"
        )}>
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-3xl font-display font-bold">
          {isManager ? "Ask AI Sales Manager" : "AI Sales Coach"}
        </h1>
        <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
          {isManager 
            ? "Ask natural-language questions about your team's performance, diagnose gaps, and get actionable insights."
            : "Get personalized coaching, improve your skills, and learn what top performers do differently."
          }
        </p>
      </div>

      {/* Chat Container */}
      <Card className="mb-6">
        <CardContent className="p-4">
          {messages.length === 0 ? (
            <div className="py-8">
              <p className="text-center text-muted-foreground mb-6">
                {isManager 
                  ? "Try asking one of these questions to analyze your team:"
                  : "Ask me anything about improving your sales skills:"
                }
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
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                      isManager 
                        ? "bg-gradient-to-br from-primary to-accent"
                        : "bg-gradient-to-br from-accent to-primary"
                    )}>
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
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center",
                    isManager 
                      ? "bg-gradient-to-br from-primary to-accent"
                      : "bg-gradient-to-br from-accent to-primary"
                  )}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-muted rounded-2xl p-4">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-sm text-muted-foreground">
                        {isManager ? "Analyzing team data..." : "Analyzing your performance..."}
                      </span>
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
          placeholder={isManager 
            ? "Ask anything about your team's performance..." 
            : "Ask for coaching tips, feedback, or practice suggestions..."
          }
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

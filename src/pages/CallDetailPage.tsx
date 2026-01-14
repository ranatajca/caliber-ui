import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Phone, 
  Share2, 
  Play, 
  Pause, 
  Volume2, 
  MoreVertical,
  Download,
  Copy,
  User,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Sparkles,
  RefreshCw,
  MessageSquare,
  Send,
  Bell,
  Target,
  TrendingUp,
  TrendingDown,
  Mic,
  Headphones,
  Zap,
  Award,
  BookOpen,
  Flag,
  ThumbsUp,
  ThumbsDown,
  Quote,
  BarChart3
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "summary" | "scorecard" | "transcript" | "insights" | "feedback";

interface TranscriptMessage {
  id: string;
  speaker: "rep" | "buyer";
  message: string;
  timestamp: string;
  sentiment?: "positive" | "negative" | "neutral";
  highlight?: "objection" | "discovery" | "commitment" | "pain";
}

const mockTranscript: TranscriptMessage[] = [
  { id: "1", speaker: "rep", message: "Hey, Jane. This is Tom from Caliber. I promise to be brief - I know this is a cold call. I noticed you run outbound sales at Agile. Would you give me 30 seconds?", timestamp: "0:00", sentiment: "neutral" },
  { id: "2", speaker: "buyer", message: "Look, I'm really busy right now. What's this about?", timestamp: "0:12", sentiment: "negative", highlight: "objection" },
  { id: "3", speaker: "rep", message: "Totally understand. Quick question - when it comes to your outbound calls, are you hitting your connection rates? I'm curious what you're seeing.", timestamp: "0:18", sentiment: "neutral", highlight: "discovery" },
  { id: "4", speaker: "buyer", message: "Our connection rates are fine. We use a standard dialer and it works.", timestamp: "0:32", sentiment: "neutral" },
  { id: "5", speaker: "rep", message: "Got it. So if you could wave a magic wand and improve one thing about your SDR team's performance, what would it be?", timestamp: "0:41", sentiment: "positive", highlight: "discovery" },
  { id: "6", speaker: "buyer", message: "Honestly? Ramp time. It takes forever to get new reps productive. But I don't see how you can help with that.", timestamp: "0:55", sentiment: "negative", highlight: "pain" },
  { id: "7", speaker: "rep", message: "That's actually exactly what we focus on. We help companies cut ramp time by 40% through AI-powered roleplay and coaching. What does your current onboarding process look like?", timestamp: "1:08", sentiment: "positive" },
  { id: "8", speaker: "buyer", message: "We do some shadowing, then they get on calls. Takes about 3 months before they're really performing.", timestamp: "1:22", sentiment: "neutral" },
  { id: "9", speaker: "rep", message: "Three months is pretty standard. What if I told you we could get that down to 6 weeks? Would that be worth a 15-minute conversation?", timestamp: "1:35", sentiment: "positive", highlight: "commitment" },
  { id: "10", speaker: "buyer", message: "Hmm, if you can actually do that... yeah, I'd be open to hearing more. But I need to see proof.", timestamp: "1:48", sentiment: "positive", highlight: "commitment" },
];

const CallDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("summary");
  const [isPlaying, setIsPlaying] = useState(false);
  const [expandedCriteria, setExpandedCriteria] = useState<string | null>(null);

  const tabs: { id: Tab; label: string }[] = [
    { id: "summary", label: "Summary" },
    { id: "scorecard", label: "Scorecard" },
    { id: "transcript", label: "Transcript" },
    { id: "insights", label: "AI Insights" },
    { id: "feedback", label: "Review" },
  ];

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/calls")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base md:text-xl font-display font-bold">Discovery Call with Jane Bowen</h1>
              <Badge variant="secondary" className="bg-purple-100 text-purple-700">Discovery</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs md:text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                Jan 10, 2:30 PM
              </span>
              <span className="hidden sm:inline">Director of Sales @ Agile Solutions</span>
              <span className="flex items-center gap-1">
                <Play className="w-3 h-3 md:w-4 md:h-4" />
                4:24
              </span>
              <span className="px-2 py-0.5 rounded-full text-white text-xs font-medium" style={{ backgroundColor: "#6366F1" }}>
                Sarah Chen
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          <Button variant="outline" size="sm" className="gap-2 flex-1 sm:flex-none" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
          }}>
            <Share2 className="w-4 h-4" />
            <span className="hidden sm:inline">Share</span>
          </Button>
          <Button size="sm" className="gap-2 flex-1 sm:flex-none" onClick={() => navigate("/roleplays")}>
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Practice Again</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Audio Player */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-12 w-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </Button>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-sm font-mono">0:00</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="w-0 h-full bg-primary rounded-full" />
                    </div>
                    <span className="text-sm font-mono text-muted-foreground">4:24</span>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <TimeMarker time="0:12" label="Objection" type="objection" />
                    <TimeMarker time="0:41" label="Discovery" type="discovery" active />
                    <TimeMarker time="0:55" label="Pain Point" type="pain" />
                    <TimeMarker time="1:35" label="Commitment" type="commitment" />
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => toast.info("Volume controls")}>
                  <Volume2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => toast.info("More options coming soon!")}>
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="flex gap-2 border-b border-border pb-0 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap",
                  activeTab === tab.id
                    ? "text-primary border-primary"
                    : "text-muted-foreground border-transparent hover:text-foreground"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "summary" && <SummaryTab />}
            {activeTab === "scorecard" && <ScorecardTab expandedCriteria={expandedCriteria} setExpandedCriteria={setExpandedCriteria} />}
            {activeTab === "transcript" && <TranscriptTab messages={mockTranscript} />}
            {activeTab === "insights" && <InsightsTab />}
            {activeTab === "feedback" && <FeedbackTab />}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-accent p-6 text-center text-white">
              <p className="text-sm font-medium opacity-90 mb-2">Overall Score</p>
              <p className="text-5xl font-bold">82</p>
              <p className="text-sm opacity-75 mt-2">Above Average</p>
            </div>
            <CardContent className="p-4 space-y-3">
              <ScoreMetric label="Talk/Listen Ratio" value="38%" target="<40%" status="good" />
              <ScoreMetric label="Discovery Questions" value="6" target="5+" status="good" />
              <ScoreMetric label="Filler Words" value="12" target="<10" status="warning" />
              <ScoreMetric label="Talk Speed" value="142 wpm" target="120-150" status="good" />
              <ScoreMetric label="Longest Monologue" value="45s" target="<30s" status="warning" />
            </CardContent>
          </Card>

          {/* Buyer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Prospect Profile</CardTitle>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">Jane Bowen</h3>
                  <p className="text-sm text-muted-foreground">Director of Sales</p>
                  <p className="text-xs text-muted-foreground">Agile Solutions</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Engagement Level</span>
                  <span className="font-medium text-success">High</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Buyer Sentiment</span>
                  <span className="font-medium text-warning">Skeptical → Interested</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Decision Authority</span>
                  <span className="font-medium">Influencer</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-border">
                <Badge variant="secondary">Results-oriented</Badge>
                <Badge variant="secondary">Time-conscious</Badge>
                <Badge variant="secondary">Data-driven</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast.success("Re-analyzing call...")}>
                <RefreshCw className="w-4 h-4" />
                Re-Analyze Call
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => toast.success("Recording downloaded!")}>
                <Download className="w-4 h-4" />
                Download Recording
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => {
                navigator.clipboard.writeText("Full transcript copied...");
                toast.success("Transcript copied to clipboard!");
              }}>
                <Copy className="w-4 h-4" />
                Copy Transcript
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TimeMarker = ({ time, label, type, active }: { time: string; label: string; type?: string; active?: boolean }) => {
  const getTypeStyle = () => {
    switch (type) {
      case "objection": return "bg-red-50 text-red-700 border-red-200";
      case "discovery": return "bg-blue-50 text-blue-700 border-blue-200";
      case "pain": return "bg-orange-50 text-orange-700 border-orange-200";
      case "commitment": return "bg-green-50 text-green-700 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <button className={cn(
      "px-2 py-1 rounded text-xs font-medium transition-colors border",
      active ? "ring-2 ring-primary ring-offset-1" : "",
      getTypeStyle()
    )}>
      {label} {time}
    </button>
  );
};

const ScoreMetric = ({ label, value, target, status }: { label: string; value: string; target: string; status: "good" | "warning" | "bad" }) => (
  <div className="flex items-center justify-between">
    <div>
      <span className="text-sm">{label}</span>
      <p className="text-xs text-muted-foreground">Target: {target}</p>
    </div>
    <div className="flex items-center gap-2">
      <span className="font-medium">{value}</span>
      <div className={cn(
        "w-2 h-2 rounded-full",
        status === "good" && "bg-success",
        status === "warning" && "bg-warning",
        status === "bad" && "bg-destructive"
      )} />
    </div>
  </div>
);

const SummaryTab = () => (
  <div className="space-y-6">
    {/* Call Overview */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          Call Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          Strong discovery call where the rep successfully navigated initial resistance and uncovered a critical pain point around new rep ramp time. 
          The prospect showed genuine interest after learning about the 40% ramp time reduction. Call ended with a commitment to a follow-up demo.
        </p>
        
        <div className="grid grid-cols-3 gap-4 py-4">
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-primary">6</p>
            <p className="text-xs text-muted-foreground">Discovery Questions</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-warning">2</p>
            <p className="text-xs text-muted-foreground">Objections Handled</p>
          </div>
          <div className="text-center p-3 bg-muted/50 rounded-lg">
            <p className="text-2xl font-bold text-success">1</p>
            <p className="text-xs text-muted-foreground">Commitment Gained</p>
          </div>
        </div>
      </CardContent>
    </Card>

    {/* What Went Well / Improve */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-success/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-success">
            <ThumbsUp className="w-4 h-4" />
            Strengths
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <StrengthItem 
            title="Pattern Interrupt Opening" 
            description="Acknowledged it was a cold call upfront, reducing defensiveness"
            timestamp="0:00"
          />
          <StrengthItem 
            title="Magic Wand Question" 
            description="Excellent open-ended question that uncovered the real pain"
            timestamp="0:41"
          />
          <StrengthItem 
            title="Quantified Value Prop" 
            description="Specific 40% improvement claim with timeline"
            timestamp="1:08"
          />
          <StrengthItem 
            title="Soft Close" 
            description="Asked for 15 minutes, not a full demo - low commitment ask"
            timestamp="1:35"
          />
        </CardContent>
      </Card>

      <Card className="border-warning/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2 text-warning">
            <Target className="w-4 h-4" />
            Areas to Improve
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <ImprovementItem 
            title="Filler Words" 
            description="Said 'um' and 'like' 12 times - practice pausing instead"
            priority="high"
          />
          <ImprovementItem 
            title="Longest Monologue" 
            description="45-second stretch without checking in - aim for under 30s"
            priority="medium"
          />
          <ImprovementItem 
            title="Deeper Pain Exploration" 
            description="Could have asked about cost of slow ramp time"
            priority="medium"
          />
          <ImprovementItem 
            title="Multi-threading" 
            description="Didn't ask who else should be involved in the conversation"
            priority="low"
          />
        </CardContent>
      </Card>
    </div>

    {/* Key Moments */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flag className="w-5 h-5 text-primary" />
          Key Moments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <KeyMoment 
          timestamp="0:12" 
          type="objection" 
          title="Initial Brush-off" 
          quote="Look, I'm really busy right now."
          response="Handled well - acknowledged and pivoted to value"
        />
        <KeyMoment 
          timestamp="0:55" 
          type="pain" 
          title="Pain Point Uncovered" 
          quote="Honestly? Ramp time. It takes forever to get new reps productive."
          response="Great discovery - this is a coachable moment"
        />
        <KeyMoment 
          timestamp="1:48" 
          type="commitment" 
          title="Interest Confirmed" 
          quote="Yeah, I'd be open to hearing more. But I need to see proof."
          response="Positive outcome - commitment with a condition"
        />
      </CardContent>
    </Card>

    {/* Action Items */}
    <Card>
      <CardHeader>
        <CardTitle>Follow-up Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ActionItem completed text="Send case study on ramp time reduction" dueDate="Today" />
        <ActionItem text="Schedule 15-min demo with Jane" dueDate="Within 48 hrs" />
        <ActionItem text="Research Agile Solutions tech stack" dueDate="Before demo" />
        <ActionItem text="Prepare ROI calculator for 3-month vs 6-week ramp" dueDate="Before demo" />
      </CardContent>
    </Card>
  </div>
);

const StrengthItem = ({ title, description, timestamp }: { title: string; description: string; timestamp: string }) => (
  <div className="flex gap-3 p-3 bg-success/5 rounded-lg border border-success/20">
    <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">{title}</p>
        <span className="text-xs text-muted-foreground font-mono">{timestamp}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

const ImprovementItem = ({ title, description, priority }: { title: string; description: string; priority: "high" | "medium" | "low" }) => (
  <div className="flex gap-3 p-3 bg-warning/5 rounded-lg border border-warning/20">
    <AlertTriangle className={cn(
      "w-4 h-4 mt-0.5 flex-shrink-0",
      priority === "high" ? "text-destructive" : priority === "medium" ? "text-warning" : "text-muted-foreground"
    )} />
    <div className="flex-1">
      <div className="flex items-center justify-between">
        <p className="font-medium text-sm">{title}</p>
        <Badge variant="outline" className={cn(
          "text-xs",
          priority === "high" ? "border-destructive text-destructive" : 
          priority === "medium" ? "border-warning text-warning" : 
          "border-muted-foreground text-muted-foreground"
        )}>
          {priority}
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
    </div>
  </div>
);

const KeyMoment = ({ timestamp, type, title, quote, response }: { 
  timestamp: string; 
  type: "objection" | "pain" | "commitment"; 
  title: string; 
  quote: string;
  response: string;
}) => {
  const getTypeStyle = () => {
    switch (type) {
      case "objection": return { bg: "bg-red-50", border: "border-red-200", text: "text-red-700" };
      case "pain": return { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700" };
      case "commitment": return { bg: "bg-green-50", border: "border-green-200", text: "text-green-700" };
    }
  };
  const style = getTypeStyle();

  return (
    <div className={cn("p-4 rounded-lg border", style.bg, style.border)}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-mono text-muted-foreground">{timestamp}</span>
        <Badge variant="secondary" className={cn("text-xs", style.text)}>{type}</Badge>
        <span className="font-medium text-sm">{title}</span>
      </div>
      <blockquote className="text-sm italic text-muted-foreground border-l-2 border-muted-foreground/30 pl-3 mb-2">
        "{quote}"
      </blockquote>
      <p className="text-xs text-muted-foreground">💡 {response}</p>
    </div>
  );
};

const ActionItem = ({ completed, text, dueDate }: { completed?: boolean; text: string; dueDate: string }) => (
  <div className={cn(
    "p-3 rounded-lg border transition-colors",
    completed ? "bg-success/5 border-success/20" : "bg-card border-border hover:border-primary/30"
  )}>
    <div className="flex items-center gap-3">
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
        completed ? "bg-success border-success" : "border-muted-foreground"
      )}>
        {completed && <CheckCircle className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1">
        <p className={cn("text-sm", completed && "line-through text-muted-foreground")}>{text}</p>
      </div>
      <span className={cn("text-xs", completed ? "text-muted-foreground" : "text-primary font-medium")}>{dueDate}</span>
    </div>
  </div>
);

const ScorecardTab = ({ 
  expandedCriteria, 
  setExpandedCriteria 
}: { 
  expandedCriteria: string | null; 
  setExpandedCriteria: (id: string | null) => void;
}) => {
  const criteria = [
    {
      id: "opener",
      name: "Opening",
      score: 4,
      maxScore: 5,
      items: [
        { text: "Pattern interrupt or permission-based opener", passed: true, note: "Asked for 30 seconds" },
        { text: "Clear value proposition in first 30 seconds", passed: true, note: "Mentioned running outbound sales" },
        { text: "Personalized based on research", passed: true, note: "Referenced their role" },
        { text: "Confident tone and pacing", passed: true, note: "Good energy" },
        { text: "Named a relevant trigger or insight", passed: false, note: "Could have mentioned industry trend" },
      ]
    },
    {
      id: "discovery",
      name: "Discovery",
      score: 5,
      maxScore: 6,
      items: [
        { text: "Asked about current situation", passed: true, note: "Connection rates question" },
        { text: "Uncovered a pain point", passed: true, note: "Ramp time identified" },
        { text: "Quantified the impact of the pain", passed: false, note: "Didn't ask about cost" },
        { text: "Asked open-ended questions", passed: true, note: "Magic wand question" },
        { text: "Used active listening", passed: true, note: "Acknowledged responses" },
        { text: "Explored decision-making process", passed: true, note: "Implied timeline" },
      ]
    },
    {
      id: "objection",
      name: "Objection Handling",
      score: 3,
      maxScore: 4,
      items: [
        { text: "Acknowledged the objection", passed: true, note: "Said 'Totally understand'" },
        { text: "Asked clarifying questions", passed: true, note: "Pivoted to discovery" },
        { text: "Provided relevant proof points", passed: false, note: "No case study mentioned" },
        { text: "Confirmed resolution", passed: true, note: "Moved conversation forward" },
      ]
    },
    {
      id: "value",
      name: "Value Articulation",
      score: 4,
      maxScore: 5,
      items: [
        { text: "Connected solution to specific pain", passed: true, note: "Ramp time reduction" },
        { text: "Used specific numbers/metrics", passed: true, note: "40% improvement" },
        { text: "Mentioned social proof", passed: false, note: "No customer examples" },
        { text: "Created urgency", passed: true, note: "6 weeks vs 3 months" },
        { text: "Differentiated from alternatives", passed: true, note: "AI-powered approach" },
      ]
    },
    {
      id: "closing",
      name: "Closing",
      score: 4,
      maxScore: 4,
      items: [
        { text: "Asked for a clear next step", passed: true, note: "15-minute conversation" },
        { text: "Low commitment initial ask", passed: true, note: "Just 15 minutes" },
        { text: "Confirmed interest before closing", passed: true, note: "Checked if worth it" },
        { text: "Got verbal commitment", passed: true, note: "Prospect agreed" },
      ]
    },
    {
      id: "communication",
      name: "Communication",
      score: 3,
      maxScore: 5,
      items: [
        { text: "Appropriate talk-to-listen ratio", passed: true, note: "38% talk time" },
        { text: "Minimal filler words", passed: false, note: "12 filler words detected" },
        { text: "Appropriate pacing", passed: true, note: "142 wpm" },
        { text: "Avoided monologues", passed: false, note: "45s longest stretch" },
        { text: "Used prospect's name", passed: true, note: "Used 'Jane' twice" },
      ]
    },
  ];

  const totalScore = criteria.reduce((sum, c) => sum + c.score, 0);
  const maxScore = criteria.reduce((sum, c) => sum + c.maxScore, 0);
  const percentage = Math.round((totalScore / maxScore) * 100);

  return (
    <div className="space-y-6">
      {/* Overall Score Bar */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold">Scorecard Result</h3>
              <p className="text-sm text-muted-foreground">Based on 6 scoring categories</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold">{totalScore}/{maxScore}</p>
              <p className="text-sm text-muted-foreground">{percentage}% score</p>
            </div>
          </div>
          <Progress value={percentage} className="h-3" />
        </CardContent>
      </Card>

      {/* Criteria Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {criteria.map((cat) => (
          <Card key={cat.id} className={cn(
            "transition-shadow",
            cat.score === cat.maxScore ? "border-success/30" : cat.score >= cat.maxScore * 0.7 ? "border-warning/30" : "border-destructive/30"
          )}>
            <CardContent className="p-4">
              <button 
                className="w-full text-left"
                onClick={() => setExpandedCriteria(expandedCriteria === cat.id ? null : cat.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-bold",
                      cat.score === cat.maxScore ? "text-success" : cat.score >= cat.maxScore * 0.7 ? "text-warning" : "text-destructive"
                    )}>
                      {cat.score}/{cat.maxScore}
                    </span>
                    {expandedCriteria === cat.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
                <Progress value={(cat.score / cat.maxScore) * 100} className="h-2" />
              </button>
              {expandedCriteria === cat.id && (
                <div className="space-y-2 pt-4 mt-4 border-t border-border animate-fade-in">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      {item.passed ? (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="text-sm">{item.text}</span>
                        <p className="text-xs text-muted-foreground">{item.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TranscriptTab = ({ messages }: { messages: TranscriptMessage[] }) => {
  const [filter, setFilter] = useState<"all" | "highlights">("all");
  
  const filteredMessages = filter === "highlights" 
    ? messages.filter(m => m.highlight) 
    : messages;

  const getHighlightStyle = (highlight?: string) => {
    switch (highlight) {
      case "objection": return "border-l-4 border-l-red-400";
      case "discovery": return "border-l-4 border-l-blue-400";
      case "pain": return "border-l-4 border-l-orange-400";
      case "commitment": return "border-l-4 border-l-green-400";
      default: return "";
    }
  };

  return (
    <div className="space-y-4">
      {/* Transcript Stats */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4 text-primary" />
                <span className="text-sm"><strong>Rep:</strong> 38%</span>
              </div>
              <div className="flex items-center gap-2">
                <Headphones className="w-4 h-4 text-accent" />
                <span className="text-sm"><strong>Prospect:</strong> 62%</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm"><strong>Exchanges:</strong> 10</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant={filter === "all" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("all")}
              >
                All
              </Button>
              <Button 
                variant={filter === "highlights" ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter("highlights")}
              >
                Highlights
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Legend */}
      <div className="flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-400 rounded" />
          <span>Objection</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-blue-400 rounded" />
          <span>Discovery</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-orange-400 rounded" />
          <span>Pain Point</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-green-400 rounded" />
          <span>Commitment</span>
        </div>
      </div>

      {/* Messages */}
      <Card>
        <CardContent className="p-6 space-y-4">
          {filteredMessages.map((msg) => (
            <div key={msg.id} className={cn("flex gap-4", getHighlightStyle(msg.highlight))}>
              <span className="text-xs text-muted-foreground w-10 flex-shrink-0 pt-3 font-mono">
                {msg.timestamp}
              </span>
              <div
                className={cn(
                  "flex-1 p-4 rounded-2xl",
                  msg.speaker === "rep"
                    ? "bg-primary text-primary-foreground rounded-br-md"
                    : "bg-muted rounded-bl-md"
                )}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium opacity-75">
                    {msg.speaker === "rep" ? "Sarah Chen" : "Jane Bowen"}
                  </span>
                  {msg.highlight && (
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      {msg.highlight}
                    </Badge>
                  )}
                </div>
                <p className="text-sm">{msg.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

const InsightsTab = () => (
  <div className="space-y-6">
    {/* AI Coach Recommendation */}
    <Card className="border-accent/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-accent" />
          AI Coach Recommendation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          This was a solid call with good discovery technique. Here are specific improvements that could take this from an 82 to a 90+ score:
        </p>
        
        <div className="space-y-4">
          <InsightCard 
            title="Quantify the Pain"
            description="When Jane mentioned ramp time being a problem, you could have dug deeper:"
            suggestion="What does 3 months of ramp time cost you in terms of lost revenue per rep?"
            impact="This would have created urgency and given you a number to reference in follow-ups"
          />
          
          <InsightCard 
            title="Social Proof Timing"
            description="When you mentioned 40% improvement, Jane asked for proof. You could have been ready with:"
            suggestion="Companies like [Similar Company] saw their new reps hit quota in 6 weeks instead of 3 months. I can share that case study."
            impact="Having proof ready builds credibility and moves the conversation forward"
          />
          
          <InsightCard 
            title="Multi-threading"
            description="You got Jane interested, but didn't ask about other stakeholders:"
            suggestion="Who else on your team would need to be part of this evaluation?"
            impact="Reduces single-threaded deal risk and accelerates the sales cycle"
          />
        </div>
      </CardContent>
    </Card>

    {/* Alternative Responses */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Quote className="w-5 h-5 text-primary" />
          Alternative Responses
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <AlternativeResponse 
          timestamp="0:12"
          original="Totally understand. Quick question..."
          alternative="I hear you, Jane. Before I let you go - I actually work with a lot of sales directors who are dealing with [specific challenge]. Is that something you're seeing too?"
          reasoning="Validates their time while creating curiosity with a specific, relevant challenge"
        />
        <AlternativeResponse 
          timestamp="1:08"
          original="That's actually exactly what we focus on. We help companies cut ramp time by 40%..."
          alternative="Three months - that's pretty standard but painful. If I told you we've helped companies like [X] cut that to 6 weeks, what questions would you have?"
          reasoning="Leads with social proof and invites questions instead of pitching"
        />
      </CardContent>
    </Card>

    {/* Learning Resources */}
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          Recommended Training
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <LearningResource 
          title="Mastering Discovery Questions"
          type="Roleplay"
          duration="15 min"
          relevance="Based on: Could have quantified pain better"
        />
        <LearningResource 
          title="Objection Handling: The 'I'm Busy' Response"
          type="Video"
          duration="8 min"
          relevance="Based on: Initial brush-off at 0:12"
        />
        <LearningResource 
          title="Multi-threading Deals"
          type="Article"
          duration="5 min read"
          relevance="Based on: Single stakeholder conversation"
        />
      </CardContent>
    </Card>

    {/* Similar Calls */}
    <Card>
      <CardHeader>
        <CardTitle>Similar Calls to Study</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <SimilarCall name="Jason Wright" score={94} outcome="Contract Sent" similarity="Same objection pattern" />
        <SimilarCall name="Kevin Martinez" score={78} outcome="Demo Scheduled" similarity="Similar discovery flow" />
      </CardContent>
    </Card>
  </div>
);

const InsightCard = ({ title, description, suggestion, impact }: {
  title: string;
  description: string;
  suggestion: string;
  impact: string;
}) => (
  <div className="p-4 bg-accent/5 border border-accent/20 rounded-lg">
    <h4 className="font-semibold mb-2">{title}</h4>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>
    <blockquote className="text-sm italic border-l-2 border-accent pl-3 py-1 bg-background rounded-r mb-2">
      "{suggestion}"
    </blockquote>
    <p className="text-xs text-muted-foreground flex items-center gap-1">
      <TrendingUp className="w-3 h-3 text-success" />
      {impact}
    </p>
  </div>
);

const AlternativeResponse = ({ timestamp, original, alternative, reasoning }: {
  timestamp: string;
  original: string;
  alternative: string;
  reasoning: string;
}) => (
  <div className="p-4 bg-muted/50 rounded-lg space-y-3">
    <div className="flex items-center gap-2">
      <span className="text-xs font-mono text-muted-foreground">{timestamp}</span>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-xs text-muted-foreground mb-1">What you said:</p>
        <p className="text-sm">{original}</p>
      </div>
      <div>
        <p className="text-xs text-success mb-1">Try instead:</p>
        <p className="text-sm font-medium">{alternative}</p>
      </div>
    </div>
    <p className="text-xs text-muted-foreground">💡 {reasoning}</p>
  </div>
);

const LearningResource = ({ title, type, duration, relevance }: { 
  title: string; 
  type: string; 
  duration: string;
  relevance: string;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-colors">
    <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
      {type === "Roleplay" ? <Mic className="w-5 h-5 text-primary" /> :
       type === "Video" ? <Play className="w-5 h-5 text-muted-foreground" /> :
       <BookOpen className="w-5 h-5 text-muted-foreground" />}
    </div>
    <div className="flex-1">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{type} • {duration}</p>
      <p className="text-xs text-accent">{relevance}</p>
    </div>
    <ExternalLink className="w-4 h-4 text-muted-foreground" />
  </div>
);

const SimilarCall = ({ name, score, outcome, similarity }: { 
  name: string; 
  score: number;
  outcome: string;
  similarity: string;
}) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-colors">
    <Phone className="w-4 h-4 text-muted-foreground" />
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
      {name.split(" ").map(n => n[0]).join("")}
    </div>
    <div className="flex-1">
      <p className="font-medium text-sm">{name}</p>
      <p className="text-xs text-muted-foreground">{similarity}</p>
    </div>
    <Badge variant="secondary" className="text-xs">{outcome}</Badge>
    <span className={cn("font-bold", score >= 90 ? "text-success" : "text-warning")}>{score}</span>
    <ExternalLink className="w-4 h-4 text-muted-foreground" />
  </div>
);

const FeedbackTab = () => {
  const [feedback, setFeedback] = useState("");
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  
  return (
    <div className="space-y-6">
      {/* Manager Review */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-primary" />
            Manager Review
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Rating */}
          <div>
            <p className="text-sm font-medium mb-2">Overall Rating</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={cn(
                    "w-10 h-10 rounded-lg border-2 font-bold transition-all",
                    selectedRating === rating 
                      ? "bg-primary text-primary-foreground border-primary" 
                      : "border-border hover:border-primary/50"
                  )}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Feedback Text */}
          <div>
            <p className="text-sm font-medium mb-2">Coaching Notes</p>
            <Textarea 
              placeholder="Share specific feedback for this rep... What did they do well? What should they focus on improving?"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          {/* Quick Tags */}
          <div>
            <p className="text-sm font-medium mb-2">Quick Tags</p>
            <div className="flex flex-wrap gap-2">
              {["Great Discovery", "Needs Practice", "Good Objection Handling", "Work on Closing", "Excellent Rapport", "Talk Less"].map((tag) => (
                <Badge 
                  key={tag} 
                  variant="outline" 
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => setFeedback(prev => prev ? `${prev}\n• ${tag}` : `• ${tag}`)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={() => {
              if (feedback.trim() || selectedRating) {
                toast.success("Review saved! Rep will be notified.");
                setFeedback("");
                setSelectedRating(null);
              }
            }} className="gap-2">
              <Send className="w-4 h-4" />
              Submit Review
            </Button>
            <Button variant="outline" className="gap-2" onClick={() => toast.info("Scheduled for 1:1 discussion")}>
              <Bell className="w-4 h-4" />
              Discuss in 1:1
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Previous Reviews */}
      <Card>
        <CardHeader>
          <CardTitle>Review History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ReviewHistoryItem 
            reviewer="Mike Thompson"
            date="2 days ago"
            rating={4}
            feedback="Great improvement on objection handling since last month. The pattern interrupt opener was smooth. Focus on asking more follow-up questions when you uncover pain - don't rush to pitch."
          />
          <ReviewHistoryItem 
            reviewer="Lisa Chen"
            date="1 week ago"
            rating={3}
            feedback="Solid call structure but talked too much in the middle. Remember the 40/60 rule. Good job getting the meeting booked though!"
          />
        </CardContent>
      </Card>

      {/* Rep Self-Reflection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            Rep Self-Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">SC</div>
              <span className="font-medium text-sm">Sarah Chen</span>
              <span className="text-xs text-muted-foreground">Self-review</span>
            </div>
            <p className="text-sm text-muted-foreground">
              I think the opening went well but I could have dug deeper into the ramp time issue. 
              Should have asked about the cost impact. Also noticed I said "um" a lot when she pushed back initially. 
              Happy with the close though - felt natural.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

const ReviewHistoryItem = ({ reviewer, date, rating, feedback }: {
  reviewer: string;
  date: string;
  rating: number;
  feedback: string;
}) => (
  <div className="p-4 bg-muted/30 rounded-xl">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
          {reviewer.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <span className="font-medium text-sm">{reviewer}</span>
          <p className="text-xs text-muted-foreground">{date}</p>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <div 
            key={i} 
            className={cn(
              "w-2 h-2 rounded-full",
              i <= rating ? "bg-primary" : "bg-muted"
            )} 
          />
        ))}
      </div>
    </div>
    <p className="text-sm text-muted-foreground">{feedback}</p>
  </div>
);

export default CallDetailPage;

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
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Tab = "summary" | "scorecard" | "transcript" | "insights";

interface TranscriptMessage {
  id: string;
  speaker: "rep" | "buyer";
  message: string;
  timestamp: string;
}

const mockTranscript: TranscriptMessage[] = [
  { id: "1", speaker: "rep", message: "Hey, Jane. This is Tom from Caliber. I promise to be brief - I know this is a cold call. I noticed you run outbound sales at Agile. Would you give me 30 seconds?", timestamp: "0:00" },
  { id: "2", speaker: "buyer", message: "Look, I'm really busy right now. What's this about?", timestamp: "0:12" },
  { id: "3", speaker: "rep", message: "Totally understand. Quick question - when it comes to your outbound calls, are you hitting your connection rates? I'm curious what you're seeing.", timestamp: "0:18" },
  { id: "4", speaker: "buyer", message: "Our connection rates are fine. We use a standard dialer and it works.", timestamp: "0:32" },
  { id: "5", speaker: "rep", message: "Got it. So if you could wave a magic wand and improve one thing about your SDR team's performance, what would it be?", timestamp: "0:41" },
  { id: "6", speaker: "buyer", message: "Honestly? Ramp time. It takes forever to get new reps productive. But I don't see how you can help with that.", timestamp: "0:55" },
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
  ];

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/calls")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-display font-bold">Cold Call with Jane Bowen</h1>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Jan 10, 2:30 PM
              </span>
              <span>Director of Sales @ Agile Solutions</span>
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                4:24
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2" onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.success("Link copied to clipboard!");
          }}>
            <Share2 className="w-4 h-4" />
            Share
          </Button>
          <Button className="gap-2" onClick={() => navigate("/roleplays")}>
            <Phone className="w-4 h-4" />
            Practice Again
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="col-span-2 space-y-6">
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
                  <div className="flex gap-2">
                    <TimeMarker time="0:32" label="Intro" active />
                    <TimeMarker time="1:15" label="Discovery" />
                    <TimeMarker time="2:45" label="Objection" />
                    <TimeMarker time="3:50" label="Close" />
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
          <div className="flex gap-2 border-b border-border pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
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
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Score Card */}
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-br from-primary to-accent p-6 text-center text-white">
              <p className="text-sm font-medium opacity-90 mb-2">Overall Score</p>
              <p className="text-5xl font-bold">82</p>
              <p className="text-sm opacity-75 mt-2">Good performance</p>
            </div>
            <CardContent className="p-4 space-y-3">
              <ScoreMetric label="Talk/Listen Ratio" value="31%" status="good" />
              <ScoreMetric label="Filler Words" value="3.5 wpm" status="warning" />
              <ScoreMetric label="Talk Speed" value="134 wpm" status="warning" />
              <ScoreMetric label="Question Rate" value="3.5 wpm" status="warning" />
            </CardContent>
          </Card>

          {/* Buyer Info */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Buyer</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold">Jane Bowen</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Director of Sales @ Agile Solutions
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                <span className="badge-trait badge-rude">busy</span>
                <span className="badge-trait badge-rude">aggressive</span>
                <span className="badge-trait badge-rude">not friendly</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-4 space-y-2">
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
              <Button variant="outline" className="w-full justify-start gap-2" onClick={() => navigate("/calls")}>
                <ExternalLink className="w-4 h-4" />
                View Similar Calls
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const TimeMarker = ({ time, label, active }: { time: string; label: string; active?: boolean }) => (
  <button className={cn(
    "px-2 py-1 rounded text-xs font-medium transition-colors",
    active ? "bg-primary/10 text-primary border border-primary/30" : "bg-muted text-muted-foreground hover:bg-muted/80"
  )}>
    {label} {time}
  </button>
);

const ScoreMetric = ({ label, value, status }: { label: string; value: string; status: "good" | "warning" | "bad" }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-muted-foreground">{label}</span>
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-accent" />
          AI Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          The rep effectively introduced the product and addressed the client's initial concerns about being busy. 
          The client showed interest when ramp time was mentioned, asking detailed questions. 
          Overall, the call ended on a positive note with potential for follow-up.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
            <p className="font-medium text-success mb-2">What went well</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Professional demeanor throughout</li>
              <li>• Good discovery questions</li>
              <li>• Handled initial objection smoothly</li>
            </ul>
          </div>
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
            <p className="font-medium text-warning mb-2">Areas to improve</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Speak a bit slower</li>
              <li>• Ask more follow-up questions</li>
              <li>• Quantify the ROI earlier</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Action Items</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ActionItem 
          completed
          text="Share case studies relevant to sales team challenges"
          assignee="Michael Thompson"
        />
        <ActionItem 
          text="Schedule follow-up demo with decision makers"
          assignee="Eugene Brown"
        />
        <ActionItem 
          text="Send personalized ROI analysis"
        />
      </CardContent>
    </Card>
  </div>
);

const ActionItem = ({ completed, text, assignee }: { completed?: boolean; text: string; assignee?: string }) => (
  <div className={cn(
    "p-4 rounded-xl border transition-colors cursor-pointer",
    completed ? "bg-success/5 border-success/20" : "bg-card border-border hover:border-primary/30"
  )}>
    <div className="flex items-start gap-3">
      <div className={cn(
        "w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0",
        completed ? "bg-success border-success" : "border-muted-foreground"
      )}>
        {completed && <CheckCircle className="w-3 h-3 text-white" />}
      </div>
      <div className="flex-1">
        <p className={cn("text-sm", completed && "line-through text-muted-foreground")}>{text}</p>
        {assignee && (
          <div className="flex items-center gap-2 mt-2">
            <div className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-[10px] font-medium">
              {assignee.split(" ").map(n => n[0]).join("")}
            </div>
            <span className="text-xs text-muted-foreground">{assignee}</span>
          </div>
        )}
      </div>
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
      id: "situation",
      name: "Situation",
      score: "1/2",
      items: [
        { text: "Identified the tools they currently use", passed: true },
        { text: "Determined the size of their team", passed: false },
      ]
    },
    {
      id: "pain",
      name: "Pain",
      score: "2/2",
      items: [
        { text: "Clarified specific challenges", passed: true },
        { text: "Identified why they haven't solved it", passed: true },
      ]
    },
    {
      id: "impact",
      name: "Impact",
      score: "1/2",
      items: [
        { text: "Discussed measurable benefits", passed: false },
        { text: "Connected to strategic goals", passed: true },
      ]
    },
    {
      id: "critical-event",
      name: "Critical Event",
      score: "1/1",
      items: [
        { text: "Determined deadline or urgency", passed: true },
      ]
    },
  ];

  return (
    <div className="space-y-4">
      <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">Room for improvement</p>
          <p className="text-sm text-muted-foreground">You passed 5 criteria out of 7 total. Focus on Impact and Situation.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {criteria.map((cat) => (
          <Card key={cat.id}>
            <CardContent className="p-4">
              <button 
                className="w-full"
                onClick={() => setExpandedCriteria(expandedCriteria === cat.id ? null : cat.id)}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">{cat.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{cat.score}</span>
                    {expandedCriteria === cat.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </div>
              </button>
              {expandedCriteria === cat.id && (
                <div className="space-y-2 pt-2 border-t border-border animate-fade-in">
                  {cat.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      {item.passed ? (
                        <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      )}
                      <span className="text-sm">{item.text}</span>
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

const TranscriptTab = ({ messages }: { messages: TranscriptMessage[] }) => (
  <Card>
    <CardContent className="p-6 space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-4">
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
            <p className="text-sm">{msg.message}</p>
          </div>
        </div>
      ))}
    </CardContent>
  </Card>
);

const InsightsTab = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-warning" />
          What could you do differently?
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          The rep could have qualified out by acknowledging the prospect's concerns and budget constraints. 
          For example, they could have said:
        </p>
        <blockquote className="border-l-4 border-primary pl-4 py-2 bg-muted/50 rounded-r-lg italic text-muted-foreground">
          "Given your concerns about the effectiveness of our solution, the need for a long-term pilot, 
          and your current budget constraints with the Clari rollout, it seems like this might not be 
          the right time for Caliber. Would you agree that it makes sense to revisit this conversation 
          after your Clari implementation is complete?"
        </blockquote>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Learning Materials</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <LearningResource 
          title="Effective Sales Qualification Strategies"
          source="youtube.com"
        />
        <LearningResource 
          title="SPICED Framework for Better Sales"
          source="youtube.com"
        />
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <CardTitle>Similar Calls to Review</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <SimilarCall name="Mark Brown" duration="13:24" date="Aug 5" />
        <SimilarCall name="Jessica Parker" duration="8:45" date="Jul 28" />
      </CardContent>
    </Card>
  </div>
);

const LearningResource = ({ title, source }: { title: string; source: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-colors">
    <div className="w-16 h-12 rounded-lg bg-muted flex items-center justify-center">
      <Play className="w-5 h-5 text-muted-foreground" />
    </div>
    <div className="flex-1">
      <p className="font-medium text-sm">{title}</p>
      <p className="text-xs text-muted-foreground">{source}</p>
    </div>
    <ExternalLink className="w-4 h-4 text-muted-foreground" />
  </div>
);

const SimilarCall = ({ name, duration, date }: { name: string; duration: string; date: string }) => (
  <div className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/30 cursor-pointer transition-colors">
    <Phone className="w-4 h-4 text-muted-foreground" />
    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
      {name.split(" ").map(n => n[0]).join("")}
    </div>
    <div className="flex-1">
      <p className="font-medium text-sm">{name}</p>
    </div>
    <span className="text-sm text-muted-foreground">{duration}</span>
    <span className="text-sm text-muted-foreground">{date}</span>
    <ExternalLink className="w-4 h-4 text-muted-foreground" />
  </div>
);

export default CallDetailPage;

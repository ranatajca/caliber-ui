import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  ArrowLeft, 
  Phone, 
  Share, 
  Play, 
  Pause, 
  Volume2, 
  MoreVertical,
  Download,
  Copy,
  User,
  Clock,
  Building2,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tab = "details" | "transcript" | "stats" | "scorecard" | "objections" | "questions";

interface TranscriptMessage {
  id: string;
  speaker: "rep" | "buyer";
  message: string;
  timestamp: string;
}

const mockTranscript: TranscriptMessage[] = [
  {
    id: "1",
    speaker: "rep",
    message: "Hey, Jane. This is SaaS. I'm calling from Agile I promise to be brief because this is a cold call. I did my research and noticed that you do outbound sales. Would you be able to give me 30 seconds?",
    timestamp: "0:00",
  },
  {
    id: "2",
    speaker: "buyer",
    message: "Look, I'm really busy",
    timestamp: "0:11",
  },
  {
    id: "3",
    speaker: "rep",
    message: "Totally get it. I know I called you unexpectedly. I can't it super brief. The reason for my call is I see that you the director of sales there at Agile around project management software. I was just curious when it comes to your outbound, what do you guys see in when it comes to, you know, your call rates, your connections? Are you guys doing pretty well? With booking net meetings?",
    timestamp: "0:14",
  },
  {
    id: "4",
    speaker: "buyer",
    message: "Look Tom. I'm not sure where you...",
    timestamp: "0:33",
  },
];

const CallDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("stats");
  const [isPlaying, setIsPlaying] = useState(false);

  const tabs: { id: Tab; label: string; disabled?: boolean }[] = [
    { id: "details", label: "Details" },
    { id: "transcript", label: "Transcript" },
    { id: "stats", label: "Stats" },
    { id: "scorecard", label: "Scorecard" },
    { id: "objections", label: "Objections", disabled: true },
    { id: "questions", label: "Questions", disabled: true },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/calls")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-bold">Cold Call with Jane</h1>
              <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded">
                DEMO
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Jan 10, 7:44 PM
              </span>
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" />
                Agile Solutions
              </span>
              <span className="flex items-center gap-1">
                <Play className="w-4 h-4" />
                0:56
              </span>
              <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                Rep: Saad Khan
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Share className="w-4 h-4" />
            Share
          </Button>
          <Button className="gap-2">
            <Phone className="w-4 h-4" />
            Start new call
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Player */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="h-10 w-10 rounded-full"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </Button>
                <span className="text-sm font-mono text-muted-foreground">0:00 / 4:24</span>
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div className="w-0 h-full bg-primary rounded-full" />
                </div>
                <Button variant="ghost" size="icon">
                  <Volume2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => !tab.disabled && setActiveTab(tab.id)}
                  className={cn(
                    "tab-underline",
                    activeTab === tab.id && "active",
                    tab.disabled && "opacity-50 cursor-not-allowed"
                  )}
                  disabled={tab.disabled}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "stats" && <StatsTab />}
            {activeTab === "scorecard" && <ScorecardTab />}
            {activeTab === "transcript" && <TranscriptTab messages={mockTranscript} />}
            {activeTab === "details" && <DetailsTab />}
          </div>
        </div>

        {/* Sidebar - Buyer Info & Transcript */}
        <div className="space-y-6">
          {/* Buyer Card */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-base">Buyer</CardTitle>
            </CardHeader>
            <CardContent className="text-center pb-6">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <User className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">Jane Bowen</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Director of Sales @ Agile Solutions
              </p>
              <div className="flex justify-center gap-2">
                <span className="badge-trait">busy</span>
                <span className="badge-trait">aggressive</span>
                <span className="badge-trait">not friendly</span>
              </div>
            </CardContent>
          </Card>

          {/* Recording Player Mini */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-sm font-medium">Recording</span>
                <span className="text-xs text-muted-foreground flex-1">
                  Press play and the transcript will follow along
                </span>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Play className="w-4 h-4" />
                </Button>
                <span className="text-xs font-mono">0:00 / 0:51</span>
                <div className="flex-1 h-1 bg-muted rounded-full" />
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Volume2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Full Transcript */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Full Transcript</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
              {mockTranscript.map((msg) => (
                <div key={msg.id} className="space-y-1">
                  <span className="text-xs text-muted-foreground">{msg.timestamp}</span>
                  <div
                    className={cn(
                      "p-3 rounded-lg text-sm",
                      msg.speaker === "rep"
                        ? "bg-primary text-primary-foreground ml-4"
                        : "bg-muted mr-4"
                    )}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatsTab = () => {
  const stats = [
    {
      label: "Talk/Listen Ratio",
      description: "How much you talked vs. how much you listened",
      value: "76%",
      status: "warning",
      statusText: "Above recommended range",
    },
    {
      label: "Filler Words",
      description: "How many filler words like 'um' and 'uh' you used",
      value: "1 words / min",
      status: "success",
      statusText: "In recommended range",
    },
    {
      label: "Talk Speed",
      description: "How fast you spoke",
      value: "167 words / min",
      status: "warning",
      statusText: "Above recommended range",
    },
    {
      label: "Longest Monologue",
      description: "The longest stretch of time you spoke without interruption",
      value: "00:52",
      status: "neutral",
      statusText: "",
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold mb-2">Summary</h2>
      <p className="text-muted-foreground mb-6">
        The User initiated a cold call with Jane, trying to pitch a sales solution for lessening the
        skepticism faced by sales teams during outbound sales calls. Despite Jane's initial...
      </p>
      <Button variant="link" className="p-0 h-auto text-primary mb-8">
        Show more +
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{stat.label}</h3>
                {stat.status === "warning" && (
                  <AlertCircle className="w-5 h-5 text-warning" />
                )}
                {stat.status === "success" && (
                  <CheckCircle className="w-5 h-5 text-success" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-3">{stat.description}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
              {stat.statusText && (
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      stat.status === "warning" && "bg-warning",
                      stat.status === "success" && "bg-success"
                    )}
                  />
                  <span className="text-sm text-muted-foreground">{stat.statusText}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const ScorecardTab = () => {
  const criteria = [
    {
      category: "Opener",
      description: "How well you opened up the call",
      score: "1/3",
      items: [
        { label: "SDR asked open ended questions?", passed: true },
        { label: "SDR mirrored prospect?", passed: false },
        { label: "Asked if prospect is familiar with 6Sense", passed: false },
      ],
    },
    {
      category: "Gating",
      description: "How well you addressed the gating criteria",
      score: "0/3",
      items: [
        { label: "Size of SDR team mentioned", passed: false },
        { label: "ICP details mentioned", passed: false },
        { label: "ICP PM team size mentioned", passed: false },
      ],
    },
    {
      category: "Closing",
      description: "How well you closed the call",
      score: "0/1",
      items: [
        { label: "Next steps mentioned", passed: false },
      ],
    },
  ];

  return (
    <div>
      <div className="bg-muted/50 border border-border rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-sm">IN ALPHA</p>
            <p className="text-sm text-muted-foreground">
              This scorecard is a proof of concept of what a custom scorecard could look like.
              Therefore, none of the values below are accurate. We'll work with you to build you
              your own personalized scorecard.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <div>
            <p className="font-medium">Just the beginning, you'll get there!</p>
            <p className="text-sm text-muted-foreground">You passed 2 criteria out of 7 total</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {criteria.map((cat) => (
          <Card key={cat.category}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{cat.category}</h3>
                <span className="text-sm text-muted-foreground">{cat.score}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{cat.description}</p>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm">{item.label}</span>
                    {item.passed ? (
                      <CheckCircle className="w-5 h-5 text-success" />
                    ) : (
                      <XCircle className="w-5 h-5 text-destructive" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const TranscriptTab = ({ messages }: { messages: TranscriptMessage[] }) => {
  return (
    <div className="space-y-4">
      {messages.map((msg) => (
        <div key={msg.id} className="flex gap-4">
          <span className="text-xs text-muted-foreground w-10 flex-shrink-0 pt-3">
            {msg.timestamp}
          </span>
          <div
            className={cn(
              "flex-1 p-4 rounded-lg",
              msg.speaker === "rep"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            )}
          >
            <p className="text-sm">{msg.message}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

const DetailsTab = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Details</h2>
      <p className="text-muted-foreground mb-6">View the details of the call</p>

      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground mb-4">Buyer</p>
          <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <User className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Ryan Mitchell</h3>
          <p className="text-muted-foreground mb-4">Data Engineering Manager @ Agile Solutions</p>
          <div className="flex justify-center gap-2">
            <span className="badge-trait">busy</span>
            <span className="badge-trait">aggressive</span>
            <span className="badge-trait">not friendly</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CallDetail;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Calendar,
  RefreshCw,
  ChevronRight,
  Info,
  Phone,
  Target,
  Headphones,
  MessageSquare,
  Zap,
  TrendingUp,
  TrendingDown,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Award,
  BarChart3,
  Mic,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  Radar
} from "recharts";
import { toast } from "sonner";

interface Rep {
  id: string;
  name: string;
  avatar: string;
  email: string;
  callScore: number;
  calls: number;
  roleplayScore: number;
  talkRatio: number;
  discoveryRate: number;
  objectionHandling: number;
  color: string;
}

interface RepDetailPageProps {
  rep: Rep;
  onBack: () => void;
}

const getRepPerformanceData = (rep: Rep) => [
  { month: "Aug", score: Math.max(rep.callScore - 32, 15), roleplay: Math.max(rep.roleplayScore - 28, 12) },
  { month: "Sep", score: Math.max(rep.callScore - 26, 20), roleplay: Math.max(rep.roleplayScore - 22, 18) },
  { month: "Oct", score: Math.max(rep.callScore - 19, 28), roleplay: Math.max(rep.roleplayScore - 16, 25) },
  { month: "Nov", score: Math.max(rep.callScore - 10, 35), roleplay: Math.max(rep.roleplayScore - 8, 32) },
  { month: "Dec", score: Math.max(rep.callScore - 4, 42), roleplay: Math.max(rep.roleplayScore - 3, 40) },
  { month: "Jan", score: rep.callScore, roleplay: rep.roleplayScore },
];

const getRadarData = (rep: Rep) => [
  { skill: "Discovery", value: rep.discoveryRate, fullMark: 100 },
  { skill: "Listening", value: Math.max(100 - rep.talkRatio, 30), fullMark: 100 },
  { skill: "Objections", value: rep.objectionHandling, fullMark: 100 },
  { skill: "Closing", value: Math.round(rep.callScore * 0.85), fullMark: 100 },
  { skill: "Rapport", value: Math.round(rep.callScore * 1.02), fullMark: 100 },
  { skill: "Next Steps", value: Math.round(rep.callScore * 0.92), fullMark: 100 },
];

const getRecentCalls = (rep: Rep) => [
  { id: 1, prospect: "Tech Solutions Inc", duration: "32:15", score: rep.callScore + 5, date: "Jan 12", outcome: "Meeting Booked" },
  { id: 2, prospect: "Global Services Ltd", duration: "28:42", score: rep.callScore - 3, date: "Jan 10", outcome: "Follow-up Scheduled" },
  { id: 3, prospect: "Innovate Partners", duration: "45:20", score: rep.callScore + 8, date: "Jan 8", outcome: "Proposal Sent" },
  { id: 4, prospect: "Summit Holdings", duration: "18:33", score: rep.callScore - 12, date: "Jan 5", outcome: "No Interest" },
  { id: 5, prospect: "NextGen Corp", duration: "38:55", score: rep.callScore + 2, date: "Jan 3", outcome: "Demo Scheduled" },
];

const getObjections = (rep: Rep) => {
  const baseObjections = [
    { name: "Budget concerns", count: Math.ceil(rep.calls * 0.25), trend: -8 },
    { name: "Timing issues", count: Math.ceil(rep.calls * 0.18), trend: 5 },
    { name: "Need stakeholder buy-in", count: Math.ceil(rep.calls * 0.15), trend: -3 },
    { name: "Already using competitor", count: Math.ceil(rep.calls * 0.12), trend: 12 },
    { name: "Need more information", count: Math.ceil(rep.calls * 0.08), trend: -15 },
  ];
  return baseObjections.filter(o => o.count > 0);
};

const getStrengths = (rep: Rep) => {
  const allStrengths = [
    { name: "Pain point discovery", score: rep.discoveryRate, mentions: Math.ceil(rep.calls * 0.6) },
    { name: "Building rapport", score: Math.round(rep.callScore * 1.02), mentions: Math.ceil(rep.calls * 0.5) },
    { name: "Handling pricing objections", score: rep.objectionHandling, mentions: Math.ceil(rep.calls * 0.35) },
    { name: "Setting next steps", score: Math.round(rep.callScore * 0.92), mentions: Math.ceil(rep.calls * 0.45) },
    { name: "Asking open-ended questions", score: Math.round(rep.discoveryRate * 0.95), mentions: Math.ceil(rep.calls * 0.55) },
  ];
  return allStrengths.sort((a, b) => b.score - a.score).slice(0, 4);
};

const getWeaknesses = (rep: Rep) => {
  const allWeaknesses = [
    { name: "Talk-to-listen ratio", score: rep.talkRatio, recommendation: "Practice active listening exercises" },
    { name: "Closing techniques", score: 100 - Math.round(rep.callScore * 0.85), recommendation: "Review assumptive close training" },
    { name: "Urgency creation", score: 100 - Math.round(rep.callScore * 0.78), recommendation: "Use time-bound incentives" },
    { name: "Competitor differentiation", score: 100 - rep.objectionHandling, recommendation: "Study battle cards weekly" },
  ];
  return allWeaknesses.sort((a, b) => b.score - a.score).slice(0, 3);
};

const sourceFilters = ["Live Calls", "AI Roleplay"];

const RepDetailPage = ({ rep, onBack }: RepDetailPageProps) => {
  const navigate = useNavigate();
  const [sourceFilter, setSourceFilter] = useState("Live Calls");

  const performanceData = getRepPerformanceData(rep);
  const radarData = getRadarData(rep);
  const recentCalls = getRecentCalls(rep);
  const objections = getObjections(rep);
  const strengths = getStrengths(rep);
  const weaknesses = getWeaknesses(rep);

  const avgCallDuration = "34:22";
  const improvementRate = Math.round((performanceData[5].score - performanceData[0].score) / performanceData[0].score * 100);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div 
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-bold text-white text-xl shadow-lg"
              style={{ backgroundColor: rep.color }}
            >
              {rep.avatar}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{rep.name}</h1>
              <p className="text-muted-foreground">{rep.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +{improvementRate}% improvement
                </Badge>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center border border-border rounded-lg overflow-hidden">
            {sourceFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setSourceFilter(filter)}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  sourceFilter === filter 
                    ? "bg-primary text-primary-foreground" 
                    : "bg-background hover:bg-muted"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 6 months
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toast.info("Refreshing data...")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="group hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground">Calls</p>
            </div>
            <p className="text-2xl font-bold">{rep.calls}</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <Target className="w-4 h-4 text-accent" />
              </div>
              <p className="text-xs text-muted-foreground">Call Score</p>
            </div>
            <p className="text-2xl font-bold">{rep.callScore}</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-success/10">
                <Zap className="w-4 h-4 text-success" />
              </div>
              <p className="text-xs text-muted-foreground">Roleplay</p>
            </div>
            <p className="text-2xl font-bold">{rep.roleplayScore}</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-warning/10">
                <Mic className="w-4 h-4 text-warning" />
              </div>
              <p className="text-xs text-muted-foreground">Talk Ratio</p>
            </div>
            <p className="text-2xl font-bold">{rep.talkRatio}%</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-all">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg bg-muted">
                <Clock className="w-4 h-4 text-muted-foreground" />
              </div>
              <p className="text-xs text-muted-foreground">Avg Duration</p>
            </div>
            <p className="text-2xl font-bold">{avgCallDuration}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Performance Trend</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Call vs Roleplay scores over time</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={rep.color} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={rep.color} stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="roleplayGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="score" name="Call Score" stroke={rep.color} fill="url(#scoreGradient)" strokeWidth={2} />
                <Area type="monotone" dataKey="roleplay" name="Roleplay" stroke="#22C55E" fill="url(#roleplayGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: rep.color }} />
                <span className="text-muted-foreground">Call Score</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full bg-success" />
                <span className="text-muted-foreground">Roleplay Score</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Radar */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Award className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Skills Profile</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Competency breakdown across key areas</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="skill" 
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                />
                <Radar
                  name="Skills"
                  dataKey="value"
                  stroke={rep.color}
                  fill={rep.color}
                  fillOpacity={0.25}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Calls */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <CardTitle className="text-lg">Recent Calls</CardTitle>
            </div>
            <Button variant="ghost" size="sm" className="text-muted-foreground" onClick={() => navigate("/calls")}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {recentCalls.map((call) => (
              <div 
                key={call.id}
                className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                onClick={() => navigate("/calls")}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                    <Users className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{call.prospect}</p>
                    <p className="text-sm text-muted-foreground">{call.date} • {call.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge 
                    variant="secondary" 
                    className={`${
                      call.outcome.includes("Booked") || call.outcome.includes("Scheduled") || call.outcome.includes("Sent")
                        ? "bg-success/10 text-success border-success/20"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {call.outcome}
                  </Badge>
                  <div className={`text-lg font-bold ${
                    call.score >= 80 ? "text-success" :
                    call.score >= 60 ? "text-warning" :
                    "text-destructive"
                  }`}>
                    {call.score}
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Objections */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              <CardTitle className="text-lg">Common Objections</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Most frequent pushback encountered</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {objections.map((objection, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => navigate("/calls")}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{objection.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">{objection.count}x</span>
                    <span className={`text-xs flex items-center ${
                      objection.trend < 0 ? "text-success" : "text-destructive"
                    }`}>
                      {objection.trend < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                      {Math.abs(objection.trend)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strengths */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-success" />
              <CardTitle className="text-lg">Key Strengths</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Top performing areas</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {strengths.map((strength, index) => (
                <div key={index} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{strength.name}</span>
                    <span className="text-sm text-success font-medium">{strength.score}</span>
                  </div>
                  <Progress value={strength.score} className="h-1.5" />
                  <p className="text-xs text-muted-foreground">{strength.mentions} mentions</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Areas to Improve */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-accent" />
              <CardTitle className="text-lg">Focus Areas</CardTitle>
            </div>
            <p className="text-sm text-muted-foreground">Recommended improvements</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {weaknesses.map((weakness, index) => (
                <div key={index} className="p-3 rounded-lg border border-border bg-muted/20">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{weakness.name}</span>
                    <Badge variant="outline" className="text-xs">
                      Priority {index + 1}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{weakness.recommendation}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepDetailPage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  TrendingUp, 
  TrendingDown,
  Target, 
  ChevronRight, 
  Bot,
  RefreshCw,
  Calendar,
  Lock,
  Info,
  Headphones,
  MessageSquare,
  Users,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  ComposedChart,
} from "recharts";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";
import RepDetailPage from "@/components/metrics/RepDetailPage";

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
  practiceCount: number;
  scoreChange: number;
}

const mockReps: Rep[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", email: "sarah.chen@company.com", callScore: 84, calls: 23, roleplayScore: 88, talkRatio: 38, discoveryRate: 91, objectionHandling: 82, color: "#6366F1", practiceCount: 18, scoreChange: 12 },
  { id: "2", name: "Marcus Johnson", avatar: "MJ", email: "marcus.j@company.com", callScore: 76, calls: 18, roleplayScore: 72, talkRatio: 52, discoveryRate: 74, objectionHandling: 69, color: "#EC4899", practiceCount: 12, scoreChange: 8 },
  { id: "3", name: "Elena Rodriguez", avatar: "ER", email: "elena.r@company.com", callScore: 71, calls: 14, roleplayScore: 78, talkRatio: 45, discoveryRate: 68, objectionHandling: 72, color: "#14B8A6", practiceCount: 14, scoreChange: 5 },
  { id: "4", name: "James Mitchell", avatar: "JM", email: "james.m@company.com", callScore: 62, calls: 11, roleplayScore: 58, talkRatio: 58, discoveryRate: 55, objectionHandling: 51, color: "#F59E0B", practiceCount: 6, scoreChange: -2 },
  { id: "5", name: "Aisha Patel", avatar: "AP", email: "aisha.p@company.com", callScore: 54, calls: 7, roleplayScore: 48, talkRatio: 62, discoveryRate: 46, objectionHandling: 42, color: "#8B5CF6", practiceCount: 3, scoreChange: -5 },
  { id: "6", name: "Ryan O'Connor", avatar: "RO", email: "ryan.o@company.com", callScore: 45, calls: 5, roleplayScore: 41, talkRatio: 67, discoveryRate: 38, objectionHandling: 35, color: "#06B6D4", practiceCount: 2, scoreChange: -8 },
  { id: "7", name: "Nina Kowalski", avatar: "NK", email: "nina.k@company.com", callScore: 38, calls: 3, roleplayScore: 32, talkRatio: 71, discoveryRate: 28, objectionHandling: 25, color: "#EF4444", practiceCount: 1, scoreChange: -3 },
  { id: "8", name: "Derek Thompson", avatar: "DT", email: "derek.t@company.com", callScore: 28, calls: 2, roleplayScore: 24, talkRatio: 74, discoveryRate: 20, objectionHandling: 18, color: "#22C55E", practiceCount: 0, scoreChange: -1 },
];

// Team average over time data for different windows
const teamTrendData = {
  "7d": [
    { day: "Mon", teamAvg: 58, topRep: 82 },
    { day: "Tue", teamAvg: 59, topRep: 83 },
    { day: "Wed", teamAvg: 57, topRep: 81 },
    { day: "Thu", teamAvg: 60, topRep: 84 },
    { day: "Fri", teamAvg: 61, topRep: 85 },
    { day: "Sat", teamAvg: 58, topRep: 82 },
    { day: "Sun", teamAvg: 57, topRep: 84 },
  ],
  "14d": [
    { day: "W1 Mon", teamAvg: 55, topRep: 80 },
    { day: "W1 Wed", teamAvg: 56, topRep: 81 },
    { day: "W1 Fri", teamAvg: 57, topRep: 82 },
    { day: "W2 Mon", teamAvg: 58, topRep: 83 },
    { day: "W2 Wed", teamAvg: 59, topRep: 83 },
    { day: "W2 Fri", teamAvg: 60, topRep: 84 },
    { day: "Today", teamAvg: 57, topRep: 84 },
  ],
  "30d": [
    { day: "Week 1", teamAvg: 52, topRep: 78 },
    { day: "Week 2", teamAvg: 54, topRep: 80 },
    { day: "Week 3", teamAvg: 56, topRep: 82 },
    { day: "Week 4", teamAvg: 57, topRep: 84 },
  ],
  "90d": [
    { day: "Jan", teamAvg: 48, topRep: 72 },
    { day: "Feb", teamAvg: 52, topRep: 76 },
    { day: "Mar", teamAvg: 57, topRep: 84 },
  ],
};

const sourceFilters = ["Live Calls", "AI Roleplay"];

const MetricsPage = () => {
  const navigate = useNavigate();
  const { isManager } = useRole();
  const [sourceFilter, setSourceFilter] = useState("Live Calls");
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null);
  const [timeWindow, setTimeWindow] = useState<"7d" | "14d" | "30d" | "90d">("7d");

  useEffect(() => {
    if (!isManager) {
      navigate("/leaderboard", { replace: true });
    }
  }, [isManager, navigate]);

  if (!isManager) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Lock className="w-8 h-8 text-muted-foreground" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Manager Access Only</h2>
        <p className="text-muted-foreground text-center mb-4">
          The Metrics dashboard is only available for managers.
        </p>
        <Button onClick={() => navigate("/leaderboard")}>
          Go to Leaderboard
        </Button>
      </div>
    );
  }

  if (selectedRep) {
    return (
      <RepDetailPage 
        rep={selectedRep} 
        allReps={mockReps}
        onBack={() => setSelectedRep(null)} 
      />
    );
  }

  const totalCalls = mockReps.reduce((sum, rep) => sum + rep.calls, 0);
  const activeReps = mockReps.filter(r => r.calls > 0);
  const avgCallScore = Math.round(activeReps.reduce((sum, rep) => sum + rep.callScore, 0) / activeReps.length);
  const avgTalkRatio = Math.round(activeReps.reduce((sum, rep) => sum + rep.talkRatio, 0) / activeReps.length);
  const avgDiscoveryRate = Math.round(activeReps.reduce((sum, rep) => sum + rep.discoveryRate, 0) / activeReps.length);

  // Separate reps by above/below team average
  const aboveAverage = mockReps.filter(r => r.callScore >= avgCallScore).sort((a, b) => b.callScore - a.callScore);
  const belowAverage = mockReps.filter(r => r.callScore < avgCallScore).sort((a, b) => b.callScore - a.callScore);
  const topRep = mockReps.reduce((top, rep) => rep.callScore > top.callScore ? rep : top, mockReps[0]);

  const currentTrendData = teamTrendData[timeWindow];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm flex items-center gap-2" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const timeWindowLabels: Record<string, string> = {
    "7d": "Last 7 days",
    "14d": "Last 14 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days"
  };

  const getScoreChangeDisplay = (rep: Rep) => {
    const diff = rep.callScore - avgCallScore;
    if (diff > 0) return { icon: ArrowUp, color: "text-success", text: `+${diff}` };
    if (diff < 0) return { icon: ArrowDown, color: "text-destructive", text: `${diff}` };
    return { icon: Minus, color: "text-muted-foreground", text: "0" };
  };

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Team Performance</h1>
          <p className="text-muted-foreground mt-1">
            Monitor coaching effectiveness and rep development
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={() => navigate("/ask-ai")}
          >
            <Bot className="w-4 h-4" />
            Ask AI
          </Button>
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
                {filter} {filter === "Live Calls" ? `(${totalCalls})` : "(86)"}
              </button>
            ))}
          </div>
          <Button variant="ghost" size="icon" onClick={() => toast.info("Refreshing data...")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="group hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10 group-hover:scale-110 transition-transform">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Total Calls</p>
            </div>
            <p className="text-2xl font-bold">{totalCalls}</p>
            <p className="text-xs text-muted-foreground mt-1">Reviewed this period</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-shadow bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/20 group-hover:scale-110 transition-transform">
                <Target className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Team Avg Score</p>
            </div>
            <p className="text-2xl font-bold">{avgCallScore}</p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" /> +3 from last period
            </p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10 group-hover:scale-110 transition-transform">
                <MessageSquare className="w-4 h-4 text-success" />
              </div>
              <p className="text-sm text-muted-foreground">Discovery Rate</p>
            </div>
            <p className="text-2xl font-bold">{avgDiscoveryRate}%</p>
            <p className="text-xs text-muted-foreground mt-1">Questions asked</p>
          </CardContent>
        </Card>
        <Card className="group hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10 group-hover:scale-110 transition-transform">
                <Headphones className="w-4 h-4 text-warning" />
              </div>
              <p className="text-sm text-muted-foreground">Talk Ratio</p>
            </div>
            <p className="text-2xl font-bold">{avgTalkRatio}%</p>
            <p className="text-xs text-muted-foreground mt-1">Rep vs prospect</p>
          </CardContent>
        </Card>
      </div>

      {/* Team Average Over Time Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Team Score Trend
                <Info className="w-4 h-4 text-muted-foreground" />
              </CardTitle>
              <p className="text-sm text-muted-foreground">Rolling average compared to top performer</p>
            </div>
            <div className="flex items-center gap-2">
              {(["7d", "14d", "30d", "90d"] as const).map((window) => (
                <Button
                  key={window}
                  variant={timeWindow === window ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeWindow(window)}
                  className="text-xs"
                >
                  {window === "7d" ? "7D" : window === "14d" ? "14D" : window === "30d" ? "30D" : "90D"}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <ComposedChart data={currentTrendData}>
              <defs>
                <linearGradient id="teamAvgGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                domain={[40, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={avgCallScore} stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" label={{ value: `Avg: ${avgCallScore}`, position: 'right', fill: 'hsl(var(--muted-foreground))', fontSize: 11 }} />
              <Area 
                type="monotone" 
                dataKey="teamAvg" 
                name="Team Average"
                stroke="hsl(var(--primary))" 
                fill="url(#teamAvgGradient)" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="topRep" 
                name="Top Rep"
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-3 rounded-full bg-primary" />
              <span className="text-muted-foreground">Team Average</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="w-3 h-1 bg-success" style={{ borderStyle: 'dashed' }} />
              <span className="text-muted-foreground">Top Rep ({topRep.name})</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Per-Rep Performance Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Above Average */}
        <Card className="border-success/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Above Team Average ({aboveAverage.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Reps scoring above the {avgCallScore} team average
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {aboveAverage.map((rep, index) => {
              const scoreDisplay = getScoreChangeDisplay(rep);
              const Icon = scoreDisplay.icon;
              return (
                <div 
                  key={rep.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20 cursor-pointer hover:bg-success/10 transition-colors group"
                  onClick={() => setSelectedRep(rep)}
                >
                  <div className="relative">
                    <div 
                      className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm"
                      style={{ backgroundColor: rep.color }}
                    >
                      {rep.avatar}
                    </div>
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                        <span className="text-[10px]">👑</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{rep.name}</p>
                    <p className="text-xs text-muted-foreground">{rep.calls} calls • {rep.practiceCount} practices</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{rep.callScore}</p>
                    <p className={`text-xs flex items-center justify-end gap-0.5 ${scoreDisplay.color}`}>
                      <Icon className="w-3 h-3" />
                      {scoreDisplay.text} vs avg
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Below Average */}
        <Card className="border-destructive/30">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-destructive" />
              Below Team Average ({belowAverage.length})
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Reps scoring below the {avgCallScore} team average
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            {belowAverage.map((rep) => {
              const scoreDisplay = getScoreChangeDisplay(rep);
              const Icon = scoreDisplay.icon;
              return (
                <div 
                  key={rep.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-destructive/5 border border-destructive/20 cursor-pointer hover:bg-destructive/10 transition-colors group"
                  onClick={() => setSelectedRep(rep)}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm"
                    style={{ backgroundColor: rep.color }}
                  >
                    {rep.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{rep.name}</p>
                    <p className="text-xs text-muted-foreground">{rep.calls} calls • {rep.practiceCount} practices</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">{rep.callScore}</p>
                    <p className={`text-xs flex items-center justify-end gap-0.5 ${scoreDisplay.color}`}>
                      <Icon className="w-3 h-3" />
                      {scoreDisplay.text} vs avg
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Full Rep Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">All Reps Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Click on a rep to see detailed coaching insights and comparison with top performers</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Representative</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Calls</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Score</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">vs Avg</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Practices</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Trend</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockReps.sort((a, b) => b.callScore - a.callScore).map((rep, index) => {
                  const diff = rep.callScore - avgCallScore;
                  return (
                    <tr 
                      key={rep.id} 
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group"
                      onClick={() => setSelectedRep(rep)}
                    >
                      <td className="py-4 px-6">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${
                          index === 0 ? "bg-amber-100 text-amber-700" : 
                          index === 1 ? "bg-slate-100 text-slate-600" : 
                          index === 2 ? "bg-orange-100 text-orange-700" :
                          "text-muted-foreground"
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm group-hover:scale-105 transition-transform"
                            style={{ backgroundColor: rep.color }}
                          >
                            {rep.avatar}
                          </div>
                          <span className="font-medium">{rep.name}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center font-medium">{rep.calls}</td>
                      <td className="py-4 px-6 text-center">
                        <span className={`font-medium ${
                          rep.callScore >= 70 ? "text-success" : 
                          rep.callScore >= 50 ? "text-warning" : 
                          "text-muted-foreground"
                        }`}>
                          {rep.callScore}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            diff > 0 ? "bg-success/10 text-success border-success/20" : 
                            diff < 0 ? "bg-destructive/10 text-destructive border-destructive/20" : 
                            "bg-muted text-muted-foreground"
                          }`}
                        >
                          {diff > 0 ? `+${diff}` : diff}
                        </Badge>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="font-medium">{rep.practiceCount}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        {rep.scoreChange > 0 ? (
                          <span className="text-success flex items-center justify-center gap-1">
                            <TrendingUp className="w-4 h-4" />
                            +{rep.scoreChange}
                          </span>
                        ) : rep.scoreChange < 0 ? (
                          <span className="text-destructive flex items-center justify-center gap-1">
                            <TrendingDown className="w-4 h-4" />
                            {rep.scoreChange}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="gap-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRep(rep);
                          }}
                        >
                          View <ChevronRight className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsPage;
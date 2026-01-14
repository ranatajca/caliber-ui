import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Clock, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Users,
  BarChart3,
  Filter,
  Download,
  Bot,
  Video,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  Trophy,
  Calendar,
  Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from "recharts";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";

interface Rep {
  id: string;
  name: string;
  avatar: string;
  score: number;
  scoreChange: number;
  calls: number;
  callsChange: number;
  closeRate: number;
  closeRateChange: number;
  talkRatio: number;
  topStrength: string;
  weakestArea: string;
}

const mockReps: Rep[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", score: 92, scoreChange: 5, calls: 48, callsChange: 12, closeRate: 34, closeRateChange: 8, talkRatio: 38, topStrength: "Discovery", weakestArea: "Closing" },
  { id: "2", name: "Marcus Johnson", avatar: "MJ", score: 88, scoreChange: -2, calls: 52, callsChange: -3, closeRate: 28, closeRateChange: -5, talkRatio: 45, topStrength: "Objection Handling", weakestArea: "Opening" },
  { id: "3", name: "Emily Rodriguez", avatar: "ER", score: 85, scoreChange: 3, calls: 41, callsChange: 8, closeRate: 31, closeRateChange: 2, talkRatio: 42, topStrength: "Rapport Building", weakestArea: "ROI Discussion" },
  { id: "4", name: "David Kim", avatar: "DK", score: 82, scoreChange: 7, calls: 38, callsChange: 15, closeRate: 26, closeRateChange: 4, talkRatio: 48, topStrength: "Technical Demo", weakestArea: "Next Steps" },
  { id: "5", name: "Lisa Thompson", avatar: "LT", score: 79, scoreChange: -4, calls: 35, callsChange: -8, closeRate: 22, closeRateChange: -3, talkRatio: 52, topStrength: "Relationship", weakestArea: "Discovery" },
];

const weeklyTrendData = [
  { day: "Mon", live: 65, ai: 78, goal: 75 },
  { day: "Tue", live: 72, ai: 82, goal: 75 },
  { day: "Wed", live: 68, ai: 85, goal: 75 },
  { day: "Thu", live: 75, ai: 88, goal: 75 },
  { day: "Fri", live: 82, ai: 90, goal: 75 },
];

const callVolumeData = [
  { week: "W1", live: 120, ai: 85 },
  { week: "W2", live: 145, ai: 92 },
  { week: "W3", live: 132, ai: 110 },
  { week: "W4", live: 158, ai: 125 },
];

const timeFilters = ["Today", "This Week", "This Month", "This Quarter", "Custom"];
const sourceFilters = ["All Sources", "Live Calls Only", "AI Roleplays Only"];

const MetricsPage = () => {
  const navigate = useNavigate();
  const { isManager } = useRole();
  const [timeFilter, setTimeFilter] = useState("This Week");
  const [sourceFilter, setSourceFilter] = useState("All Sources");
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null);
  const [showDrillDown, setShowDrillDown] = useState(false);

  // Redirect reps to leaderboard
  useEffect(() => {
    if (!isManager) {
      navigate("/leaderboard", { replace: true });
    }
  }, [isManager, navigate]);

  // If not manager, show nothing while redirecting
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

  const teamKPIs = [
    { label: "Avg Team Score", value: "85.2", change: "+3.2", trend: "up", icon: Target },
    { label: "Total Calls", value: "214", change: "+18%", trend: "up", icon: Phone },
    { label: "Close Rate", value: "28.3%", change: "-2.1%", trend: "down", icon: TrendingUp },
    { label: "Avg Talk Ratio", value: "42%", change: "+5%", trend: "up", icon: Clock },
  ];

  const handleRepClick = (rep: Rep) => {
    setSelectedRep(rep);
    setShowDrillDown(true);
  };

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
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Metrics Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Team performance at a glance • Real-time insights
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {timeFilters.map(filter => (
                <SelectItem key={filter} value={filter}>{filter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sourceFilter} onValueChange={setSourceFilter}>
            <SelectTrigger className="w-44">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sourceFilters.map(filter => (
                <SelectItem key={filter} value={filter}>{filter}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => toast.info("Refreshing data...")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button variant="outline" className="gap-2" onClick={() => toast.success("Report exported!")}>
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {teamKPIs.map((kpi) => (
          <Card key={kpi.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="w-5 h-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${kpi.trend === "up" ? "text-success" : "text-destructive"}`}>
                  {kpi.trend === "up" ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  {kpi.change}
                </div>
              </div>
              <p className="text-2xl md:text-3xl font-bold">{kpi.value}</p>
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Trend Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Score Trend</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  Live Calls
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  AI Roleplays
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyTrendData}>
                <defs>
                  <linearGradient id="colorLive" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} domain={[50, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="live" name="Live" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorLive)" strokeWidth={2} />
                <Area type="monotone" dataKey="ai" name="AI" stroke="hsl(var(--accent))" fillOpacity={1} fill="url(#colorAI)" strokeWidth={2} />
                <Line type="monotone" dataKey="goal" name="Goal" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={1} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Call Volume Chart */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Call Volume by Source</CardTitle>
              <Badge variant="secondary" className="gap-1">
                <Video className="w-3 h-3" />
                Live
                <span className="mx-1">vs</span>
                <Bot className="w-3 h-3" />
                AI
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={callVolumeData} barGap={8}>
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="live" name="Live Calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ai" name="AI Roleplays" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Rep Comparison Table */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5" />
              Rep Comparison
            </CardTitle>
            <Button variant="ghost" size="sm" className="gap-1" onClick={() => navigate("/leaderboard")}>
              View Leaderboard <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rep</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Score</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Calls</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Close Rate</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Talk Ratio</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Top Strength</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Needs Work</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {mockReps.map((rep, index) => (
                  <tr 
                    key={rep.id} 
                    className="border-b border-border/50 hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => handleRepClick(rep)}
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary">
                            {rep.avatar}
                          </div>
                          {index < 3 && (
                            <div className={`absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              index === 0 ? "bg-amber-400 text-amber-900" : 
                              index === 1 ? "bg-slate-300 text-slate-700" : "bg-orange-400 text-orange-900"
                            }`}>
                              {index + 1}
                            </div>
                          )}
                        </div>
                        <span className="font-medium">{rep.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`font-bold ${rep.score >= 85 ? "text-success" : rep.score >= 75 ? "text-warning" : "text-destructive"}`}>
                          {rep.score}
                        </span>
                        <span className={`text-xs ${rep.scoreChange >= 0 ? "text-success" : "text-destructive"}`}>
                          {rep.scoreChange >= 0 ? "+" : ""}{rep.scoreChange}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{rep.calls}</span>
                        <span className={`text-xs ${rep.callsChange >= 0 ? "text-success" : "text-destructive"}`}>
                          {rep.callsChange >= 0 ? "+" : ""}{rep.callsChange}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <span>{rep.closeRate}%</span>
                        <span className={`text-xs ${rep.closeRateChange >= 0 ? "text-success" : "text-destructive"}`}>
                          {rep.closeRateChange >= 0 ? "+" : ""}{rep.closeRateChange}%
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className={rep.talkRatio > 45 ? "text-warning" : "text-success"}>
                        {rep.talkRatio}%
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        {rep.topStrength}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                        {rep.weakestArea}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Rep Drill-Down Panel */}
      {showDrillDown && selectedRep && (
        <RepDrillDown rep={selectedRep} onClose={() => setShowDrillDown(false)} />
      )}
    </div>
  );
};

interface RepDrillDownProps {
  rep: Rep;
  onClose: () => void;
}

const RepDrillDown = ({ rep, onClose }: RepDrillDownProps) => {
  const navigate = useNavigate();
  
  const objections = [
    { name: "Price too high", count: 8, successRate: 75 },
    { name: "Already have a solution", count: 6, successRate: 50 },
    { name: "Need to think about it", count: 5, successRate: 40 },
    { name: "Not the right time", count: 4, successRate: 25 },
  ];

  const recentCalls = [
    { id: "1", buyer: "John Smith", score: 88, date: "Today, 2:30 PM", type: "Live" },
    { id: "2", buyer: "Emily Davis", score: 72, date: "Today, 11:15 AM", type: "AI" },
    { id: "3", buyer: "Michael Brown", score: 91, date: "Yesterday", type: "Live" },
  ];

  return (
    <Card className="border-primary/20 shadow-lg animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xl font-bold text-primary">
              {rep.avatar}
            </div>
            <div>
              <CardTitle className="text-xl">{rep.name}</CardTitle>
              <p className="text-muted-foreground">Detailed Performance Analysis</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <XCircle className="w-5 h-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strengths & Weaknesses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-success/5 border border-success/20 rounded-xl">
            <h4 className="font-medium text-success mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              Strengths
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-success" />
                {rep.topStrength} - Consistently scores above 90%
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-success" />
                Strong opening hooks, captures attention quickly
              </li>
              <li className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-success" />
                Excellent rapport building with prospects
              </li>
            </ul>
          </div>
          <div className="p-4 bg-warning/5 border border-warning/20 rounded-xl">
            <h4 className="font-medium text-warning mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Areas for Improvement
            </h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-warning" />
                {rep.weakestArea} - Needs more practice
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-warning" />
                Talk ratio slightly high at {rep.talkRatio}%
              </li>
              <li className="flex items-center gap-2">
                <AlertCircle className="w-3 h-3 text-warning" />
                Could improve ROI quantification
              </li>
            </ul>
          </div>
        </div>

        {/* Objection Handling */}
        <div>
          <h4 className="font-medium mb-3">Objection Handling Performance</h4>
          <div className="space-y-3">
            {objections.map((obj) => (
              <div key={obj.name} className="flex items-center gap-4">
                <span className="text-sm w-40 truncate">{obj.name}</span>
                <span className="text-xs text-muted-foreground w-16">{obj.count} times</span>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${obj.successRate >= 60 ? "bg-success" : obj.successRate >= 40 ? "bg-warning" : "bg-destructive"}`}
                    style={{ width: `${obj.successRate}%` }}
                  />
                </div>
                <span className={`text-sm font-medium w-12 ${obj.successRate >= 60 ? "text-success" : obj.successRate >= 40 ? "text-warning" : "text-destructive"}`}>
                  {obj.successRate}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Calls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium">Recent Calls</h4>
            <Button variant="ghost" size="sm" onClick={() => navigate("/calls")}>
              View All <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="space-y-2">
            {recentCalls.map((call) => (
              <div 
                key={call.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors"
                onClick={() => navigate(`/calls/${call.id}`)}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                    {call.buyer.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{call.buyer}</p>
                    <p className="text-xs text-muted-foreground">{call.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-xs">
                    {call.type === "Live" ? <Video className="w-3 h-3 mr-1" /> : <Bot className="w-3 h-3 mr-1" />}
                    {call.type}
                  </Badge>
                  <span className={`font-bold ${call.score >= 80 ? "text-success" : call.score >= 70 ? "text-warning" : "text-destructive"}`}>
                    {call.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <Button className="flex-1" onClick={() => navigate("/roleplays")}>
            <Bot className="w-4 h-4 mr-2" />
            Assign Practice
          </Button>
          <Button variant="outline" className="flex-1" onClick={() => navigate("/calls")}>
            <Phone className="w-4 h-4 mr-2" />
            Review Calls
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsPage;

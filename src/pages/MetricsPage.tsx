import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  TrendingUp, 
  Target, 
  ChevronRight, 
  Bot,
  RefreshCw,
  Calendar,
  Lock,
  Info,
  Headphones,
  MessageSquare,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
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
}

const mockReps: Rep[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", email: "sarah.chen@company.com", callScore: 84, calls: 23, roleplayScore: 88, talkRatio: 38, discoveryRate: 91, objectionHandling: 82, color: "#6366F1" },
  { id: "2", name: "Marcus Johnson", avatar: "MJ", email: "marcus.j@company.com", callScore: 76, calls: 18, roleplayScore: 72, talkRatio: 52, discoveryRate: 74, objectionHandling: 69, color: "#EC4899" },
  { id: "3", name: "Elena Rodriguez", avatar: "ER", email: "elena.r@company.com", callScore: 71, calls: 14, roleplayScore: 78, talkRatio: 45, discoveryRate: 68, objectionHandling: 72, color: "#14B8A6" },
  { id: "4", name: "James Mitchell", avatar: "JM", email: "james.m@company.com", callScore: 62, calls: 11, roleplayScore: 58, talkRatio: 58, discoveryRate: 55, objectionHandling: 51, color: "#F59E0B" },
  { id: "5", name: "Aisha Patel", avatar: "AP", email: "aisha.p@company.com", callScore: 54, calls: 7, roleplayScore: 48, talkRatio: 62, discoveryRate: 46, objectionHandling: 42, color: "#8B5CF6" },
  { id: "6", name: "Ryan O'Connor", avatar: "RO", email: "ryan.o@company.com", callScore: 45, calls: 5, roleplayScore: 41, talkRatio: 67, discoveryRate: 38, objectionHandling: 35, color: "#06B6D4" },
  { id: "7", name: "Nina Kowalski", avatar: "NK", email: "nina.k@company.com", callScore: 38, calls: 3, roleplayScore: 32, talkRatio: 71, discoveryRate: 28, objectionHandling: 25, color: "#EF4444" },
  { id: "8", name: "Derek Thompson", avatar: "DT", email: "derek.t@company.com", callScore: 28, calls: 2, roleplayScore: 24, talkRatio: 74, discoveryRate: 20, objectionHandling: 18, color: "#22C55E" },
];

// Performance trend data
const performanceTrendData = [
  { month: "Aug", "Sarah Chen": 52, "Marcus Johnson": 45, "Elena Rodriguez": 38, "James Mitchell": 28, "Aisha Patel": 22 },
  { month: "Sep", "Sarah Chen": 58, "Marcus Johnson": 52, "Elena Rodriguez": 45, "James Mitchell": 35, "Aisha Patel": 28 },
  { month: "Oct", "Sarah Chen": 65, "Marcus Johnson": 58, "Elena Rodriguez": 52, "James Mitchell": 42, "Aisha Patel": 35 },
  { month: "Nov", "Sarah Chen": 74, "Marcus Johnson": 65, "Elena Rodriguez": 61, "James Mitchell": 52, "Aisha Patel": 42 },
  { month: "Dec", "Sarah Chen": 80, "Marcus Johnson": 72, "Elena Rodriguez": 68, "James Mitchell": 58, "Aisha Patel": 48 },
  { month: "Jan", "Sarah Chen": 84, "Marcus Johnson": 76, "Elena Rodriguez": 71, "James Mitchell": 62, "Aisha Patel": 54 },
];

const sourceFilters = ["Live Calls", "AI Roleplay"];

const MetricsPage = () => {
  const navigate = useNavigate();
  const { isManager } = useRole();
  const [sourceFilter, setSourceFilter] = useState("Live Calls");
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null);
  const [metricFilter, setMetricFilter] = useState("Call Score");

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
        onBack={() => setSelectedRep(null)} 
      />
    );
  }

  const totalCalls = mockReps.reduce((sum, rep) => sum + rep.calls, 0);
  const activeReps = mockReps.filter(r => r.calls > 0);
  const avgCallScore = Math.round(activeReps.reduce((sum, rep) => sum + rep.callScore, 0) / activeReps.length);
  const avgTalkRatio = Math.round(activeReps.reduce((sum, rep) => sum + rep.talkRatio, 0) / activeReps.length);
  const avgDiscoveryRate = Math.round(activeReps.reduce((sum, rep) => sum + rep.discoveryRate, 0) / activeReps.length);

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

  const topReps = mockReps.slice(0, 5);

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
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Last 6 months
          </Button>
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
        <Card className="group hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10 group-hover:scale-110 transition-transform">
                <Target className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Avg Call Score</p>
            </div>
            <p className="text-2xl font-bold">{avgCallScore}</p>
            <p className="text-xs text-muted-foreground mt-1">Team average</p>
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

      {/* Performance Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Score Trend by Rep</CardTitle>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <Select value={metricFilter} onValueChange={setMetricFilter}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Call Score">Call Score</SelectItem>
                <SelectItem value="Roleplay Score">Roleplay Score</SelectItem>
                <SelectItem value="Discovery Rate">Discovery Rate</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">Track improvement over time</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={performanceTrendData}>
              <XAxis 
                dataKey="month" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} 
                domain={[0, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              {topReps.map((rep) => (
                <Line 
                  key={rep.id}
                  type="monotone" 
                  dataKey={rep.name} 
                  stroke={rep.color} 
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            {topReps.map((rep) => (
              <div key={rep.id} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: rep.color }} />
                <span className="text-muted-foreground">{rep.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rep Table */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Rep Performance Overview</CardTitle>
          <p className="text-sm text-muted-foreground">Click on a rep to see detailed coaching insights</p>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Representative</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Calls</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Call Score</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Roleplay</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Talk %</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockReps.map((rep, index) => (
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
                      <span className={`font-medium ${
                        rep.roleplayScore >= 70 ? "text-success" : 
                        rep.roleplayScore >= 50 ? "text-warning" : 
                        "text-muted-foreground"
                      }`}>
                        {rep.roleplayScore}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className={`font-medium ${
                        rep.talkRatio <= 50 ? "text-success" : 
                        rep.talkRatio <= 60 ? "text-warning" : 
                        rep.talkRatio > 0 ? "text-destructive" :
                        "text-muted-foreground"
                      }`}>
                        {rep.talkRatio > 0 ? `${rep.talkRatio}%` : "—"}
                      </span>
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
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MetricsPage;

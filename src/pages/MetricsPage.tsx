import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  TrendingUp, 
  TrendingDown,
  Target, 
  ChevronRight, 
  Users,
  Filter,
  Download,
  Bot,
  Video,
  RefreshCw,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Lock,
  ArrowLeft,
  Info,
  DollarSign
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
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";
import RepDetailPage from "@/components/metrics/RepDetailPage";

interface Rep {
  id: string;
  name: string;
  avatar: string;
  email: string;
  score: number;
  calls: number;
  winRate: number;
  revenue: number;
  color: string;
}

const mockReps: Rep[] = [
  { id: "1", name: "Daisy Nicolle", avatar: "DN", email: "daisy.nicolle@company.com", score: 78, calls: 16, winRate: 69, revenue: 11000, color: "#3B82F6" },
  { id: "2", name: "Luke Ward", avatar: "LW", email: "luke.ward@company.com", score: 72, calls: 12, winRate: 45, revenue: 8500, color: "#EF4444" },
  { id: "3", name: "Mostafa", avatar: "M", email: "mostafa@company.com", score: 65, calls: 8, winRate: 25, revenue: 4200, color: "#22C55E" },
  { id: "4", name: "Phil", avatar: "P", email: "phil@company.com", score: 58, calls: 6, winRate: 15, revenue: 2100, color: "#A855F7" },
  { id: "5", name: "Lucas", avatar: "L", email: "lucas@company.com", score: 45, calls: 4, winRate: 10, revenue: 1500, color: "#F97316" },
  { id: "6", name: "Joel", avatar: "J", email: "joel@company.com", score: 38, calls: 3, winRate: 8, revenue: 800, color: "#06B6D4" },
  { id: "7", name: "Mostafa Akkila", avatar: "MA", email: "mostafa.akkila@company.com", score: 32, calls: 2, winRate: 5, revenue: 400, color: "#EC4899" },
  { id: "8", name: "Savannah", avatar: "S", email: "savannah@company.com", score: 25, calls: 1, winRate: 0, revenue: 0, color: "#EAB308" },
  { id: "9", name: "Steven", avatar: "S", email: "steven@company.com", score: 20, calls: 0, winRate: 0, revenue: 0, color: "#6366F1" },
  { id: "10", name: "Lukealexxander12", avatar: "L", email: "luke.alex@company.com", score: 15, calls: 0, winRate: 0, revenue: 0, color: "#14B8A6" },
  { id: "11", name: "Aamir Khan", avatar: "AK", email: "aamir.khan@company.com", score: 10, calls: 0, winRate: 0, revenue: 0, color: "#F43F5E" },
  { id: "12", name: "Steven Brooks", avatar: "SB", email: "steven.brooks@company.com", score: 8, calls: 0, winRate: 0, revenue: 0, color: "#8B5CF6" },
];

// Performance trend data - shows each rep's score over months
const performanceTrendData = [
  { month: "Jan", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Feb", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Mar", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Apr", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "May", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Jun", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Jul", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Aug", "Daisy Nicolle": 0, "Luke Ward": 0, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Sep", "Daisy Nicolle": 10, "Luke Ward": 5, "Mostafa": 0, "Phil": 0, "Lucas": 0 },
  { month: "Oct", "Daisy Nicolle": 45, "Luke Ward": 25, "Mostafa": 18, "Phil": 12, "Lucas": 8 },
  { month: "Nov", "Daisy Nicolle": 68, "Luke Ward": 52, "Mostafa": 45, "Phil": 35, "Lucas": 28 },
  { month: "Dec", "Daisy Nicolle": 78, "Luke Ward": 72, "Mostafa": 65, "Phil": 58, "Lucas": 45 },
];

const sourceFilters = ["Live Calls", "AI Roleplay"];

const MetricsPage = () => {
  const navigate = useNavigate();
  const { isManager } = useRole();
  const [sourceFilter, setSourceFilter] = useState("Live Calls");
  const [selectedRep, setSelectedRep] = useState<Rep | null>(null);
  const [metricFilter, setMetricFilter] = useState("Live Call Score");

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

  // Show rep detail page if a rep is selected
  if (selectedRep) {
    return (
      <RepDetailPage 
        rep={selectedRep} 
        onBack={() => setSelectedRep(null)} 
      />
    );
  }

  // Calculate team KPIs
  const totalRevenue = mockReps.reduce((sum, rep) => sum + rep.revenue, 0);
  const totalCalls = mockReps.reduce((sum, rep) => sum + rep.calls, 0);
  const avgScore = Math.round(mockReps.reduce((sum, rep) => sum + rep.score, 0) / mockReps.length);
  const avgWinRate = Math.round(mockReps.filter(r => r.calls > 0).reduce((sum, rep) => sum + rep.winRate, 0) / mockReps.filter(r => r.calls > 0).length);

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

  // Get top 5 reps for the chart legend
  const topReps = mockReps.slice(0, 5);

  return (
    <div className="p-4 md:p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Metrics</h1>
          <p className="text-muted-foreground mt-1">
            Overview of team sales performance and coaching insights
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
                {filter} {filter === "Live Calls" ? `(${totalCalls})` : "(129)"}
              </button>
            ))}
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            Sep 01, 2025 - Jan 06, 2026
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toast.info("Refreshing data...")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Team KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Cash Collected</p>
            <p className="text-3xl font-bold">${totalRevenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Total revenue generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Avg Live Score</p>
            <p className="text-3xl font-bold">{avgScore}</p>
            <p className="text-sm text-muted-foreground mt-1">Across {totalCalls} live calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Close Rate</p>
            <p className="text-3xl font-bold">{avgWinRate}%</p>
            <p className="text-sm text-muted-foreground mt-1">Across {totalCalls} calls</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance per Rep Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Performance per Rep</CardTitle>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <Select value={metricFilter} onValueChange={setMetricFilter}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Live Call Score">Live Call Score</SelectItem>
                <SelectItem value="Close Rate">Close Rate</SelectItem>
                <SelectItem value="Revenue">Revenue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-muted-foreground">Individual trends for all team members</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
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
                domain={[0, 105]}
                ticks={[15, 30, 45, 60, 75, 90, 105]}
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
          {/* Legend */}
          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
            {mockReps.map((rep) => (
              <div key={rep.id} className="flex items-center gap-2 text-sm">
                <span 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: rep.color }}
                />
                <span className="text-muted-foreground">{rep.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rep Ranking Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Representative</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Calls</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Win Rate</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Revenue</th>
                  <th className="text-center py-4 px-6 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {mockReps.map((rep, index) => (
                  <tr 
                    key={rep.id} 
                    className="border-b border-border/50 hover:bg-muted/30 transition-colors"
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
                          className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white text-sm"
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
                        rep.winRate >= 50 ? "text-success" : 
                        rep.winRate > 0 ? "text-warning" : 
                        "text-muted-foreground"
                      }`}>
                        {rep.winRate}%
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-medium">
                      ${rep.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="gap-1 text-muted-foreground hover:text-foreground"
                        onClick={() => setSelectedRep(rep)}
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

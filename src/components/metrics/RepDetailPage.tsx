import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft,
  Calendar,
  RefreshCw,
  Bot,
  Video,
  ChevronRight,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { toast } from "sonner";

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

interface RepDetailPageProps {
  rep: Rep;
  onBack: () => void;
}

// Mock performance data for this rep
const getRepPerformanceData = (repName: string) => [
  { month: "Jan", score: 0 },
  { month: "Feb", score: 0 },
  { month: "Mar", score: 0 },
  { month: "Apr", score: 0 },
  { month: "May", score: 0 },
  { month: "Jun", score: 0 },
  { month: "Jul", score: 0 },
  { month: "Aug", score: 0 },
  { month: "Sep", score: repName === "Daisy Nicolle" ? 10 : 5 },
  { month: "Oct", score: repName === "Daisy Nicolle" ? 45 : 25 },
  { month: "Nov", score: repName === "Daisy Nicolle" ? 68 : 52 },
  { month: "Dec", score: repName === "Daisy Nicolle" ? 78 : 65 },
];

// Mock objections data
const getRepObjections = (repName: string) => {
  if (repName === "Daisy Nicolle") {
    return [
      { name: "price", count: 3, percentage: 23 },
      { name: "commission split", count: 2, percentage: 15 },
      { name: "spouse-approval", count: 1, percentage: 8 },
      { name: "Price / Budget", count: 1, percentage: 8 },
      { name: "Price", count: 1, percentage: 8 },
    ];
  }
  return [];
};

// Mock strengths data
const getRepStrengths = (repName: string) => {
  if (repName === "Daisy Nicolle") {
    return [
      { name: "Discovery", count: 4, percentage: 11 },
      { name: "Objection handling", count: 3, percentage: 8 },
      { name: "Discovery question", count: 2, percentage: 5 },
      { name: "empathy", count: 1, percentage: 3 },
      { name: "asking goal-based questions", count: 1, percentage: 3 },
    ];
  }
  return [];
};

// Mock skill profile
const getSkillProfile = (repName: string) => {
  if (repName === "Daisy Nicolle") {
    return { skill: "Listening", score: 23, status: "Needs Focus" };
  }
  return null;
};

const sourceFilters = ["Live Calls", "AI Roleplay"];

const RepDetailPage = ({ rep, onBack }: RepDetailPageProps) => {
  const navigate = useNavigate();
  const [sourceFilter, setSourceFilter] = useState("Live Calls");

  const performanceData = getRepPerformanceData(rep.name);
  const objections = getRepObjections(rep.name);
  const strengths = getRepStrengths(rep.name);
  const skillProfile = getSkillProfile(rep.name);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium text-sm mb-1">{label}</p>
          <p className="text-sm text-primary">Score: {payload[0].value}</p>
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
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-bold">{rep.name}</h1>
            <p className="text-muted-foreground">{rep.email}</p>
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
            Sep 01, 2025 - Jan 06, 2026
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toast.info("Refreshing data...")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Rep KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Cash Collected</p>
            <p className="text-3xl font-bold">${rep.revenue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Revenue generated</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Avg Live Score</p>
            <p className="text-3xl font-bold">{rep.score}</p>
            <p className="text-sm text-muted-foreground mt-1">Across {rep.calls} calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground mb-1">Close Rate</p>
            <p className="text-3xl font-bold">{rep.winRate}%</p>
            <p className="text-sm text-muted-foreground mt-1">Win rate</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Performance Trend</CardTitle>
          <p className="text-sm text-muted-foreground">Metrics over time for {rep.name}</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
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
                ticks={[25, 50, 75, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke={rep.color} 
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Bottom Section - 3 columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Performance Profile */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Performance Profile</CardTitle>
            <p className="text-sm text-muted-foreground">{rep.name}'s sales skill scores</p>
          </CardHeader>
          <CardContent>
            {skillProfile ? (
              <div className="space-y-4">
                {/* Radar-style visualization */}
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="relative w-48 h-48">
                    {/* Background circles */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="35" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="25" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                      <circle cx="50" cy="50" r="15" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" />
                      {/* Score indicator */}
                      <circle 
                        cx="50" 
                        cy={50 - (skillProfile.score / 100 * 45)} 
                        r="4" 
                        fill={rep.color}
                      />
                      {/* Label line */}
                      <line 
                        x1="50" 
                        y1={50 - (skillProfile.score / 100 * 45)} 
                        x2="75" 
                        y2={50 - (skillProfile.score / 100 * 45) - 10}
                        stroke="hsl(var(--border))"
                        strokeWidth="0.5"
                      />
                    </svg>
                    {/* Label */}
                    <div className="absolute top-1/4 right-0 text-sm">
                      <p className="font-medium">{skillProfile.skill}</p>
                      <p className="text-muted-foreground">{skillProfile.score}/100</p>
                      <p className="text-destructive text-xs">{skillProfile.status}</p>
                    </div>
                    {/* Listening label at top */}
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      Listening
                    </div>
                  </div>
                </div>
                <div className="text-center border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">
                    Average: <span className="text-warning font-medium">{skillProfile.score}/100</span>{" "}
                    <span className="text-destructive">({skillProfile.status})</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground text-sm">No skill data yet for {rep.name}</p>
                <div className="mt-4 text-xs text-muted-foreground">Discovery</div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Top Objections */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Top Objections</CardTitle>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Most common objections encountered • click to view calls</p>
          </CardHeader>
          <CardContent>
            {objections.length > 0 ? (
              <div className="space-y-2">
                {objections.map((objection, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted cursor-pointer transition-colors group"
                    onClick={() => navigate("/calls")}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                        {objection.name}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{objection.count} call{objection.count !== 1 ? 's' : ''}</p>
                      <p className="text-xs text-muted-foreground">{objection.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm italic">No objection data available yet.</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Key Strengths */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Key Strengths</CardTitle>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Most frequently demonstrated skills • click to view calls</p>
          </CardHeader>
          <CardContent>
            {strengths.length > 0 ? (
              <div className="space-y-2">
                {strengths.map((strength, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted cursor-pointer transition-colors group"
                    onClick={() => navigate("/calls")}
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
                        {strength.name}
                      </Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">{strength.count} call{strength.count !== 1 ? 's' : ''}</p>
                      <p className="text-xs text-muted-foreground">{strength.percentage}% of total</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-12">
                <p className="text-muted-foreground text-sm italic">No strength data available.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RepDetailPage;

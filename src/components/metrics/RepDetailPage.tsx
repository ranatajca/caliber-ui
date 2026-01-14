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
  TrendingUp
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
  ResponsiveContainer
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

// Mock skill breakdown
const getSkillBreakdown = (rep: Rep) => {
  return [
    { name: "Discovery Questions", score: rep.discoveryRate, target: 80 },
    { name: "Active Listening", score: Math.max(100 - rep.talkRatio, 20), target: 70 },
    { name: "Objection Handling", score: rep.objectionHandling, target: 75 },
    { name: "Next Steps", score: Math.round(rep.callScore * 0.9), target: 80 },
    { name: "Rapport Building", score: Math.round(rep.callScore * 1.05), target: 70 },
  ];
};

const sourceFilters = ["Live Calls", "AI Roleplay"];

const RepDetailPage = ({ rep, onBack }: RepDetailPageProps) => {
  const navigate = useNavigate();
  const [sourceFilter, setSourceFilter] = useState("Live Calls");

  const performanceData = getRepPerformanceData(rep.name);
  const objections = getRepObjections(rep.name);
  const strengths = getRepStrengths(rep.name);
  const skillBreakdown = getSkillBreakdown(rep);

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
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-full flex items-center justify-center font-semibold text-white"
              style={{ backgroundColor: rep.color }}
            >
              {rep.avatar}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display font-bold">{rep.name}</h1>
              <p className="text-muted-foreground">{rep.email}</p>
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
            Sep 01, 2025 - Jan 06, 2026
          </Button>
          <Button variant="ghost" size="icon" onClick={() => toast.info("Refreshing data...")}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Rep KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <Phone className="w-4 h-4 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">Calls Reviewed</p>
            </div>
            <p className="text-2xl font-bold">{rep.calls}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-accent/10">
                <Target className="w-4 h-4 text-accent" />
              </div>
              <p className="text-sm text-muted-foreground">Call Score</p>
            </div>
            <p className="text-2xl font-bold">{rep.callScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-success/10">
                <Zap className="w-4 h-4 text-success" />
              </div>
              <p className="text-sm text-muted-foreground">Roleplay Score</p>
            </div>
            <p className="text-2xl font-bold">{rep.roleplayScore}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-warning/10">
                <Headphones className="w-4 h-4 text-warning" />
              </div>
              <p className="text-sm text-muted-foreground">Talk Ratio</p>
            </div>
            <p className="text-2xl font-bold">{rep.talkRatio > 0 ? `${rep.talkRatio}%` : "—"}</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend Chart */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-muted-foreground" />
            <CardTitle className="text-lg">Performance Trend</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">Call score improvement over time</p>
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

      {/* Skill Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Skill Breakdown</CardTitle>
          <p className="text-sm text-muted-foreground">Performance across key coaching areas</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {skillBreakdown.map((skill, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className={`font-medium ${
                    skill.score >= skill.target ? "text-success" : 
                    skill.score >= skill.target * 0.7 ? "text-warning" : 
                    "text-destructive"
                  }`}>
                    {skill.score}/100
                  </span>
                </div>
                <div className="relative">
                  <Progress value={skill.score} className="h-2" />
                  {/* Target marker */}
                  <div 
                    className="absolute top-0 w-0.5 h-2 bg-foreground/50"
                    style={{ left: `${skill.target}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Target: {skill.target}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Bottom Section - 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Objections */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">Top Objections Faced</CardTitle>
              <Info className="w-4 h-4 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Click to view related calls</p>
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
            <p className="text-sm text-muted-foreground">Click to view related calls</p>
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

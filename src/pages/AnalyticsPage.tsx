import { useState, forwardRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown, 
  ChevronRight,
  Settings2,
  Download,
  Info,
  RotateCcw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  ReferenceLine,
  Area,
  AreaChart,
  Legend,
} from "recharts";

const timeFilters = ["7D", "30D", "3M", "6M"];

type WeeklyData = { week: string; passed: number; failed: number; goal: number };

const weeklyDataByFilter: Record<string, WeeklyData[]> = {
  "7D": [
    { week: "Mon", passed: 22, failed: 8, goal: 30 },
    { week: "Tue", passed: 28, failed: 12, goal: 30 },
    { week: "Wed", passed: 18, failed: 20, goal: 30 },
    { week: "Thu", passed: 25, failed: 10, goal: 30 },
    { week: "Fri", passed: 20, failed: 15, goal: 30 },
    { week: "Sat", passed: 12, failed: 5, goal: 30 },
    { week: "Sun", passed: 8, failed: 3, goal: 30 },
  ],
  "30D": [
    { week: "Week 1", passed: 85, failed: 35, goal: 120 },
    { week: "Week 2", passed: 92, failed: 28, goal: 120 },
    { week: "Week 3", passed: 78, failed: 42, goal: 120 },
    { week: "Week 4", passed: 105, failed: 25, goal: 120 },
  ],
  "3M": [
    { week: "Jan", passed: 320, failed: 130, goal: 400 },
    { week: "Feb", passed: 350, failed: 100, goal: 400 },
    { week: "Mar", passed: 380, failed: 90, goal: 400 },
  ],
  "6M": [
    { week: "Jul", passed: 280, failed: 150, goal: 400 },
    { week: "Aug", passed: 310, failed: 130, goal: 400 },
    { week: "Sep", passed: 340, failed: 110, goal: 400 },
    { week: "Oct", passed: 360, failed: 100, goal: 400 },
    { week: "Nov", passed: 380, failed: 90, goal: 400 },
    { week: "Dec", passed: 400, failed: 80, goal: 400 },
  ],
};

const scoreDataByFilter: Record<string, { name: string; score: number; goal: number }[]> = {
  "7D": [
    { name: "Mon", score: 45, goal: 70 },
    { name: "Tue", score: 52, goal: 70 },
    { name: "Wed", score: 48, goal: 70 },
    { name: "Thu", score: 61, goal: 70 },
    { name: "Fri", score: 58, goal: 70 },
    { name: "Sat", score: 72, goal: 70 },
    { name: "Sun", score: 75, goal: 70 },
  ],
  "30D": [
    { name: "Week 1", score: 52, goal: 70 },
    { name: "Week 2", score: 58, goal: 70 },
    { name: "Week 3", score: 64, goal: 70 },
    { name: "Week 4", score: 68, goal: 70 },
  ],
  "3M": [
    { name: "Jan", score: 55, goal: 70 },
    { name: "Feb", score: 62, goal: 70 },
    { name: "Mar", score: 71, goal: 70 },
  ],
  "6M": [
    { name: "Jul", score: 42, goal: 70 },
    { name: "Aug", score: 48, goal: 70 },
    { name: "Sep", score: 55, goal: 70 },
    { name: "Oct", score: 61, goal: 70 },
    { name: "Nov", score: 68, goal: 70 },
    { name: "Dec", score: 74, goal: 70 },
  ],
};

const teamStats: Record<string, { performance: string; calls: number; callsTotal: number; avgScore: number; avgScoreChange: number; conversionRate: number }> = {
  "Onboarding team": { performance: "6.5", calls: 457, callsTotal: 700, avgScore: 60, avgScoreChange: -32, conversionRate: 60 },
  "Enterprise team": { performance: "7.8", calls: 312, callsTotal: 500, avgScore: 72, avgScoreChange: 15, conversionRate: 68 },
  "SMB team": { performance: "5.2", calls: 589, callsTotal: 800, avgScore: 48, avgScoreChange: -8, conversionRate: 45 },
};

const objectionHandling = [
  { objection: "I'm doing well, what's the plan for today?", success: 32, total: 52, percentage: 62 },
  { objection: "Did the seller discuss the agenda and ask for input?", success: 32, total: 52, percentage: 62 },
  { objection: "We already use a competitor's solution.", success: 28, total: 45, percentage: 62 },
  { objection: "I need to talk to my team first.", success: 18, total: 38, percentage: 47 },
];

interface ScoreCardSettings {
  targetScore: number;
  showComparison: boolean;
  alertThreshold: number;
}

const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-success flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-accent" />
            Passed: {payload[0]?.value}
          </p>
          <p className="text-destructive flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-destructive" />
            Failed: {payload[1]?.value}
          </p>
          <p className="text-muted-foreground border-t border-border pt-1 mt-1">
            Goal: {payload[0]?.payload?.goal}
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const CustomLineTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-popover border border-border rounded-lg shadow-lg p-3 text-sm">
        <p className="font-medium mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-accent flex items-center gap-2">
            <span className="w-2 h-2 rounded bg-accent" />
            Score: {payload[0]?.value}%
          </p>
          <p className="text-muted-foreground">
            Goal: {payload[0]?.payload?.goal}%
          </p>
        </div>
      </div>
    );
  }
  return null;
};

const AnalyticsPage = () => {
  const navigate = useNavigate();
  const [activeTimeFilter, setActiveTimeFilter] = useState("7D");
  const [selectedTeam, setSelectedTeam] = useState("Onboarding team");
  const [expandedObjection, setExpandedObjection] = useState<number | null>(null);
  const [scoreCardSettings, setScoreCardSettings] = useState<ScoreCardSettings>({
    targetScore: 7.0,
    showComparison: true,
    alertThreshold: 5.0,
  });
  const [scoreCardDialogOpen, setScoreCardDialogOpen] = useState(false);

  const weeklyData = weeklyDataByFilter[activeTimeFilter] || weeklyDataByFilter["7D"];
  const scoreData = scoreDataByFilter[activeTimeFilter] || scoreDataByFilter["7D"];
  const currentStats = teamStats[selectedTeam] || teamStats["Onboarding team"];

  const handleExportData = () => {
    const csvContent = [
      ["Period", "Passed", "Failed", "Goal"],
      ...weeklyData.map(d => [d.week, d.passed, d.failed, d.goal])
    ].map(row => row.join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-${selectedTeam.replace(/\s+/g, "-").toLowerCase()}-${activeTimeFilter}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Data exported successfully!");
  };

  const getPerformanceStatus = () => {
    const score = parseFloat(currentStats.performance);
    if (score >= scoreCardSettings.targetScore) return "success";
    if (score >= scoreCardSettings.alertThreshold) return "warning";
    return "danger";
  };

  const performanceStatus = getPerformanceStatus();

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold">Analytics</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Track team performance and identify areas for improvement
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-4">
          {/* Customize Goals Button - Now in header */}
          <Dialog open={scoreCardDialogOpen} onOpenChange={setScoreCardDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Settings2 className="w-4 h-4" />
                <span className="hidden sm:inline">Customize Goals</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Customize Score Card</DialogTitle>
                <DialogDescription>
                  Set your personal targets and alert thresholds
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Target Score</Label>
                    <span className="text-sm font-medium text-success">{scoreCardSettings.targetScore.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[scoreCardSettings.targetScore]}
                    onValueChange={([value]) => setScoreCardSettings(s => ({ ...s, targetScore: value }))}
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">Your performance goal to achieve</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Alert Threshold</Label>
                    <span className="text-sm font-medium text-warning">{scoreCardSettings.alertThreshold.toFixed(1)}</span>
                  </div>
                  <Slider
                    value={[scoreCardSettings.alertThreshold]}
                    onValueChange={([value]) => setScoreCardSettings(s => ({ ...s, alertThreshold: value }))}
                    min={1}
                    max={10}
                    step={0.5}
                    className="w-full"
                  />
                  <p className="text-xs text-muted-foreground">You'll be alerted when your score drops below this value</p>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <div>
                    <Label>Show Team Comparison</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">Compare your score with team average</p>
                  </div>
                  <Switch
                    checked={scoreCardSettings.showComparison}
                    onCheckedChange={(checked) => setScoreCardSettings(s => ({ ...s, showComparison: checked }))}
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 gap-2"
                    onClick={() => setScoreCardSettings({ targetScore: 7.0, showComparison: true, alertThreshold: 5.0 })}
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reset
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => {
                      setScoreCardDialogOpen(false);
                      toast.success("Score card settings saved!");
                    }}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" onClick={handleExportData} className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <select 
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(e.target.value);
              toast.info(`Switched to ${e.target.value}`);
            }}
            className="px-3 md:px-4 py-2 rounded-lg border border-border bg-card text-sm cursor-pointer hover:border-primary transition-colors"
          >
            <option>Onboarding team</option>
            <option>Enterprise team</option>
            <option>SMB team</option>
          </select>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => {
                  setActiveTimeFilter(filter);
                  toast.info(`Viewing ${filter === "7D" ? "last 7 days" : filter === "30D" ? "last 30 days" : filter === "3M" ? "last 3 months" : "last 6 months"}`);
                }}
                className={cn(
                  "px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-all flex-1 sm:flex-none",
                  activeTimeFilter === filter
                    ? "bg-card shadow-sm scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-card/50"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {/* Score Card - Score centered as highlight */}
        <Card className={cn(
          "relative overflow-hidden transition-all hover:shadow-lg",
          performanceStatus === "success" && "ring-2 ring-success/30",
          performanceStatus === "warning" && "ring-2 ring-warning/30",
          performanceStatus === "danger" && "ring-2 ring-destructive/30"
        )}>
          <CardContent className="p-4 md:p-5">
            <p className="text-xs md:text-sm text-muted-foreground mb-3">Overall performance</p>
            {/* Centered Score - The main highlight */}
            <div className="flex items-center justify-center py-2">
              <div className={cn(
                "w-16 h-16 md:w-20 md:h-20 rounded-full border-4 flex items-center justify-center transition-colors",
                performanceStatus === "success" && "border-success",
                performanceStatus === "warning" && "border-warning",
                performanceStatus === "danger" && "border-destructive"
              )}>
                <span className="text-2xl md:text-3xl font-bold">{currentStats.performance}</span>
              </div>
            </div>
            {scoreCardSettings.showComparison && (
              <p className="text-[10px] md:text-xs text-muted-foreground text-center mt-2">
                {parseFloat(currentStats.performance) < scoreCardSettings.targetScore 
                  ? `${(scoreCardSettings.targetScore - parseFloat(currentStats.performance)).toFixed(1)} points below target`
                  : `${(parseFloat(currentStats.performance) - scoreCardSettings.targetScore).toFixed(1)} points above target`}
              </p>
            )}
          </CardContent>
        </Card>
        
        <OverviewCard
          title="Calls completed"
          value={currentStats.calls.toString()}
          change={32}
          positive
          subtitle={`out of ${currentStats.callsTotal} total`}
          onClick={() => navigate("/calls")}
        />
        <OverviewCard
          title="Average Call score"
          value={`${currentStats.avgScore}%`}
          change={Math.abs(currentStats.avgScoreChange)}
          positive={currentStats.avgScoreChange > 0}
          onClick={() => toast.info("Click on any call to see detailed scoring breakdown")}
        />
        <OverviewCard
          title="Conversion rate"
          value={`${currentStats.conversionRate}%`}
          onClick={() => toast.info("Conversion rate measures successful deal closures")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Charts */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Bar Chart - Using Recharts */}
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm md:text-base">Weekly Call volume vs. Goal</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Shows passed vs failed calls compared to your weekly goal</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-3 md:gap-4 text-xs">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-3 h-0.5 border-t-2 border-dashed border-muted-foreground" />
                    <span className="text-muted-foreground">Goal</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded bg-destructive" />
                    <span className="text-muted-foreground">Failed</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded bg-accent" />
                    <span className="text-muted-foreground">Passed</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData} margin={{ top: 20, right: 10, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis 
                      dataKey="week" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false} 
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }} 
                      tickLine={false} 
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <RechartsTooltip content={<CustomBarTooltip />} />
                    <ReferenceLine 
                      y={weeklyData[0]?.goal || 30} 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                    />
                    <Bar 
                      dataKey="passed" 
                      stackId="a" 
                      fill="hsl(var(--accent))" 
                      radius={[0, 0, 0, 0]}
                      className="cursor-pointer"
                      onClick={() => navigate("/calls")}
                    />
                    <Bar 
                      dataKey="failed" 
                      stackId="a" 
                      fill="hsl(var(--destructive))" 
                      radius={[4, 4, 0, 0]}
                      className="cursor-pointer"
                      onClick={() => navigate("/calls")}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Line Chart - Using Recharts */}
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <CardTitle className="text-sm md:text-base">Weekly Call score vs. Goal</CardTitle>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3.5 h-3.5 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-xs">Your average call score trend over time</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <div className="flex items-center gap-3 md:gap-4 text-xs">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-3 h-0.5 border-t-2 border-dashed border-muted-foreground" />
                    <span className="text-muted-foreground">Goal (70%)</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded bg-accent" />
                    <span className="text-muted-foreground">Your Score</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={scoreData} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
                    <defs>
                      <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 11 }} 
                      tickLine={false} 
                      axisLine={false}
                      className="text-muted-foreground"
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }} 
                      tickLine={false} 
                      axisLine={false}
                      domain={[0, 100]}
                      tickFormatter={(value) => `${value}%`}
                      className="text-muted-foreground"
                    />
                    <RechartsTooltip content={<CustomLineTooltip />} />
                    <ReferenceLine 
                      y={70} 
                      stroke="hsl(var(--muted-foreground))" 
                      strokeDasharray="5 5" 
                      strokeWidth={2}
                      label={{ value: "Goal", position: "right", fontSize: 10 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="score" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      fill="url(#colorScore)"
                      dot={{ fill: "hsl(var(--accent))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, strokeWidth: 0 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4 md:space-y-6">
          {/* Learning Modules */}
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm md:text-base">Learning modules</CardTitle>
                <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => navigate("/training")}>
                  View all
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-muted p-2 -m-2 rounded-lg transition-colors group" 
                onClick={() => navigate("/training")}
              >
                <div>
                  <p className="text-2xl md:text-3xl font-bold">3</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Learning modules assigned</p>
                </div>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-muted p-2 -m-2 rounded-lg transition-colors group" 
                onClick={() => navigate("/training")}
              >
                <div>
                  <p className="text-2xl md:text-3xl font-bold">3</p>
                  <p className="text-xs md:text-sm text-muted-foreground">Certificate trainings assigned</p>
                </div>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-muted p-2 -m-2 rounded-lg transition-colors group" 
                onClick={() => {
                  toast.warning("2 trainings are due this week!", {
                    action: {
                      label: "View",
                      onClick: () => navigate("/training")
                    }
                  });
                }}
              >
                <div>
                  <p className="text-2xl md:text-3xl font-bold text-warning">2</p>
                  <p className="text-xs md:text-sm text-muted-foreground">are due soon</p>
                </div>
                <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>

          {/* Objection Handling */}
          <Card>
            <CardHeader className="pb-2 md:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm md:text-base">Objection Frequency & Handling</CardTitle>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="w-3.5 h-3.5 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">Click to expand and see detailed handling stats</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              {objectionHandling.map((item, index) => (
                <div key={index}>
                  <div 
                    className="flex items-start gap-2 md:gap-3 cursor-pointer hover:bg-muted p-2 -m-2 rounded-lg transition-colors" 
                    onClick={() => setExpandedObjection(expandedObjection === index ? null : index)}
                  >
                    <div className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-xs font-medium flex-shrink-0 transition-colors",
                      item.percentage >= 60 ? "bg-success/20 text-success" : item.percentage >= 40 ? "bg-warning/20 text-warning" : "bg-destructive/20 text-destructive"
                    )}>
                      {item.percentage}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs md:text-sm">{item.objection}</p>
                      <p className="text-[10px] md:text-xs text-muted-foreground">
                        {item.success} of {item.total}
                      </p>
                    </div>
                    <ChevronRight className={cn(
                      "w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200",
                      expandedObjection === index && "rotate-90"
                    )} />
                  </div>
                  {expandedObjection === index && (
                    <div className="mt-2 ml-10 md:ml-12 p-3 bg-muted/50 rounded-lg animate-fade-in">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Success rate</span>
                          <span className="font-medium">{item.percentage}%</span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={cn(
                              "h-full rounded-full transition-all duration-500",
                              item.percentage >= 60 ? "bg-success" : item.percentage >= 40 ? "bg-warning" : "bg-destructive"
                            )}
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Successful handling</span>
                          <span className="text-success font-medium">{item.success} calls</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Failed handling</span>
                          <span className="text-destructive font-medium">{item.total - item.success} calls</span>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="w-full mt-2 text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/roleplays");
                            toast.success("Starting practice session for this objection");
                          }}
                        >
                          Practice this objection
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const OverviewCard = forwardRef<HTMLDivElement, { 
  title: string; 
  value: string; 
  change?: number;
  positive?: boolean;
  subtitle?: string;
  onClick?: () => void;
}>(({ title, value, change, positive, subtitle, onClick }, ref) => (
  <Card 
    ref={ref}
    className={cn(
      "transition-all",
      onClick && "cursor-pointer hover:shadow-lg hover:scale-[1.02]"
    )}
    onClick={onClick}
  >
    <CardContent className="p-3 md:p-4">
      <div className="flex items-start justify-between mb-1 md:mb-2">
        <p className="text-xs md:text-sm text-muted-foreground">{title}</p>
      </div>
      <div className="flex items-end gap-2">
        <p className="text-2xl md:text-3xl font-bold">{value}</p>
        {change !== undefined && (
          <span className={cn(
            "text-xs md:text-sm font-medium flex items-center gap-0.5 mb-1",
            positive ? "text-success" : "text-destructive"
          )}>
            {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(change)}%
          </span>
        )}
      </div>
      {subtitle && (
        <p className="text-[10px] md:text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </CardContent>
  </Card>
));

OverviewCard.displayName = "OverviewCard";

export default AnalyticsPage;
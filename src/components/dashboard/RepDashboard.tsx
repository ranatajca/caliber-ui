import { useNavigate } from "react-router-dom";
import { 
  TrendingUp, 
  TrendingDown,
  Target, 
  ChevronRight, 
  Play,
  AlertTriangle,
  DollarSign,
  Trophy,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts";

const RepDashboard = () => {
  const navigate = useNavigate();

  // Mock data - Top 3 weaknesses detected from last 14 days / 15 calls
  const weaknesses = [
    {
      id: 1,
      name: "Objection Handling",
      score: 62,
      trend: -8,
      callsAnalyzed: 15,
      lostDeals: 3,
      estimatedLostCommission: 4200,
      topObjection: "Price too high",
      practiceType: "objection-handling",
      roleplayId: "obj-1",
      insight: "You're losing deals when prospects push back on pricing. Practice reframing value."
    },
    {
      id: 2,
      name: "Discovery Questions",
      score: 68,
      trend: -5,
      callsAnalyzed: 15,
      lostDeals: 2,
      estimatedLostCommission: 2800,
      topObjection: "Shallow pain points",
      practiceType: "discovery",
      roleplayId: "disc-1",
      insight: "Your discovery calls average 3 questions vs top reps' 7. Go deeper on pain."
    },
    {
      id: 3,
      name: "Closing Techniques",
      score: 71,
      trend: -3,
      callsAnalyzed: 15,
      lostDeals: 2,
      estimatedLostCommission: 1900,
      topObjection: "Weak trial closes",
      practiceType: "closing",
      roleplayId: "close-1",
      insight: "You're not using trial closes early. Top reps ask for micro-commitments 4x per call."
    }
  ];

  // Sales score trend data
  const scoreTrendData = [
    { day: "Mon", score: 74, topRep: 89 },
    { day: "Tue", score: 71, topRep: 91 },
    { day: "Wed", score: 78, topRep: 88 },
    { day: "Thu", score: 73, topRep: 90 },
    { day: "Fri", score: 76, topRep: 92 },
    { day: "Sat", score: 72, topRep: 87 },
    { day: "Today", score: 75, topRep: 91 },
  ];

  // Current score stats
  const currentScore = 75;
  const weekChange = -2;
  const monthChange = +4;

  // Competitive leaderboard
  const leaderboard = [
    { rank: 1, name: "Marcus Johnson", score: 91, trend: +3, isTopRep: true },
    { rank: 2, name: "Emily Chen", score: 88, trend: +1 },
    { rank: 3, name: "David Park", score: 85, trend: +2 },
    { rank: 4, name: "You", score: 75, trend: -2, isCurrentUser: true },
    { rank: 5, name: "Alex Rivera", score: 73, trend: -1 },
  ];

  // Gap to top rep
  const topRepScore = 91;
  const gapToTop = topRepScore - currentScore;

  const chartConfig = {
    score: { label: "Your Score", color: "hsl(var(--primary))" },
    topRep: { label: "Top Rep", color: "hsl(var(--accent))" },
  };

  const getTrendIcon = (trend: number) => {
    if (trend > 0) return <ArrowUp className="w-3 h-3" />;
    if (trend < 0) return <ArrowDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  const getTrendColor = (trend: number) => {
    if (trend > 0) return "text-success";
    if (trend < 0) return "text-destructive";
    return "text-muted-foreground";
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header - Action-oriented */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Your Improvement Hub</h1>
          <p className="text-muted-foreground mt-1">
            Based on your last 15 calls • ~${(weaknesses.reduce((acc, w) => acc + w.estimatedLostCommission, 0)).toLocaleString()} potential commission at stake
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${getTrendColor(weekChange)}`}>
            {weekChange > 0 ? "+" : ""}{weekChange} pts this week
          </span>
        </div>
      </div>

      {/* Top 3 Weaknesses - Main Focus */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-warning" />
          <h2 className="text-lg font-display font-semibold">Focus Areas</h2>
          <span className="text-sm text-muted-foreground">• Detected from last 14 days</span>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {weaknesses.map((weakness, index) => (
            <Card 
              key={weakness.id} 
              className="relative overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 group cursor-pointer border-l-4"
              style={{ 
                borderLeftColor: index === 0 ? 'hsl(var(--destructive))' : index === 1 ? 'hsl(var(--warning))' : 'hsl(var(--warning) / 0.7)' 
              }}
              onClick={() => navigate(`/roleplays/${weakness.roleplayId}/start`)}
            >
              <CardContent className="p-5">
                {/* Priority Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                    index === 0 ? 'bg-destructive/10 text-destructive' : 'bg-warning/10 text-warning-foreground'
                  }`}>
                    #{index + 1} Priority
                  </span>
                  <div className={`flex items-center gap-1 text-xs font-medium ${getTrendColor(weakness.trend)}`}>
                    {getTrendIcon(weakness.trend)}
                    {Math.abs(weakness.trend)} pts
                  </div>
                </div>

                {/* Weakness Name & Score */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base">{weakness.name}</h3>
                  <span className={`text-2xl font-bold ${getScoreColor(weakness.score)}`}>
                    {weakness.score}
                  </span>
                </div>

                {/* Progress Bar */}
                <Progress value={weakness.score} className="h-2 mb-3" />

                {/* Lost Commission Alert */}
                <div className="flex items-center gap-2 p-2.5 bg-destructive/5 rounded-lg mb-3 border border-destructive/10">
                  <DollarSign className="w-4 h-4 text-destructive" />
                  <span className="text-xs">
                    <span className="font-semibold text-destructive">~${weakness.estimatedLostCommission.toLocaleString()}</span>
                    <span className="text-muted-foreground"> lost from "{weakness.topObjection}"</span>
                  </span>
                </div>

                {/* Insight */}
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                  {weakness.insight}
                </p>

                {/* CTA */}
                <Button 
                  className="w-full gap-2 group-hover:bg-primary/90" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/roleplays/${weakness.roleplayId}/start`);
                  }}
                >
                  <Play className="w-4 h-4" />
                  Practice Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Score Trend & Competitive Context */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Sales Score Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Sales Score Trend
              </CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary" />
                  <span className="text-muted-foreground">You</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-accent" />
                  <span className="text-muted-foreground">Top Rep</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Score Summary */}
            <div className="flex items-center gap-6 mb-4 pb-4 border-b border-border">
              <div>
                <p className="text-3xl font-bold">{currentScore}</p>
                <p className="text-sm text-muted-foreground">Current Score</p>
              </div>
              <div className="flex items-center gap-4">
                <div className={`flex items-center gap-1 ${getTrendColor(weekChange)}`}>
                  {weekChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{weekChange > 0 ? "+" : ""}{weekChange} 7d</span>
                </div>
                <div className={`flex items-center gap-1 ${getTrendColor(monthChange)}`}>
                  {monthChange > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  <span className="text-sm font-medium">{monthChange > 0 ? "+" : ""}{monthChange} 30d</span>
                </div>
              </div>
              <div className="ml-auto text-right">
                <p className="text-sm font-medium text-destructive">-{gapToTop} pts behind top rep</p>
                <p className="text-xs text-muted-foreground">Close the gap with focused practice</p>
              </div>
            </div>

            {/* Chart */}
            <ChartContainer config={chartConfig} className="h-[180px] w-full">
              <AreaChart data={scoreTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="fillScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#fillScore)"
                />
                <Line
                  type="monotone"
                  dataKey="topRep"
                  stroke="hsl(var(--accent))"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Mini Leaderboard */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Trophy className="w-5 h-5 text-gold" />
                Team Ranking
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => navigate("/leaderboard")} className="text-xs">
                Full Board <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {leaderboard.map((member) => (
              <div 
                key={member.rank}
                className={`flex items-center gap-3 p-2.5 rounded-lg transition-colors ${
                  member.isCurrentUser 
                    ? 'bg-primary/10 border border-primary/20' 
                    : 'hover:bg-muted'
                }`}
              >
                {/* Rank */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  member.rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-500 text-white' :
                  member.rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-white' :
                  member.rank === 3 ? 'bg-gradient-to-br from-orange-400 to-orange-500 text-white' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {member.rank}
                </div>

                {/* Name */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium truncate ${member.isCurrentUser ? 'text-primary' : ''}`}>
                    {member.name}
                    {member.isTopRep && <Zap className="w-3 h-3 inline ml-1 text-accent" />}
                  </p>
                </div>

                {/* Score & Trend */}
                <div className="text-right">
                  <p className="text-sm font-bold">{member.score}</p>
                  <p className={`text-xs flex items-center justify-end gap-0.5 ${getTrendColor(member.trend)}`}>
                    {getTrendIcon(member.trend)}
                    {Math.abs(member.trend)}
                  </p>
                </div>
              </div>
            ))}

            {/* Gap Indicator */}
            <div className="pt-3 mt-3 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Gap to #1:</span>
                <span className="font-bold text-destructive">-{gapToTop} pts</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                3 focused practice sessions could close this gap
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Win Section */}
      <Card className="bg-gradient-to-r from-primary/5 via-transparent to-accent/5 border-primary/20">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Zap className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Quick Win: 15-min Objection Drill</h3>
                <p className="text-sm text-muted-foreground">
                  Practice the "Price too high" objection that cost you 3 deals this week
                </p>
              </div>
            </div>
            <Button onClick={() => navigate("/roleplays/obj-1/start")} className="gap-2 shrink-0">
              <Play className="w-4 h-4" />
              Start Drill
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RepDashboard;

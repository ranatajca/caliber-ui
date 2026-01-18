import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Phone, 
  ChevronRight, 
  Award,
  BarChart3,
  FileText,
  ArrowDownRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ManagerDashboard = () => {
  const navigate = useNavigate();
  const [timeWindow, setTimeWindow] = useState<"7d" | "14d" | "30d">("7d");

  // Team members with detailed stats
  const teamMembers = [
    { id: "1", name: "Sarah Mitchell", role: "Senior AE", score: 92, avgScore: 89, calls: 42, trend: "up", avatar: "SM", status: "online", impactOnAvg: 8 },
    { id: "2", name: "James Wilson", role: "AE", score: 85, avgScore: 83, calls: 38, trend: "up", avatar: "JW", status: "online", impactOnAvg: 5 },
    { id: "3", name: "Emily Chen", role: "SDR", score: 78, avgScore: 76, calls: 56, trend: "stable", avatar: "EC", status: "away", impactOnAvg: 0 },
    { id: "4", name: "Mike Johnson", role: "AE", score: 71, avgScore: 74, calls: 28, trend: "down", avatar: "MJ", status: "online", impactOnAvg: -4 },
    { id: "5", name: "Lisa Park", role: "SDR", score: 68, avgScore: 70, calls: 31, trend: "down", avatar: "LP", status: "offline", impactOnAvg: -6 },
    { id: "6", name: "Tom Richards", role: "AE", score: 64, avgScore: 67, calls: 22, trend: "down", avatar: "TR", status: "online", impactOnAvg: -9 },
    { id: "7", name: "Amy Foster", role: "SDR", score: 82, avgScore: 80, calls: 45, trend: "up", avatar: "AF", status: "online", impactOnAvg: 3 },
    { id: "8", name: "David Kim", role: "AE", score: 75, avgScore: 77, calls: 35, trend: "stable", avatar: "DK", status: "away", impactOnAvg: -1 },
  ];

  // Calculate team averages
  const teamAvgScore = Math.round(teamMembers.reduce((sum, m) => sum + m.score, 0) / teamMembers.length);
  const totalCalls = teamMembers.reduce((sum, m) => sum + m.calls, 0);
  const avgCallsPerRep = Math.round(totalCalls / teamMembers.length);

  // Time-based data (mock - would come from API based on timeWindow)
  const timeWindowData = {
    "7d": { avgScore: teamAvgScore, change: 2, calls: totalCalls, prevAvg: teamAvgScore - 2 },
    "14d": { avgScore: teamAvgScore - 1, change: 4, calls: totalCalls + 120, prevAvg: teamAvgScore - 5 },
    "30d": { avgScore: teamAvgScore - 2, change: 6, calls: totalCalls + 380, prevAvg: teamAvgScore - 8 },
  };

  const currentData = timeWindowData[timeWindow];

  // Reps dragging average down (negative impact)
  const draggingDown = teamMembers
    .filter(m => m.impactOnAvg < 0)
    .sort((a, b) => a.impactOnAvg - b.impactOnAvg);

  const needsAttention = teamMembers.filter(m => m.score < 72 || m.trend === "down");
  const topPerformers = teamMembers.filter(m => m.score >= 82).sort((a, b) => b.score - a.score);

  const recentTeamCalls = [
    { id: "1", rep: "Sarah Mitchell", buyer: "Jane Bowen", score: 92, duration: "4:32", time: "1h ago", reviewed: false },
    { id: "2", rep: "James Wilson", buyer: "Marcus Chen", score: 85, duration: "3:15", time: "2h ago", reviewed: true },
    { id: "3", rep: "Mike Johnson", buyer: "Alex Rivera", score: 62, duration: "2:45", time: "3h ago", reviewed: false },
    { id: "4", rep: "Tom Richards", buyer: "Kate Wilson", score: 58, duration: "3:20", time: "4h ago", reviewed: false },
  ];

  const pendingReviews = recentTeamCalls.filter(c => !c.reviewed);

  const timeWindowLabels = {
    "7d": "Last 7 days",
    "14d": "Last 14 days", 
    "30d": "Last 30 days"
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Team Health 📊</h1>
          <p className="text-muted-foreground mt-1">
            {teamMembers.length} reps • {needsAttention.length} need attention
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate("/metrics")} className="gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </Button>
          <Button onClick={() => navigate("/team")} className="gap-2">
            <Users className="w-4 h-4" />
            Manage Team
          </Button>
        </div>
      </div>

      {/* Time Window Selector + Key Stats */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          {(["7d", "14d", "30d"] as const).map((window) => (
            <Button
              key={window}
              variant={timeWindow === window ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeWindow(window)}
              className="text-xs"
            >
              {window === "7d" ? "7 Days" : window === "14d" ? "14 Days" : "30 Days"}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Average Team Score */}
          <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                  <Target className="w-5 h-5" />
                </div>
                <span className={`text-sm font-medium flex items-center gap-1 ${currentData.change >= 0 ? "text-success" : "text-destructive"}`}>
                  {currentData.change >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                  {currentData.change >= 0 ? "+" : ""}{currentData.change} pts
                </span>
              </div>
              <p className="text-3xl font-bold">{currentData.avgScore}</p>
              <p className="text-sm text-muted-foreground">Avg Team Score • {timeWindowLabels[timeWindow]}</p>
            </CardContent>
          </Card>

          {/* Total Calls */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-blue-500">
                  <Phone className="w-5 h-5" />
                </div>
                <span className="text-sm text-muted-foreground">
                  ~{avgCallsPerRep}/rep
                </span>
              </div>
              <p className="text-3xl font-bold">{currentData.calls}</p>
              <p className="text-sm text-muted-foreground">Total Calls • {timeWindowLabels[timeWindow]}</p>
            </CardContent>
          </Card>

          {/* Team Size */}
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-primary">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-sm text-muted-foreground">
                  {pendingReviews.length} reviews pending
                </span>
              </div>
              <p className="text-3xl font-bold">{teamMembers.length}</p>
              <p className="text-sm text-muted-foreground">Team Members</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dragging Average Down */}
      {draggingDown.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2 text-destructive">
              <ArrowDownRight className="w-5 h-5" />
              Dragging Team Average Down
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              These reps are pulling the team score below where it could be
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {draggingDown.slice(0, 4).map((member) => (
                <div 
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-background border border-destructive/20 cursor-pointer hover:border-destructive/40 transition-colors"
                  onClick={() => navigate(`/team?member=${member.id}`)}
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-destructive/20 to-orange-500/20 flex items-center justify-center font-semibold text-destructive text-sm">
                    {member.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role} • {member.calls} calls</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-destructive">{member.score}</p>
                    <p className="text-xs text-destructive/70">{member.impactOnAvg} pts impact</p>
                  </div>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Coach
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Top Performers */}
      <Card className="border-success/30">
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg flex items-center gap-2 text-success">
            <Award className="w-5 h-5" />
            Top Performers ({topPerformers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {topPerformers.slice(0, 4).map((member, index) => (
              <div 
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-success/5 border border-success/20 cursor-pointer hover:bg-success/10 transition-colors"
                onClick={() => navigate(`/team?member=${member.id}`)}
              >
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-success/30 to-accent/30 flex items-center justify-center font-semibold text-success text-sm">
                    {member.avatar}
                  </div>
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center">
                      <span className="text-[10px]">👑</span>
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role} • {member.calls} calls</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">{member.score}</p>
                  <p className="text-xs text-success/70">+{member.impactOnAvg} pts</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team Performance & Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Team Performance Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">All Reps Performance</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/leaderboard")} className="gap-1 text-xs md:text-sm">
              Leaderboard <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Rep Performance Chart */}
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={teamMembers.sort((a, b) => b.score - a.score)} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="avatar" 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                  />
                  <YAxis 
                    domain={[50, 100]} 
                    tick={{ fontSize: 11 }} 
                    className="text-muted-foreground"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [value, name === 'score' ? 'Current Score' : 'Calls']}
                    labelFormatter={(label) => {
                      const member = teamMembers.find(m => m.avatar === label);
                      return member?.name || label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="score" name="Score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="avgScore" name="Avg Score" stroke="hsl(var(--muted-foreground))" strokeDasharray="5 5" strokeWidth={2} dot={false} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Rep List */}
            <div className="space-y-4">
              {teamMembers.sort((a, b) => b.score - a.score).map((member) => (
                <div key={member.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary text-xs">
                          {member.avatar}
                        </div>
                        <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${
                          member.status === "online" ? "bg-success" : member.status === "away" ? "bg-warning" : "bg-muted"
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.calls} calls • {member.role}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${member.score >= 80 ? "text-success" : member.score >= 70 ? "text-warning" : "text-destructive"}`}>
                        {member.score}
                      </span>
                      {member.trend === "up" && <TrendingUp className="w-3.5 h-3.5 text-success" />}
                      {member.trend === "down" && <TrendingDown className="w-3.5 h-3.5 text-destructive" />}
                    </div>
                  </div>
                  <Progress value={member.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Pending Reviews
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingReviews.map((call) => (
              <div 
                key={call.id}
                onClick={() => navigate(`/calls/${call.id}`)}
                className="p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 cursor-pointer transition-all"
              >
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-sm">{call.rep}</p>
                  <span className={`font-bold text-sm ${call.score >= 80 ? "text-success" : call.score >= 70 ? "text-warning" : "text-destructive"}`}>
                    {call.score}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-2">Call with {call.buyer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{call.time}</span>
                  <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                    Review
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-sm" onClick={() => navigate("/calls")}>
              View All Calls
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;

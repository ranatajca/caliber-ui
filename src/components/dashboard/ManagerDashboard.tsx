import { useNavigate } from "react-router-dom";
import { 
  Users, 
  TrendingUp, 
  TrendingDown,
  Target, 
  Phone, 
  ChevronRight, 
  AlertTriangle,
  Award,
  BarChart3,
  Calendar,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const ManagerDashboard = () => {
  const navigate = useNavigate();

  const teamStats = [
    { label: "Team Members", value: "8", change: "", icon: Users, color: "text-primary" },
    { label: "Avg Team Score", value: "76", change: "+3", trend: "up", icon: Target, color: "text-accent" },
    { label: "Total Calls Today", value: "24", change: "+8", trend: "up", icon: Phone, color: "text-blue-500" },
    { label: "Coaching Sessions", value: "5", change: "", icon: Calendar, color: "text-purple-500" },
  ];

  const teamMembers = [
    { id: "1", name: "Sarah Mitchell", role: "Senior AE", score: 92, calls: 6, trend: "up", avatar: "SM", status: "online" },
    { id: "2", name: "James Wilson", role: "AE", score: 85, calls: 5, trend: "up", avatar: "JW", status: "online" },
    { id: "3", name: "Emily Chen", role: "SDR", score: 78, calls: 8, trend: "stable", avatar: "EC", status: "away" },
    { id: "4", name: "Mike Johnson", role: "AE", score: 71, calls: 3, trend: "down", avatar: "MJ", status: "online" },
    { id: "5", name: "Lisa Park", role: "SDR", score: 68, calls: 4, trend: "down", avatar: "LP", status: "offline" },
  ];

  const needsAttention = teamMembers.filter(m => m.score < 75 || m.trend === "down");
  const topPerformers = teamMembers.filter(m => m.score >= 85);

  const recentTeamCalls = [
    { id: "1", rep: "Sarah Mitchell", buyer: "Jane Bowen", score: 92, duration: "4:32", time: "1h ago", reviewed: false },
    { id: "2", rep: "James Wilson", buyer: "Marcus Chen", score: 85, duration: "3:15", time: "2h ago", reviewed: true },
    { id: "3", rep: "Mike Johnson", buyer: "Alex Rivera", score: 62, duration: "2:45", time: "3h ago", reviewed: false },
    { id: "4", rep: "Emily Chen", buyer: "Tom Hardy", score: 78, duration: "5:10", time: "4h ago", reviewed: false },
  ];

  const pendingReviews = recentTeamCalls.filter(c => !c.reviewed);

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Team Overview 📊</h1>
          <p className="text-muted-foreground mt-1">
            Managing 8 reps • {pendingReviews.length} calls need review
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

      {/* Team Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {teamStats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                {stat.change && (
                  <span className={`text-xs font-medium flex items-center gap-1 ${stat.trend === "up" ? "text-success" : stat.trend === "down" ? "text-destructive" : "text-muted-foreground"}`}>
                    {stat.trend === "up" ? <TrendingUp className="w-3 h-3" /> : stat.trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-xl md:text-2xl font-bold">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Attention Needed & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Needs Attention */}
        <Card className="border-warning/30">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Needs Attention ({needsAttention.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {needsAttention.map((member) => (
              <div 
                key={member.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-warning/5 border border-warning/20 cursor-pointer hover:bg-warning/10 transition-colors"
                onClick={() => navigate(`/team?member=${member.id}`)}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-warning/30 to-orange-500/30 flex items-center justify-center font-semibold text-warning text-sm">
                  {member.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{member.name}</p>
                  <p className="text-xs text-muted-foreground">{member.role} • Score: {member.score}</p>
                </div>
                <div className="flex items-center gap-2">
                  {member.trend === "down" && <TrendingDown className="w-4 h-4 text-destructive" />}
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    Review
                  </Button>
                </div>
              </div>
            ))}
            {needsAttention.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">All reps performing well! 🎉</p>
            )}
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-success/30">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg flex items-center gap-2 text-success">
              <Award className="w-5 h-5" />
              Top Performers ({topPerformers.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topPerformers.map((member, index) => (
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
                  <p className="text-xs text-muted-foreground">{member.role} • {member.calls} calls today</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-success">{member.score}</p>
                  <p className="text-xs text-muted-foreground">score</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Team Performance & Pending Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Team Performance Breakdown */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex-row items-center justify-between pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Team Performance</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/leaderboard")} className="gap-1 text-xs md:text-sm">
              Leaderboard <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamMembers.map((member) => (
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

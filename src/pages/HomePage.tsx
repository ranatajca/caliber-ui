import { useNavigate } from "react-router-dom";
import { 
  Phone, 
  TrendingUp, 
  Target, 
  Clock, 
  ChevronRight, 
  Play,
  Star,
  Flame,
  Zap,
  Shield,
  Upload,
  Video
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TeamRaceChart from "@/components/TeamRaceChart";

const HomePage = () => {
  const navigate = useNavigate();

  const todayStats = [
    { label: "Calls Today", value: "4", change: "+2", icon: Phone, color: "text-primary" },
    { label: "Avg Score", value: "78", change: "+5", icon: Target, color: "text-accent" },
    { label: "Talk Time", value: "32m", change: "", icon: Clock, color: "text-orange-500" },
    { label: "Streak", value: "5 days", change: "🔥", icon: Flame, color: "text-amber-500" },
  ];

  const quickActions = [
    { 
      title: "Cold Call Practice", 
      description: "Practice with a skeptical VP of Sales", 
      icon: Phone,
      color: "bg-blue-500",
      onClick: () => navigate("/roleplays/1/start")
    },
    { 
      title: "Warm Call Roleplay", 
      description: "Handle a follow-up with existing lead", 
      icon: Zap,
      color: "bg-orange-500",
      onClick: () => navigate("/roleplays/2/start")
    },
    { 
      title: "Discovery Drill", 
      description: "Master the SPICED framework", 
      icon: Target,
      color: "bg-purple-500",
      onClick: () => navigate("/roleplays/3/start")
    },
    { 
      title: "Upload Calls", 
      description: "Analyze your real recordings", 
      icon: Upload,
      color: "bg-green-500",
      onClick: () => navigate("/settings")
    },
  ];

  const recentCalls = [
    { id: "1", buyer: "Jane Bowen", role: "Director of Sales", score: 82, duration: "4:32", time: "2h ago" },
    { id: "2", buyer: "Marcus Chen", role: "VP of Engineering", score: 71, duration: "3:15", time: "Yesterday" },
    { id: "3", buyer: "Sarah Kim", role: "Founder & CEO", score: 88, duration: "5:45", time: "2 days ago" },
  ];

  const recommendedRoleplays = [
    { id: "1", buyer: "Logan Sullivan", role: "VP @ Salesforce", type: "Cold Call", trait: "Nice" },
    { id: "2", buyer: "Mason Brooks", role: "Director @ Oracle", type: "Cold Call", trait: "Rude" },
    { id: "3", buyer: "Ava Ramirez", role: "Innovation Lead @ Airbnb", type: "Discovery", trait: "Nice" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 md:space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">Good afternoon, Saad 👋</h1>
          <p className="text-muted-foreground mt-1">
            You're on a 5-day streak! Keep it going.
          </p>
        </div>
        <Button onClick={() => navigate("/roleplays")} className="gap-2 w-full sm:w-auto">
          <Play className="w-4 h-4" />
          Start Practice
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {todayStats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => toast.info(`Viewing ${stat.label} details`)}>
            <CardContent className="p-4 md:p-5">
              <div className="flex items-center justify-between mb-2 md:mb-3">
                <div className={`w-8 h-8 md:w-10 md:h-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
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

      {/* Quick Actions */}
      <div>
        <h2 className="text-base md:text-lg font-display font-semibold mb-3 md:mb-4">Daily Warmups & Skill Drills</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {quickActions.map((action) => (
            <Card 
              key={action.title}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
              onClick={action.onClick}
            >
              <CardContent className="p-4 md:p-5">
                <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${action.color} flex items-center justify-center mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1 text-sm md:text-base">{action.title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Race & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Team Race Chart */}
        <Card>
          <CardContent className="p-5">
            <TeamRaceChart />
          </CardContent>
        </Card>

        {/* Recent Calls */}
        <Card>
          <CardHeader className="flex-row items-center justify-between pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg">Recent Calls</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/calls")} className="gap-1 text-xs md:text-sm">
              View all <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-2 md:space-y-3">
            {recentCalls.map((call) => (
              <div 
                key={call.id}
                onClick={() => navigate(`/calls/${call.id}`)}
                className="flex items-center gap-3 md:gap-4 p-2 md:p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary text-sm md:text-base">
                  {call.buyer.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">{call.buyer}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{call.role}</p>
                </div>
                <div className="text-right hidden sm:block">
                  <p className={`font-bold text-sm md:text-base ${call.score >= 80 ? "text-success" : call.score >= 70 ? "text-warning" : "text-destructive"}`}>
                    {call.score}
                  </p>
                  <p className="text-xs text-muted-foreground">{call.duration}</p>
                </div>
                <p className="text-xs text-muted-foreground w-16 md:w-20 text-right hidden md:block">{call.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Recommended Roleplays */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 md:pb-4">
            <CardTitle className="text-base md:text-lg flex items-center gap-2">
              <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-500" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {recommendedRoleplays.map((roleplay) => (
                <div 
                  key={roleplay.id}
                  onClick={() => navigate(`/roleplays/${roleplay.id}/start`)}
                  className="p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium text-sm">{roleplay.buyer}</p>
                    <span className={`badge-trait text-xs ${roleplay.trait === "Nice" ? "badge-nice" : "badge-rude"}`}>
                      {roleplay.trait}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{roleplay.role}</p>
                  <div className="flex items-center justify-between">
                    <span className={`badge-trait text-xs ${roleplay.type === "Cold Call" ? "badge-cold" : "badge-warm"}`}>
                      {roleplay.type}
                    </span>
                    <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity h-7 text-xs">
                      Start <Play className="w-3 h-3 ml-1" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Call Integration Promo */}
        <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
          <CardContent className="p-5">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">Connect Your Calls</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Link Fathom or upload recordings to get real-time analysis of your actual sales calls.
            </p>
            <Button size="sm" onClick={() => navigate("/settings")} className="w-full">
              Set Up Integrations
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
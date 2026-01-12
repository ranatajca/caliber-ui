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
  BookOpen
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
      title: "Warm Call Training", 
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
      title: "Objection Handling", 
      description: "Practice budget & timing objections", 
      icon: BookOpen,
      color: "bg-green-500",
      onClick: () => navigate("/training")
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
    <div className="p-6 space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Good afternoon, Saad 👋</h1>
          <p className="text-muted-foreground mt-1">
            You're on a 5-day streak! Keep it going.
          </p>
        </div>
        <Button onClick={() => navigate("/roleplays")} className="gap-2">
          <Play className="w-4 h-4" />
          Start Practice
        </Button>
      </div>

      {/* Today's Stats */}
      <div className="grid grid-cols-4 gap-4">
        {todayStats.map((stat) => (
          <Card key={stat.label} className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium text-success flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-display font-semibold mb-4">Daily Warmups & Skill Drills</h2>
        <div className="grid grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Card 
              key={action.title}
              className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 group"
              onClick={action.onClick}
            >
              <CardContent className="p-5">
                <div className={`w-12 h-12 rounded-xl ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <action.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold mb-1">{action.title}</h3>
                <p className="text-sm text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Recent Calls */}
        <Card className="col-span-2">
          <CardHeader className="flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Calls</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate("/calls")} className="gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentCalls.map((call) => (
              <div 
                key={call.id}
                onClick={() => navigate(`/calls/${call.id}`)}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary">
                  {call.buyer.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{call.buyer}</p>
                  <p className="text-sm text-muted-foreground">{call.role}</p>
                </div>
                <div className="text-right">
                  <p className={`font-bold ${call.score >= 80 ? "text-success" : call.score >= 70 ? "text-warning" : "text-destructive"}`}>
                    {call.score}
                  </p>
                  <p className="text-xs text-muted-foreground">{call.duration}</p>
                </div>
                <p className="text-xs text-muted-foreground w-20 text-right">{call.time}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recommended Roleplays */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              Recommended for You
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recommendedRoleplays.map((roleplay) => (
              <div 
                key={roleplay.id}
                onClick={() => navigate(`/roleplays/${roleplay.id}/start`)}
                className="p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-muted/50 cursor-pointer transition-all group"
              >
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">{roleplay.buyer}</p>
                  <span className={`badge-trait ${roleplay.trait === "Nice" ? "badge-nice" : "badge-rude"}`}>
                    {roleplay.trait}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{roleplay.role}</p>
                <div className="flex items-center justify-between">
                  <span className={`badge-trait ${roleplay.type === "Cold Call" ? "badge-cold" : "badge-warm"}`}>
                    {roleplay.type}
                  </span>
                  <Button size="sm" variant="ghost" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    Start <Play className="w-3 h-3 ml-1" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;

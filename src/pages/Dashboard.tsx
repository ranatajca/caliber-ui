import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Phone, 
  Users, 
  TrendingUp, 
  Clock, 
  Play, 
  ChevronRight,
  BarChart3,
  Headphones,
  CheckCircle,
  AlertCircle,
  Filter
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/landing/Navbar";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState<"overview" | "calls" | "reps" | "talent">("overview");

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-black">Dashboard</h1>
              <p className="text-muted-foreground">Real-time visibility into your sales operations</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="hero">
                <Users className="w-4 h-4 mr-2" />
                Hire Talent
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8 border-b border-border pb-4 overflow-x-auto">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "calls", label: "Call Recordings", icon: Headphones },
              { id: "reps", label: "Active Reps", icon: Users },
              { id: "talent", label: "Talent Pool", icon: Filter },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as typeof selectedTab)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  selectedTab === tab.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Calls Today"
              value="127"
              change="+12%"
              trend="up"
              icon={<Phone className="w-5 h-5" />}
            />
            <StatCard
              title="Active Reps"
              value="8"
              change="2 on call"
              trend="neutral"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              title="Avg Call Score"
              value="82"
              change="+5pts"
              trend="up"
              icon={<TrendingUp className="w-5 h-5" />}
            />
            <StatCard
              title="Avg Talk Time"
              value="4:32"
              change="-12s"
              trend="down"
              icon={<Clock className="w-5 h-5" />}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Calls */}
            <Card variant="elevated" className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Headphones className="w-5 h-5 text-primary" />
                  Recent Calls
                </CardTitle>
                <CardDescription>Latest call recordings with AI scores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentCalls.map((call, index) => (
                    <motion.div
                      key={call.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors cursor-pointer group"
                    >
                      <button className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Play className="w-4 h-4" />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">{call.prospect}</span>
                          {call.outcome === "positive" && <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />}
                          {call.outcome === "negative" && <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0" />}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {call.rep} • {call.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className={`text-lg font-bold ${
                          call.score >= 85 ? "text-success" : call.score >= 70 ? "text-primary" : "text-accent"
                        }`}>
                          {call.score}
                        </div>
                        <p className="text-xs text-muted-foreground">{call.time}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </motion.div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4">
                  View All Recordings
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>

            {/* Top Performers */}
            <Card variant="elevated">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-success" />
                  Top Performers
                </CardTitle>
                <CardDescription>This week's leading reps</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topPerformers.map((rep, index) => (
                    <div key={rep.name} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        index === 0 
                          ? "bg-accent/20 text-accent" 
                          : index === 1 
                            ? "bg-muted text-muted-foreground" 
                            : "bg-secondary text-secondary-foreground"
                      }`}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{rep.name}</p>
                        <p className="text-xs text-muted-foreground">{rep.calls} calls</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-success">{rep.score}</p>
                        <p className="text-xs text-muted-foreground">avg score</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Talent Pool Preview */}
          <Card variant="glow" className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-primary" />
                Verified Talent Pool
              </CardTitle>
              <CardDescription>Pre-screened sellers ready to deploy</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {talentPool.map((talent) => (
                  <div key={talent.name} className="p-4 rounded-xl bg-secondary/50 border border-border">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {talent.initials}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{talent.name}</p>
                        <p className="text-xs text-muted-foreground">{talent.specialty}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">Caliber Score</span>
                      <span className={`font-bold ${talent.score >= 90 ? "text-success" : "text-primary"}`}>
                        {talent.score}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="hero" className="w-full mt-6">
                Browse All Verified Talent
                <ChevronRight className="w-4 h-4" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, trend, icon }: StatCardProps) => (
  <Card variant="elevated">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
        <span className={`text-sm font-medium ${
          trend === "up" ? "text-success" : trend === "down" ? "text-destructive" : "text-muted-foreground"
        }`}>
          {change}
        </span>
      </div>
      <p className="text-3xl font-black">{value}</p>
      <p className="text-sm text-muted-foreground">{title}</p>
    </CardContent>
  </Card>
);

const recentCalls = [
  { id: 1, prospect: "TechCorp Inc.", rep: "Sarah M.", duration: "5:42", score: 91, time: "2m ago", outcome: "positive" },
  { id: 2, prospect: "Global Solutions", rep: "Mike T.", duration: "3:18", score: 74, time: "8m ago", outcome: "neutral" },
  { id: 3, prospect: "StartupXYZ", rep: "Emily R.", duration: "7:21", score: 88, time: "15m ago", outcome: "positive" },
  { id: 4, prospect: "Enterprise Co.", rep: "John D.", duration: "2:45", score: 62, time: "23m ago", outcome: "negative" },
  { id: 5, prospect: "Innovation Labs", rep: "Sarah M.", duration: "4:56", score: 85, time: "31m ago", outcome: "positive" },
];

const topPerformers = [
  { name: "Sarah Martinez", calls: 47, score: 89 },
  { name: "Mike Thompson", calls: 52, score: 84 },
  { name: "Emily Rodriguez", calls: 38, score: 82 },
  { name: "John Davis", calls: 41, score: 78 },
];

const talentPool = [
  { name: "Alex Chen", initials: "AC", specialty: "B2B Enterprise", score: 94 },
  { name: "Jordan Smith", initials: "JS", specialty: "B2C High-Ticket", score: 91 },
  { name: "Taylor Wilson", initials: "TW", specialty: "B2B SaaS", score: 89 },
  { name: "Morgan Lee", initials: "ML", specialty: "B2C Coaching", score: 88 },
];

export default Dashboard;

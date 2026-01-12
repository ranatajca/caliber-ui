import { BarChart3, TrendingUp, TrendingDown, Phone, Clock, Target, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Analytics = () => {
  const stats = [
    {
      title: "Total Calls",
      value: "127",
      change: "+12%",
      trend: "up",
      icon: Phone,
    },
    {
      title: "Avg Call Score",
      value: "72",
      change: "+5pts",
      trend: "up",
      icon: Target,
    },
    {
      title: "Avg Talk Time",
      value: "4:32",
      change: "-12s",
      trend: "down",
      icon: Clock,
    },
    {
      title: "Active Reps",
      value: "8",
      change: "2 new",
      trend: "up",
      icon: Users,
    },
  ];

  const leaderboard = [
    { name: "Sarah Martinez", calls: 47, avgScore: 89 },
    { name: "Mike Thompson", calls: 52, avgScore: 84 },
    { name: "Emily Rodriguez", calls: 38, avgScore: 82 },
    { name: "John Davis", calls: 41, avgScore: 78 },
    { name: "Saad Khan", calls: 35, avgScore: 75 },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-muted-foreground mt-1">
          Track team performance and call metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-primary" />
                </div>
                <span
                  className={`text-sm font-medium flex items-center gap-1 ${
                    stat.trend === "up" ? "text-success" : "text-destructive"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {stat.change}
                </span>
              </div>
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.title}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-success" />
              Top Performers
            </CardTitle>
            <CardDescription>This week's leading reps by average score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leaderboard.map((rep, index) => (
                <div key={rep.name} className="flex items-center gap-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      index === 0
                        ? "bg-primary text-primary-foreground"
                        : index === 1
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{rep.name}</p>
                    <p className="text-sm text-muted-foreground">{rep.calls} calls</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">{rep.avgScore}</p>
                    <p className="text-xs text-muted-foreground">avg score</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Score Distribution
            </CardTitle>
            <CardDescription>How calls are distributed by score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { range: "90-100", count: 12, percentage: 15 },
                { range: "80-89", count: 28, percentage: 35 },
                { range: "70-79", count: 24, percentage: 30 },
                { range: "60-69", count: 10, percentage: 12 },
                { range: "Below 60", count: 6, percentage: 8 },
              ].map((bucket) => (
                <div key={bucket.range} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{bucket.range}</span>
                    <span className="text-muted-foreground">{bucket.count} calls</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${bucket.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;

import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Phone, 
  Target,
  Clock,
  Users,
  ChevronRight,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const timeFilters = ["7D", "30D", "3M", "6M"];

const weeklyData = [
  { week: "9/1", passed: 22, failed: 8, goal: 50 },
  { week: "9/8", passed: 28, failed: 12, goal: 50 },
  { week: "9/15", passed: 18, failed: 20, goal: 50 },
  { week: "9/22", passed: 25, failed: 10, goal: 50 },
  { week: "9/29", passed: 20, failed: 15, goal: 50 },
  { week: "10/6", passed: 35, failed: 8, goal: 50 },
  { week: "10/13", passed: 32, failed: 10, goal: 50 },
  { week: "10/20", passed: 15, failed: 5, goal: 50 },
];

const objectionHandling = [
  { objection: "I'm doing well, what's the plan for today?", success: 32, total: 52, percentage: 62 },
  { objection: "Did the seller discuss the agenda and ask for input?", success: 32, total: 52, percentage: 62 },
  { objection: "We already use a competitor's solution.", success: 28, total: 45, percentage: 62 },
  { objection: "I need to talk to my team first.", success: 18, total: 38, percentage: 47 },
];

const AnalyticsPage = () => {
  const [activeTimeFilter, setActiveTimeFilter] = useState("7D");
  const [selectedTeam, setSelectedTeam] = useState("Onboarding team");

  const maxBarHeight = 100;
  const maxValue = Math.max(...weeklyData.map(d => d.passed + d.failed));

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Track team performance and identify areas for improvement
          </p>
        </div>
        <div className="flex items-center gap-4">
          <select 
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card text-sm"
          >
            <option>Onboarding team</option>
            <option>Enterprise team</option>
            <option>SMB team</option>
          </select>
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            {timeFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveTimeFilter(filter)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                  activeTimeFilter === filter
                    ? "bg-card shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <OverviewCard
          title="Overall performance"
          value="6.5"
          subtitle="You are behind compared to your team"
          type="score"
        />
        <OverviewCard
          title="Calls completed"
          value="457"
          change={32}
          positive
          subtitle="out of 700 total"
        />
        <OverviewCard
          title="Average Call score"
          value="60%"
          change={-32}
          positive={false}
        />
        <OverviewCard
          title="Conversion rate"
          value="60%"
        />
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Call volume vs. Goal</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 border-t-2 border-dashed border-muted-foreground" />
                    <span className="text-muted-foreground">Goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-destructive" />
                    <span className="text-muted-foreground">Failed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-accent" />
                    <span className="text-muted-foreground">Passed</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end gap-4">
                {weeklyData.map((data, index) => {
                  const total = data.passed + data.failed;
                  const passedHeight = (data.passed / maxValue) * maxBarHeight;
                  const failedHeight = (data.failed / maxValue) * maxBarHeight;
                  
                  return (
                    <div key={data.week} className="flex-1 flex flex-col items-center gap-2">
                      <div className="relative w-full flex flex-col items-center">
                        {/* Goal line */}
                        <div 
                          className="absolute w-full border-t-2 border-dashed border-muted-foreground/50"
                          style={{ bottom: `${(data.goal / maxValue) * maxBarHeight}%` }}
                        />
                        {/* Stacked bar */}
                        <div className="w-full flex flex-col-reverse items-center gap-0.5">
                          <div 
                            className="w-full bg-accent rounded-t bar-animate"
                            style={{ 
                              height: `${passedHeight}px`,
                              animationDelay: `${index * 100}ms`
                            }}
                          />
                          <div 
                            className="w-full bg-destructive bar-animate"
                            style={{ 
                              height: `${failedHeight}px`,
                              animationDelay: `${index * 100 + 50}ms`
                            }}
                          />
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">{data.week}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Weekly Score Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Weekly Call score vs. Goal</CardTitle>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-0.5 border-t-2 border-dashed border-muted-foreground" />
                    <span className="text-muted-foreground">Goal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded bg-accent" />
                    <span className="text-muted-foreground">Calls</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-48 relative">
                {/* Simplified line chart representation */}
                <svg className="w-full h-full" viewBox="0 0 400 150" preserveAspectRatio="none">
                  <line x1="0" y1="75" x2="400" y2="75" stroke="currentColor" strokeDasharray="5,5" className="text-muted-foreground/50" strokeWidth="1" />
                  <path 
                    d="M0,130 Q50,120 100,100 T200,80 T300,60 T400,40" 
                    fill="none" 
                    stroke="hsl(var(--accent))" 
                    strokeWidth="3"
                  />
                </svg>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Learning Modules */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Learning modules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Learning modules assigned</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Certificate trainings assigned</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-warning">2</p>
                  <p className="text-sm text-muted-foreground">are due soon</p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>

          {/* Objection Handling */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Objection Frequency & Handling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {objectionHandling.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {item.percentage}%
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.objection}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.success} successful attempts out of {item.total}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const OverviewCard = ({ 
  title, 
  value, 
  change, 
  positive,
  subtitle,
  type
}: { 
  title: string; 
  value: string; 
  change?: number;
  positive?: boolean;
  subtitle?: string;
  type?: "score";
}) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        {type === "score" && (
          <div className="w-12 h-12 rounded-full border-4 border-accent flex items-center justify-center">
            <span className="text-sm font-bold">{value}</span>
          </div>
        )}
      </div>
      {type !== "score" && (
        <div className="flex items-end gap-2">
          <p className="text-3xl font-bold">{value}</p>
          {change !== undefined && (
            <span className={cn(
              "text-sm font-medium flex items-center gap-0.5 mb-1",
              positive ? "text-success" : "text-destructive"
            )}>
              {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {Math.abs(change)}%
            </span>
          )}
        </div>
      )}
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
      )}
    </CardContent>
  </Card>
);

export default AnalyticsPage;

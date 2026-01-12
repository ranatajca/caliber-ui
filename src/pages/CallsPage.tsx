import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Play, Clock, User, Search, Filter, ChevronRight, Calendar, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface Call {
  id: string;
  buyerName: string;
  buyerRole: string;
  buyerCompany: string;
  callType: "cold" | "warm" | "discovery";
  date: string;
  duration: string;
  score: number;
  traits: string[];
  status: "completed" | "in-progress";
}

const mockCalls: Call[] = [
  {
    id: "1",
    buyerName: "Jane Bowen",
    buyerRole: "Director of Sales",
    buyerCompany: "Agile Solutions",
    callType: "cold",
    date: "Today, 2:30 PM",
    duration: "4:24",
    score: 82,
    traits: ["aggressive"],
    status: "completed",
  },
  {
    id: "2",
    buyerName: "Marcus Chen",
    buyerRole: "VP of Engineering",
    buyerCompany: "TechScale",
    callType: "discovery",
    date: "Today, 11:15 AM",
    duration: "6:45",
    score: 91,
    traits: ["technical", "skeptical"],
    status: "completed",
  },
  {
    id: "3",
    buyerName: "Sarah Kim",
    buyerRole: "Founder & CEO",
    buyerCompany: "StartupXYZ",
    callType: "warm",
    date: "Yesterday",
    duration: "3:15",
    score: 67,
    traits: ["busy"],
    status: "completed",
  },
  {
    id: "4",
    buyerName: "Ryan Mitchell",
    buyerRole: "Data Manager",
    buyerCompany: "DataCorp",
    callType: "cold",
    date: "Jan 10",
    duration: "5:32",
    score: 75,
    traits: ["not friendly"],
    status: "completed",
  },
  {
    id: "5",
    buyerName: "Emily Johnson",
    buyerRole: "VP of Sales",
    buyerCompany: "SalesForce",
    callType: "cold",
    date: "Jan 9",
    duration: "4:18",
    score: 88,
    traits: ["nice"],
    status: "completed",
  },
];

const filters = ["All Calls", "Cold Calls", "Warm Calls", "Discovery Calls"];

const CallsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Calls");

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-success bg-success/10";
    if (score >= 70) return "text-warning bg-warning/10";
    return "text-destructive bg-destructive/10";
  };

  const getCallTypeBadge = (type: string) => {
    switch (type) {
      case "cold": return "badge-cold";
      case "warm": return "badge-warm";
      default: return "bg-purple-100 text-purple-700 border border-purple-200";
    }
  };

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Call History</h1>
          <p className="text-muted-foreground mt-1">
            Review and analyze your past practice sessions
          </p>
        </div>
        <Button onClick={() => navigate("/roleplays")} className="gap-2">
          <Phone className="w-4 h-4" />
          Start new call
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Calls" value="47" change="+12 this week" />
        <StatCard label="Avg Score" value="78" change="+5 vs last week" positive />
        <StatCard label="Total Time" value="3h 24m" change="This month" />
        <StatCard label="Best Score" value="95" change="Discovery call" positive />
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calls List */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr,150px,100px,100px,80px,40px] gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
          <span>Buyer</span>
          <span>Type</span>
          <span>Duration</span>
          <span>Date</span>
          <span>Score</span>
          <span></span>
        </div>
        {mockCalls.map((call, index) => (
          <div
            key={call.id}
            onClick={() => navigate(`/calls/${call.id}`)}
            className={cn(
              "grid grid-cols-[1fr,150px,100px,100px,80px,40px] gap-4 px-4 py-4 items-center cursor-pointer hover:bg-muted/50 transition-colors animate-slide-up",
              index !== mockCalls.length - 1 && "border-b border-border"
            )}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Buyer */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary">
                {call.buyerName.split(" ").map(n => n[0]).join("")}
              </div>
              <div>
                <p className="font-medium">{call.buyerName}</p>
                <p className="text-sm text-muted-foreground">
                  {call.buyerRole} @ {call.buyerCompany}
                </p>
              </div>
            </div>

            {/* Type */}
            <div>
              <span className={cn("badge-trait", getCallTypeBadge(call.callType))}>
                {call.callType.charAt(0).toUpperCase() + call.callType.slice(1)} Call
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              {call.duration}
            </div>

            {/* Date */}
            <div className="text-sm text-muted-foreground">
              {call.date}
            </div>

            {/* Score */}
            <div className={cn("font-bold text-lg rounded-lg px-2 py-1 text-center", getScoreColor(call.score))}>
              {call.score}
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </div>
        ))}
      </div>
    </div>
  );
};

const StatCard = ({ 
  label, 
  value, 
  change, 
  positive 
}: { 
  label: string; 
  value: string; 
  change: string;
  positive?: boolean;
}) => (
  <div className="bg-card rounded-xl border border-border p-4">
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <p className="text-2xl font-bold">{value}</p>
      <span className={cn(
        "text-xs font-medium flex items-center gap-1",
        positive ? "text-success" : "text-muted-foreground"
      )}>
        {positive && <TrendingUp className="w-3 h-3" />}
        {change}
      </span>
    </div>
  </div>
);

export default CallsPage;

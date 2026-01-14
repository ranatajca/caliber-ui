import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Clock, Search, Filter, ChevronRight, TrendingUp, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Call {
  id: string;
  buyerName: string;
  buyerRole: string;
  buyerCompany: string;
  repName: string;
  repColor: string;
  callType: "cold" | "warm" | "discovery";
  date: string;
  duration: string;
  score: number;
  outcome: string;
  status: "completed" | "in-progress";
}

const repColors: Record<string, string> = {
  "Sarah Chen": "#6366F1",
  "Marcus Johnson": "#EC4899",
  "Elena Rodriguez": "#14B8A6",
  "James Mitchell": "#F59E0B",
  "Aisha Patel": "#8B5CF6",
  "Ryan O'Connor": "#06B6D4",
};

const mockCalls: Call[] = [
  {
    id: "1",
    buyerName: "Michael Torres",
    buyerRole: "VP of Operations",
    buyerCompany: "Nexus Technologies",
    repName: "Sarah Chen",
    repColor: repColors["Sarah Chen"],
    callType: "discovery",
    date: "Today, 2:30 PM",
    duration: "32:15",
    score: 89,
    outcome: "Demo Scheduled",
    status: "completed",
  },
  {
    id: "2",
    buyerName: "Rebecca Foster",
    buyerRole: "Director of Sales",
    buyerCompany: "Pinnacle Group",
    repName: "Marcus Johnson",
    repColor: repColors["Marcus Johnson"],
    callType: "cold",
    date: "Today, 11:15 AM",
    duration: "28:42",
    score: 74,
    outcome: "Follow-up",
    status: "completed",
  },
  {
    id: "3",
    buyerName: "Daniel Park",
    buyerRole: "CTO",
    buyerCompany: "Quantum Labs",
    repName: "Sarah Chen",
    repColor: repColors["Sarah Chen"],
    callType: "warm",
    date: "Yesterday, 4:00 PM",
    duration: "45:20",
    score: 92,
    outcome: "Proposal Sent",
    status: "completed",
  },
  {
    id: "4",
    buyerName: "Jessica Williams",
    buyerRole: "Head of Procurement",
    buyerCompany: "Atlas Industries",
    repName: "Elena Rodriguez",
    repColor: repColors["Elena Rodriguez"],
    callType: "cold",
    date: "Yesterday, 10:30 AM",
    duration: "18:33",
    score: 52,
    outcome: "No Interest",
    status: "completed",
  },
  {
    id: "5",
    buyerName: "Christopher Lee",
    buyerRole: "Sales Manager",
    buyerCompany: "Horizon Ventures",
    repName: "James Mitchell",
    repColor: repColors["James Mitchell"],
    callType: "discovery",
    date: "Jan 12, 3:45 PM",
    duration: "38:55",
    score: 81,
    outcome: "Meeting Booked",
    status: "completed",
  },
  {
    id: "6",
    buyerName: "Amanda Nguyen",
    buyerRole: "VP of Marketing",
    buyerCompany: "Spark Digital",
    repName: "Aisha Patel",
    repColor: repColors["Aisha Patel"],
    callType: "warm",
    date: "Jan 12, 11:00 AM",
    duration: "24:18",
    score: 68,
    outcome: "Follow-up",
    status: "completed",
  },
  {
    id: "7",
    buyerName: "Robert Chen",
    buyerRole: "COO",
    buyerCompany: "Vertex Solutions",
    repName: "Sarah Chen",
    repColor: repColors["Sarah Chen"],
    callType: "discovery",
    date: "Jan 11, 2:15 PM",
    duration: "42:30",
    score: 85,
    outcome: "Proposal Sent",
    status: "completed",
  },
  {
    id: "8",
    buyerName: "Emily Thompson",
    buyerRole: "Director of IT",
    buyerCompany: "Meridian Corp",
    repName: "Marcus Johnson",
    repColor: repColors["Marcus Johnson"],
    callType: "cold",
    date: "Jan 11, 9:30 AM",
    duration: "15:45",
    score: 44,
    outcome: "No Interest",
    status: "completed",
  },
  {
    id: "9",
    buyerName: "Kevin Martinez",
    buyerRole: "VP of Engineering",
    buyerCompany: "Catalyst Tech",
    repName: "Elena Rodriguez",
    repColor: repColors["Elena Rodriguez"],
    callType: "warm",
    date: "Jan 10, 4:30 PM",
    duration: "35:22",
    score: 78,
    outcome: "Demo Scheduled",
    status: "completed",
  },
  {
    id: "10",
    buyerName: "Laura Kim",
    buyerRole: "Head of Sales",
    buyerCompany: "Summit Partners",
    repName: "Ryan O'Connor",
    repColor: repColors["Ryan O'Connor"],
    callType: "cold",
    date: "Jan 10, 1:00 PM",
    duration: "22:10",
    score: 61,
    outcome: "Follow-up",
    status: "completed",
  },
  {
    id: "11",
    buyerName: "Jason Wright",
    buyerRole: "CEO",
    buyerCompany: "Elevate Inc",
    repName: "Sarah Chen",
    repColor: repColors["Sarah Chen"],
    callType: "discovery",
    date: "Jan 9, 3:00 PM",
    duration: "51:40",
    score: 94,
    outcome: "Contract Sent",
    status: "completed",
  },
  {
    id: "12",
    buyerName: "Natalie Brown",
    buyerRole: "Director of Strategy",
    buyerCompany: "Apex Dynamics",
    repName: "James Mitchell",
    repColor: repColors["James Mitchell"],
    callType: "warm",
    date: "Jan 9, 10:45 AM",
    duration: "29:15",
    score: 71,
    outcome: "Meeting Booked",
    status: "completed",
  },
];

const filters = ["All Calls", "Cold Calls", "Warm Calls", "Discovery Calls"];

const CallsPage = () => {
  const navigate = useNavigate();
  const { isManager } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Calls");
  const [repFilter, setRepFilter] = useState("all");

  // Simulated current user (in real app, this would come from auth)
  const currentUserName = "Sarah Chen";

  const uniqueReps = Array.from(new Set(mockCalls.map(c => c.repName)));

  // Filter calls: Managers see all, Reps only see their own
  const baseCalls = isManager ? mockCalls : mockCalls.filter(c => c.repName === currentUserName);

  const filteredCalls = baseCalls.filter(call => {
    const matchesSearch = 
      call.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.repName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = activeFilter === "All Calls" || 
      (activeFilter === "Cold Calls" && call.callType === "cold") ||
      (activeFilter === "Warm Calls" && call.callType === "warm") ||
      (activeFilter === "Discovery Calls" && call.callType === "discovery");
    
    const matchesRep = repFilter === "all" || call.repName === repFilter;
    
    return matchesSearch && matchesType && matchesRep;
  });

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

  const getOutcomeStyle = (outcome: string) => {
    if (outcome.includes("Contract") || outcome.includes("Proposal")) {
      return "bg-success/10 text-success border-success/20";
    }
    if (outcome.includes("Scheduled") || outcome.includes("Booked")) {
      return "bg-accent/10 text-accent border-accent/20";
    }
    if (outcome === "No Interest") {
      return "bg-muted text-muted-foreground";
    }
    return "bg-warning/10 text-warning border-warning/20";
  };

  const avgScore = Math.round(filteredCalls.reduce((a, c) => a + c.score, 0) / filteredCalls.length);
  const positiveOutcomes = filteredCalls.filter(c => 
    c.outcome.includes("Scheduled") || c.outcome.includes("Booked") || c.outcome.includes("Sent")
  ).length;

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold">
            {isManager ? "Call Library" : "My Calls"}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {isManager 
              ? "Review and analyze team call recordings" 
              : "Review your past call recordings and performance"
            }
          </p>
        </div>
        <Button onClick={() => navigate("/roleplays")} className="gap-2 w-full sm:w-auto">
          <Phone className="w-4 h-4" />
          Start new call
        </Button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <StatCard 
          label="Total Calls" 
          value={filteredCalls.length.toString()} 
          change={isManager ? `${uniqueReps.length} reps` : "This period"} 
        />
        <StatCard label="Avg Score" value={avgScore.toString()} change="+5 vs last week" positive />
        <StatCard 
          label="Positive Outcomes" 
          value={positiveOutcomes.toString()} 
          change={`${Math.round(positiveOutcomes / filteredCalls.length * 100)}% rate`} 
          positive 
        />
        <StatCard 
          label="Best Score" 
          value={isManager ? "94" : Math.max(...filteredCalls.map(c => c.score)).toString()} 
          change={isManager ? "Sarah Chen" : "Personal best"} 
          positive 
        />
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 md:gap-3">
          {isManager && (
            <Select value={repFilter} onValueChange={setRepFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by rep" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Reps</SelectItem>
                {uniqueReps.map(rep => (
                  <SelectItem key={rep} value={rep}>{rep}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <div className="relative flex-1 sm:w-48 md:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search calls..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon" onClick={() => toast.info("Advanced filters coming soon!")}>
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Calls List - Mobile Card View */}
      <div className="block md:hidden space-y-3">
        {filteredCalls.map((call, index) => (
          <div
            key={call.id}
            onClick={() => navigate(`/calls/${call.id}`)}
            className="bg-card rounded-xl border border-border p-4 cursor-pointer hover:shadow-md transition-all"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary">
                  {call.buyerName.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="font-medium">{call.buyerName}</p>
                  <p className="text-xs text-muted-foreground">{call.buyerRole}</p>
                </div>
              </div>
              <div className={cn("font-bold text-lg rounded-lg px-2 py-1", getScoreColor(call.score))}>
                {call.score}
              </div>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span 
                className="px-2 py-0.5 rounded-full text-white text-xs font-medium"
                style={{ backgroundColor: call.repColor }}
              >
                {call.repName}
              </span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {call.duration}
                </span>
                <span>{call.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Calls List - Desktop Table View */}
      <div className="hidden md:block bg-card rounded-xl border border-border overflow-hidden">
        <div className="grid grid-cols-[1fr,140px,120px,100px,120px,80px,40px] gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b border-border">
          <span>Prospect</span>
          <span>Sales Rep</span>
          <span>Type</span>
          <span>Duration</span>
          <span>Outcome</span>
          <span>Score</span>
          <span></span>
        </div>
        {filteredCalls.map((call, index) => (
          <div
            key={call.id}
            onClick={() => navigate(`/calls/${call.id}`)}
            className={cn(
              "grid grid-cols-[1fr,140px,120px,100px,120px,80px,40px] gap-4 px-4 py-4 items-center cursor-pointer hover:bg-muted/50 transition-colors group",
              index !== filteredCalls.length - 1 && "border-b border-border"
            )}
          >
            {/* Prospect */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-primary">
                {call.buyerName.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="min-w-0">
                <p className="font-medium truncate">{call.buyerName}</p>
                <p className="text-sm text-muted-foreground truncate flex items-center gap-1">
                  <Building2 className="w-3 h-3" />
                  {call.buyerCompany}
                </p>
              </div>
            </div>

            {/* Sales Rep Tag */}
            <div>
              <span 
                className="px-2.5 py-1 rounded-full text-white text-xs font-medium inline-block"
                style={{ backgroundColor: call.repColor }}
              >
                {call.repName.split(" ")[0]}
              </span>
            </div>

            {/* Type */}
            <div>
              <span className={cn("badge-trait text-xs", getCallTypeBadge(call.callType))}>
                {call.callType.charAt(0).toUpperCase() + call.callType.slice(1)}
              </span>
            </div>

            {/* Duration */}
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Clock className="w-4 h-4" />
              {call.duration}
            </div>

            {/* Outcome */}
            <div>
              <Badge variant="outline" className={`text-xs ${getOutcomeStyle(call.outcome)}`}>
                {call.outcome}
              </Badge>
            </div>

            {/* Score */}
            <div className={cn("font-bold text-base rounded-lg px-2 py-1 text-center", getScoreColor(call.score))}>
              {call.score}
            </div>

            {/* Arrow */}
            <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
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
  <div className="bg-card rounded-xl border border-border p-3 md:p-4 hover:shadow-md transition-shadow">
    <p className="text-xs md:text-sm text-muted-foreground mb-1">{label}</p>
    <div className="flex items-end justify-between">
      <p className="text-xl md:text-2xl font-bold">{value}</p>
      <span className={cn(
        "text-[10px] md:text-xs font-medium flex items-center gap-1",
        positive ? "text-success" : "text-muted-foreground"
      )}>
        {positive && <TrendingUp className="w-3 h-3" />}
        <span className="hidden sm:inline">{change}</span>
      </span>
    </div>
  </div>
);

export default CallsPage;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Play, Clock, User, Building2, Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  date: string;
  duration: string;
  score: number;
  traits: string[];
  outcome: string;
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
    date: "Jan 14, 2:30 PM",
    duration: "32:15",
    score: 89,
    traits: ["Engaged", "Decision Maker"],
    outcome: "Demo Scheduled",
  },
  {
    id: "2",
    buyerName: "Rebecca Foster",
    buyerRole: "Director of Sales",
    buyerCompany: "Pinnacle Group",
    repName: "Marcus Johnson",
    repColor: repColors["Marcus Johnson"],
    date: "Jan 14, 11:15 AM",
    duration: "28:42",
    score: 74,
    traits: ["Skeptical"],
    outcome: "Follow-up",
  },
  {
    id: "3",
    buyerName: "Daniel Park",
    buyerRole: "CTO",
    buyerCompany: "Quantum Labs",
    repName: "Sarah Chen",
    repColor: repColors["Sarah Chen"],
    date: "Jan 13, 4:00 PM",
    duration: "45:20",
    score: 92,
    traits: ["Technical", "Engaged"],
    outcome: "Proposal Sent",
  },
  {
    id: "4",
    buyerName: "Jessica Williams",
    buyerRole: "Head of Procurement",
    buyerCompany: "Atlas Industries",
    repName: "Elena Rodriguez",
    repColor: repColors["Elena Rodriguez"],
    date: "Jan 13, 10:30 AM",
    duration: "18:33",
    score: 52,
    traits: ["Busy", "Price-focused"],
    outcome: "No Interest",
  },
  {
    id: "5",
    buyerName: "Christopher Lee",
    buyerRole: "Sales Manager",
    buyerCompany: "Horizon Ventures",
    repName: "James Mitchell",
    repColor: repColors["James Mitchell"],
    date: "Jan 12, 3:45 PM",
    duration: "38:55",
    score: 81,
    traits: ["Friendly", "Curious"],
    outcome: "Meeting Booked",
  },
  {
    id: "6",
    buyerName: "Amanda Nguyen",
    buyerRole: "VP of Marketing",
    buyerCompany: "Spark Digital",
    repName: "Aisha Patel",
    repColor: repColors["Aisha Patel"],
    date: "Jan 12, 11:00 AM",
    duration: "24:18",
    score: 68,
    traits: ["Interested"],
    outcome: "Follow-up",
  },
  {
    id: "7",
    buyerName: "Robert Chen",
    buyerRole: "COO",
    buyerCompany: "Vertex Solutions",
    repName: "Sarah Chen",
    repColor: repColors["Sarah Chen"],
    date: "Jan 11, 2:15 PM",
    duration: "42:30",
    score: 85,
    traits: ["Decision Maker", "Analytical"],
    outcome: "Proposal Sent",
  },
  {
    id: "8",
    buyerName: "Emily Thompson",
    buyerRole: "Director of IT",
    buyerCompany: "Meridian Corp",
    repName: "Marcus Johnson",
    repColor: repColors["Marcus Johnson"],
    date: "Jan 11, 9:30 AM",
    duration: "15:45",
    score: 44,
    traits: ["Rushed", "Not interested"],
    outcome: "No Interest",
  },
  {
    id: "9",
    buyerName: "Kevin Martinez",
    buyerRole: "VP of Engineering",
    buyerCompany: "Catalyst Tech",
    repName: "Elena Rodriguez",
    repColor: repColors["Elena Rodriguez"],
    date: "Jan 10, 4:30 PM",
    duration: "35:22",
    score: 78,
    traits: ["Technical", "Engaged"],
    outcome: "Demo Scheduled",
  },
  {
    id: "10",
    buyerName: "Laura Kim",
    buyerRole: "Head of Sales",
    buyerCompany: "Summit Partners",
    repName: "Ryan O'Connor",
    repColor: repColors["Ryan O'Connor"],
    date: "Jan 10, 1:00 PM",
    duration: "22:10",
    score: 61,
    traits: ["Cautious"],
    outcome: "Follow-up",
  },
  {
    id: "11",
    buyerName: "Jason Wright",
    buyerRole: "CEO",
    buyerCompany: "Elevate Inc",
    repName: "Sarah Chen",
    repColor: repColors["Sarah Chen"],
    date: "Jan 9, 3:00 PM",
    duration: "51:40",
    score: 94,
    traits: ["Decision Maker", "Excited"],
    outcome: "Contract Sent",
  },
  {
    id: "12",
    buyerName: "Natalie Brown",
    buyerRole: "Director of Strategy",
    buyerCompany: "Apex Dynamics",
    repName: "James Mitchell",
    repColor: repColors["James Mitchell"],
    date: "Jan 9, 10:45 AM",
    duration: "29:15",
    score: 71,
    traits: ["Analytical"],
    outcome: "Meeting Booked",
  },
];

const Calls = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [repFilter, setRepFilter] = useState("all");

  const uniqueReps = Array.from(new Set(mockCalls.map(c => c.repName)));

  const filteredCalls = mockCalls.filter(call => {
    const matchesSearch = 
      call.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.buyerCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      call.repName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRep = repFilter === "all" || call.repName === repFilter;
    return matchesSearch && matchesRep;
  });

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
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

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Call Library</h1>
          <p className="text-muted-foreground mt-1">
            Review and analyze team call recordings
          </p>
        </div>
        <Button onClick={() => navigate("/simulations/new/start")} className="gap-2">
          <Phone className="w-4 h-4" />
          Start new call
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by prospect, company, or rep..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={repFilter} onValueChange={setRepFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by rep" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Reps</SelectItem>
            {uniqueReps.map(rep => (
              <SelectItem key={rep} value={rep}>{rep}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          More Filters
        </Button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-6 mb-6 text-sm text-muted-foreground">
        <span>{filteredCalls.length} calls</span>
        <span>•</span>
        <span>Avg Score: {Math.round(filteredCalls.reduce((a, c) => a + c.score, 0) / filteredCalls.length)}</span>
        <span>•</span>
        <span>{filteredCalls.filter(c => c.outcome.includes("Scheduled") || c.outcome.includes("Booked") || c.outcome.includes("Sent")).length} positive outcomes</span>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {filteredCalls.map((call) => (
          <div
            key={call.id}
            onClick={() => navigate(`/calls/${call.id}`)}
            className="bg-card border border-border rounded-xl p-4 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-muted-foreground" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="font-semibold text-foreground">
                    {call.buyerName}
                  </h3>
                  {/* Rep Tag */}
                  <span 
                    className="px-2.5 py-0.5 text-xs font-medium rounded-full text-white"
                    style={{ backgroundColor: call.repColor }}
                  >
                    {call.repName}
                  </span>
                  {/* Outcome Badge */}
                  <Badge variant="outline" className={`text-xs ${getOutcomeStyle(call.outcome)}`}>
                    {call.outcome}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {call.buyerRole} @ {call.buyerCompany}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {call.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {call.duration}
                  </span>
                </div>
              </div>

              {/* Traits */}
              <div className="hidden md:flex items-center gap-2">
                {call.traits.map((trait) => (
                  <Badge key={trait} variant="secondary" className="text-xs">
                    {trait}
                  </Badge>
                ))}
              </div>

              {/* Score */}
              <div className={`text-2xl font-bold min-w-[3rem] text-right ${getScoreColor(call.score)}`}>
                {call.score}
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calls;

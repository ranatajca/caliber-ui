import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Phone, Play, Clock, User, Building2, Search, Filter, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Call {
  id: string;
  buyerName: string;
  buyerRole: string;
  buyerCompany: string;
  repName: string;
  date: string;
  duration: string;
  score: number;
  traits: string[];
}

const mockCalls: Call[] = [
  {
    id: "1",
    buyerName: "Jane Bowen",
    buyerRole: "Director of Sales",
    buyerCompany: "Agile Solutions",
    repName: "Saad Khan",
    date: "Jan 10, 7:44 PM",
    duration: "4:24",
    score: 72,
    traits: ["Rude"],
  },
  {
    id: "2",
    buyerName: "Marcus Chen",
    buyerRole: "VP of Sales",
    buyerCompany: "TechScale Solutions",
    repName: "Tom Slocum",
    date: "Dec 19, 12:12 PM",
    duration: "0:56",
    score: 45,
    traits: ["busy", "aggressive"],
  },
  {
    id: "3",
    buyerName: "Ryan Mitchell",
    buyerRole: "Data Engineering Manager",
    buyerCompany: "Agile Solutions",
    repName: "Sriharsha Guduguntla",
    date: "Dec 18, 3:21 PM",
    duration: "3:21",
    score: 88,
    traits: ["busy", "not friendly"],
  },
];

const Calls = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Calls</h1>
          <p className="text-muted-foreground mt-1">
            View and analyze your call recordings
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
            placeholder="Search calls..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </div>

      {/* Calls List */}
      <div className="space-y-3">
        {mockCalls.map((call) => (
          <div
            key={call.id}
            onClick={() => navigate(`/calls/${call.id}`)}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer group"
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
                    Cold Call with {call.buyerName}
                  </h3>
                  <span className="px-2 py-0.5 bg-primary text-primary-foreground text-xs font-medium rounded">
                    {call.repName}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {call.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Building2 className="w-4 h-4" />
                    {call.buyerRole} @ {call.buyerCompany}
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {call.duration}
                  </span>
                </div>
              </div>

              {/* Traits */}
              <div className="flex items-center gap-2">
                {call.traits.map((trait) => (
                  <span key={trait} className="badge-trait">
                    {trait}
                  </span>
                ))}
              </div>

              {/* Score */}
              <div className={`text-2xl font-bold ${getScoreColor(call.score)}`}>
                {call.score}
              </div>

              {/* Arrow */}
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calls;

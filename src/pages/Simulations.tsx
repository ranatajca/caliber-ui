import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Play, Clock, User, Building2, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Simulation {
  id: string;
  buyerName: string;
  buyerRole: string;
  buyerCompany: string;
  buyerImage?: string;
  traits: string[];
  lastUsed: string;
  totalCalls: number;
}

const mockSimulations: Simulation[] = [
  {
    id: "1",
    buyerName: "Jane Bowen",
    buyerRole: "Director of Sales",
    buyerCompany: "Agile Solutions",
    traits: ["busy", "aggressive", "not friendly"],
    lastUsed: "2 hours ago",
    totalCalls: 24,
  },
  {
    id: "2",
    buyerName: "Marcus Chen",
    buyerRole: "VP of Sales",
    buyerCompany: "TechScale Solutions",
    traits: ["skeptical", "data-driven", "impatient"],
    lastUsed: "1 day ago",
    totalCalls: 18,
  },
  {
    id: "3",
    buyerName: "Sarah Mitchell",
    buyerRole: "Senior Partner",
    buyerCompany: "Mitchell & Associates",
    traits: ["burned out", "time-poor", "financially savvy"],
    lastUsed: "3 days ago",
    totalCalls: 12,
  },
];

const Simulations = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Simulations</h1>
          <p className="text-muted-foreground mt-1">
            Practice cold calls with AI-powered buyer personas
          </p>
        </div>
        <Button onClick={() => navigate("/simulations/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          New Simulation
        </Button>
      </div>

      {/* Simulations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockSimulations.map((sim) => (
          <Card
            key={sim.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => navigate(`/simulations/${sim.id}/start`)}
          >
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{sim.buyerName}</h3>
                    <p className="text-sm text-muted-foreground">{sim.buyerRole}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Building2 className="w-4 h-4" />
                <span>{sim.buyerCompany}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {sim.traits.map((trait) => (
                  <span key={trait} className="badge-trait">
                    {trait}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {sim.lastUsed}
                  </span>
                  <span className="flex items-center gap-1">
                    <Play className="w-4 h-4" />
                    {sim.totalCalls} calls
                  </span>
                </div>
                <Button size="sm" className="gap-1">
                  <Play className="w-3 h-3" />
                  Start
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Create New Card */}
        <Card
          className="border-dashed hover:border-primary hover:bg-secondary/50 transition-colors cursor-pointer"
          onClick={() => navigate("/simulations/new")}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[240px] text-center">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">Create New Simulation</h3>
            <p className="text-sm text-muted-foreground">
              Configure a custom AI buyer persona
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Simulations;

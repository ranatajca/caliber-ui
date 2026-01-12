import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, User, Building2, MoreVertical, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Buyer {
  id: string;
  name: string;
  role: string;
  company: string;
  traits: string[];
  totalCalls: number;
}

const mockBuyers: Buyer[] = [
  {
    id: "1",
    name: "Jane Bowen",
    role: "Director of Sales",
    company: "Agile Solutions",
    traits: ["busy", "aggressive", "not friendly"],
    totalCalls: 24,
  },
  {
    id: "2",
    name: "Marcus Chen",
    role: "VP of Sales",
    company: "TechScale Solutions",
    traits: ["skeptical", "data-driven", "impatient"],
    totalCalls: 18,
  },
  {
    id: "3",
    name: "Sarah Mitchell",
    role: "Senior Partner",
    company: "Mitchell & Associates",
    traits: ["burned out", "time-poor", "financially savvy"],
    totalCalls: 12,
  },
  {
    id: "4",
    name: "Ryan Mitchell",
    role: "Data Engineering Manager",
    company: "Agile Solutions",
    traits: ["busy", "not friendly"],
    totalCalls: 8,
  },
];

const Buyers = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Buyers</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI buyer personas
          </p>
        </div>
        <Button onClick={() => navigate("/simulations/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Buyer
        </Button>
      </div>

      {/* Buyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockBuyers.map((buyer) => (
          <Card key={buyer.id} className="group">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <User className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{buyer.name}</h3>
                    <p className="text-sm text-muted-foreground">{buyer.role}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Building2 className="w-4 h-4" />
                <span>{buyer.company}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {buyer.traits.map((trait) => (
                  <span key={trait} className="badge-trait">
                    {trait}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">
                  {buyer.totalCalls} calls
                </span>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="gap-1">
                    <Edit className="w-3 h-3" />
                    Edit
                  </Button>
                  <Button variant="ghost" size="sm" className="gap-1 text-destructive hover:text-destructive">
                    <Trash2 className="w-3 h-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Buyers;

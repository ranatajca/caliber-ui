import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Sparkles, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const personalityTraits = [
  { id: "busy", label: "Busy" },
  { id: "aggressive", label: "Aggressive" },
  { id: "friendly", label: "Friendly" },
  { id: "not-friendly", label: "Not Friendly" },
  { id: "skeptical", label: "Skeptical" },
  { id: "data-driven", label: "Data-Driven" },
  { id: "impatient", label: "Impatient" },
  { id: "rude", label: "Rude" },
  { id: "burned-out", label: "Burned Out" },
  { id: "time-poor", label: "Time Poor" },
];

const NewSimulation = () => {
  const navigate = useNavigate();
  const [buyerName, setBuyerName] = useState("");
  const [buyerRole, setBuyerRole] = useState("");
  const [buyerCompany, setBuyerCompany] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [scenario, setScenario] = useState("");

  const toggleTrait = (traitId: string) => {
    setSelectedTraits((prev) =>
      prev.includes(traitId)
        ? prev.filter((t) => t !== traitId)
        : [...prev, traitId]
    );
  };

  const handleCreate = () => {
    // In production, this would create the simulation
    navigate("/simulations/new-id/start");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate("/simulations")}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Create New Simulation</h1>
          <p className="text-muted-foreground mt-1">
            Configure your AI buyer persona for cold call practice
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Buyer Profile */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5 text-primary" />
              Buyer Profile
            </CardTitle>
            <CardDescription>
              Define who your AI buyer will be
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Buyer Name</Label>
                <Input
                  id="buyerName"
                  placeholder="e.g., Jane Bowen"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buyerRole">Role / Title</Label>
                <Input
                  id="buyerRole"
                  placeholder="e.g., Director of Sales"
                  value={buyerRole}
                  onChange={(e) => setBuyerRole(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="buyerCompany">Company</Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="buyerCompany"
                  placeholder="e.g., Agile Solutions"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personality Traits */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Personality Traits
            </CardTitle>
            <CardDescription>
              Select traits that define how the AI buyer will behave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {personalityTraits.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => toggleTrait(trait.id)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedTraits.includes(trait.id)
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
                  {trait.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* AI Instructions */}
        <Card>
          <CardHeader>
            <CardTitle>AI Role Instructions</CardTitle>
            <CardDescription>
              Tell the AI how to behave during the call. Be specific about objections, tone, and responses.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="scenario">Call Scenario</Label>
              <Textarea
                id="scenario"
                placeholder="e.g., The buyer works at a B2B SaaS company that sells project management software. They're skeptical of cold calls and protective of their team's time."
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="instructions">Behavior Instructions</Label>
              <Textarea
                id="instructions"
                placeholder="e.g., Be dismissive initially. Only engage if the caller mentions specific pain points. Ask about ROI and integration costs. Object to new software adoption."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Required Objections */}
        <Card>
          <CardHeader>
            <CardTitle>Required Objections</CardTitle>
            <CardDescription>
              These objections will be raised during the call to test the salesperson's skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Status Quo</p>
                <p className="text-sm text-muted-foreground">
                  "We already use Salesforce/HubSpot, I don't need another tool."
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Adoption Risk</p>
                <p className="text-sm text-muted-foreground">
                  "My reps won't use this. They hate learning new software."
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">Budget</p>
                <p className="text-sm text-muted-foreground">
                  "We froze hiring and tech spend for Q3."
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4">
          <Button variant="outline" onClick={() => navigate("/simulations")}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" className="gap-2">
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            <Button onClick={handleCreate} className="gap-2">
              Create & Start Simulation
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewSimulation;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Sparkles, Save, Plus, X, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const personalityTraits = [
  { id: "busy", label: "Busy", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { id: "aggressive", label: "Aggressive", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "friendly", label: "Friendly", color: "bg-green-100 text-green-700 border-green-200" },
  { id: "skeptical", label: "Skeptical", color: "bg-purple-100 text-purple-700 border-purple-200" },
  { id: "data-driven", label: "Data-Driven", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { id: "impatient", label: "Impatient", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { id: "rude", label: "Rude", color: "bg-red-100 text-red-700 border-red-200" },
  { id: "nice", label: "Nice", color: "bg-green-100 text-green-700 border-green-200" },
  { id: "sassy", label: "Sassy", color: "bg-pink-100 text-pink-700 border-pink-200" },
  { id: "technical", label: "Technical", color: "bg-slate-100 text-slate-700 border-slate-200" },
];

const callTypes = [
  { id: "cold", label: "Cold Call", description: "Initial outreach to a new prospect" },
  { id: "warm", label: "Warm Call", description: "Follow-up with an existing lead" },
  { id: "discovery", label: "Discovery Call", description: "Deep dive into prospect needs" },
];

const NewRoleplay = () => {
  const navigate = useNavigate();
  const [buyerName, setBuyerName] = useState("");
  const [buyerRole, setBuyerRole] = useState("");
  const [buyerCompany, setBuyerCompany] = useState("");
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [callType, setCallType] = useState("cold");
  const [instructions, setInstructions] = useState("");
  const [objections, setObjections] = useState<string[]>([
    "We already use a competitor's product.",
    "I don't have budget for this right now.",
    "I need to talk to my team first."
  ]);
  const [newObjection, setNewObjection] = useState("");

  const toggleTrait = (traitId: string) => {
    setSelectedTraits((prev) =>
      prev.includes(traitId)
        ? prev.filter((t) => t !== traitId)
        : [...prev, traitId]
    );
  };

  const addObjection = () => {
    if (newObjection.trim()) {
      setObjections([...objections, newObjection.trim()]);
      setNewObjection("");
    }
  };

  const removeObjection = (index: number) => {
    setObjections(objections.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    navigate("/roleplays/new-id/start");
  };

  const generateWithAI = () => {
    // Simulate AI generation
    setBuyerName("Sarah Chen");
    setBuyerRole("VP of Engineering");
    setBuyerCompany("TechCorp");
    setSelectedTraits(["skeptical", "technical", "data-driven"]);
    setInstructions("You are a skeptical VP who has seen many sales pitches. You care about technical details and ROI. Be dismissive initially but open up if the caller demonstrates deep product knowledge.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/roleplays")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-display font-bold">Create AI Buyer</h1>
            <p className="text-muted-foreground mt-1">
              Configure your custom AI buyer persona
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={generateWithAI} className="gap-2">
          <Wand2 className="w-4 h-4" />
          Generate with AI
        </Button>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buyerName">Full Name</Label>
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
              <div className="space-y-2">
                <Label htmlFor="buyerCompany">Company</Label>
                <Input
                  id="buyerCompany"
                  placeholder="e.g., Agile Solutions"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Call Type */}
        <Card>
          <CardHeader>
            <CardTitle>Call Type</CardTitle>
            <CardDescription>
              What kind of call are you practicing?
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {callTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setCallType(type.id)}
                  className={cn(
                    "p-4 rounded-xl border-2 text-left transition-all",
                    callType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <p className="font-medium">{type.label}</p>
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
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
                  className={cn(
                    "px-4 py-2 rounded-full text-sm font-medium border transition-all",
                    selectedTraits.includes(trait.id)
                      ? trait.color
                      : "bg-muted text-muted-foreground border-border hover:border-primary/30"
                  )}
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
            <CardTitle>AI Behavior Instructions</CardTitle>
            <CardDescription>
              Tell the AI exactly how to behave during the call. Be specific about tone, responses, and triggers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Be dismissive initially. Only open up if the caller quantifies a problem you have. If they pitch features, interrupt them. Ask about ROI and integration costs."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={5}
              className="resize-none"
            />
          </CardContent>
        </Card>

        {/* Required Objections */}
        <Card>
          <CardHeader>
            <CardTitle>Required Objections</CardTitle>
            <CardDescription>
              These objections will be raised during the call to test skills
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              {objections.map((objection, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg group"
                >
                  <span className="text-sm flex-1">{objection}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="opacity-0 group-hover:opacity-100 h-8 w-8"
                    onClick={() => removeObjection(index)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Add a new objection..."
                value={newObjection}
                onChange={(e) => setNewObjection(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addObjection()}
              />
              <Button onClick={addObjection} variant="secondary">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={() => navigate("/roleplays")}>
            Cancel
          </Button>
          <div className="flex gap-3">
            <Button variant="secondary" className="gap-2">
              <Save className="w-4 h-4" />
              Save as Draft
            </Button>
            <Button onClick={handleCreate} className="gap-2">
              Create & Start Practice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoleplay;

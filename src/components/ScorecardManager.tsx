import { useState } from "react";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  FileText, 
  CheckCircle2, 
  Target,
  Phone,
  Presentation,
  ChevronDown,
  ChevronUp,
  Save,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface ScorecardCriteria {
  id: string;
  name: string;
  weight: number;
}

interface Scorecard {
  id: string;
  name: string;
  type: "discovery" | "demo" | "closing" | "cold" | "custom";
  criteria: ScorecardCriteria[];
  isDefault: boolean;
}

const defaultScorecards: Scorecard[] = [
  {
    id: "1",
    name: "Discovery Call",
    type: "discovery",
    isDefault: true,
    criteria: [
      { id: "1", name: "Identified pain points", weight: 30 },
      { id: "2", name: "Asked open-ended questions", weight: 25 },
      { id: "3", name: "Established rapport", weight: 20 },
      { id: "4", name: "Qualified budget/timeline", weight: 25 },
    ]
  },
  {
    id: "2",
    name: "Demo Call",
    type: "demo",
    isDefault: true,
    criteria: [
      { id: "1", name: "Tied features to pain points", weight: 35 },
      { id: "2", name: "Handled objections effectively", weight: 25 },
      { id: "3", name: "Demonstrated ROI", weight: 20 },
      { id: "4", name: "Clear next steps", weight: 20 },
    ]
  },
  {
    id: "3",
    name: "Closing Call",
    type: "closing",
    isDefault: true,
    criteria: [
      { id: "1", name: "Addressed final objections", weight: 30 },
      { id: "2", name: "Created urgency", weight: 20 },
      { id: "3", name: "Summarized value proposition", weight: 25 },
      { id: "4", name: "Secured commitment", weight: 25 },
    ]
  },
];

const ScorecardManager = () => {
  const [scorecards, setScorecards] = useState<Scorecard[]>(defaultScorecards);
  const [isCreating, setIsCreating] = useState(false);
  const [editingCard, setEditingCard] = useState<Scorecard | null>(null);
  const [newCardName, setNewCardName] = useState("");
  const [newCriteria, setNewCriteria] = useState<ScorecardCriteria[]>([
    { id: "1", name: "", weight: 25 },
    { id: "2", name: "", weight: 25 },
    { id: "3", name: "", weight: 25 },
    { id: "4", name: "", weight: 25 },
  ]);

  const getTypeIcon = (type: Scorecard["type"]) => {
    switch (type) {
      case "discovery": return Target;
      case "demo": return Presentation;
      case "closing": return CheckCircle2;
      case "cold": return Phone;
      default: return FileText;
    }
  };

  const getTotalWeight = (criteria: ScorecardCriteria[]) => 
    criteria.reduce((sum, c) => sum + c.weight, 0);

  const handleAddCriteria = () => {
    if (newCriteria.length >= 6) {
      toast.error("Maximum 6 criteria allowed");
      return;
    }
    setNewCriteria([...newCriteria, { id: Date.now().toString(), name: "", weight: 0 }]);
  };

  const handleRemoveCriteria = (id: string) => {
    if (newCriteria.length <= 2) {
      toast.error("Minimum 2 criteria required");
      return;
    }
    setNewCriteria(newCriteria.filter(c => c.id !== id));
  };

  const handleCriteriaChange = (id: string, field: "name" | "weight", value: string | number) => {
    setNewCriteria(newCriteria.map(c => 
      c.id === id ? { ...c, [field]: value } : c
    ));
  };

  const handleCreateScorecard = () => {
    if (!newCardName.trim()) {
      toast.error("Please enter a scorecard name");
      return;
    }
    if (newCriteria.some(c => !c.name.trim())) {
      toast.error("Please fill in all criteria names");
      return;
    }
    const total = getTotalWeight(newCriteria);
    if (total !== 100) {
      toast.error(`Weights must equal 100% (currently ${total}%)`);
      return;
    }

    const newScorecard: Scorecard = {
      id: Date.now().toString(),
      name: newCardName,
      type: "custom",
      isDefault: false,
      criteria: newCriteria,
    };

    setScorecards([...scorecards, newScorecard]);
    setIsCreating(false);
    setNewCardName("");
    setNewCriteria([
      { id: "1", name: "", weight: 25 },
      { id: "2", name: "", weight: 25 },
      { id: "3", name: "", weight: 25 },
      { id: "4", name: "", weight: 25 },
    ]);
    toast.success("Scorecard created successfully!");
  };

  const handleDuplicate = (scorecard: Scorecard) => {
    const duplicate: Scorecard = {
      ...scorecard,
      id: Date.now().toString(),
      name: `${scorecard.name} (Copy)`,
      isDefault: false,
    };
    setScorecards([...scorecards, duplicate]);
    toast.success("Scorecard duplicated!");
  };

  const handleDelete = (id: string) => {
    setScorecards(scorecards.filter(s => s.id !== id));
    toast.success("Scorecard deleted");
  };

  const handleStartFromTemplate = (type: "discovery" | "demo" | "closing" | "scratch") => {
    if (type === "scratch") {
      setNewCardName("");
      setNewCriteria([
        { id: "1", name: "", weight: 25 },
        { id: "2", name: "", weight: 25 },
        { id: "3", name: "", weight: 25 },
        { id: "4", name: "", weight: 25 },
      ]);
    } else {
      const template = defaultScorecards.find(s => s.type === type);
      if (template) {
        setNewCardName(`Custom ${template.name}`);
        setNewCriteria(template.criteria.map(c => ({ ...c, id: Date.now().toString() + c.id })));
      }
    }
    setIsCreating(true);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Scorecards
            </CardTitle>
            <CardDescription>Create custom scoring criteria for your calls</CardDescription>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="w-4 h-4" />
                Create Scorecard
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Scorecard</DialogTitle>
                <DialogDescription>Start from a template or create from scratch</DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2"
                  onClick={() => handleStartFromTemplate("discovery")}
                >
                  <Target className="w-6 h-6 text-primary" />
                  <span>Discovery Call</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2"
                  onClick={() => handleStartFromTemplate("demo")}
                >
                  <Presentation className="w-6 h-6 text-primary" />
                  <span>Demo Call</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2"
                  onClick={() => handleStartFromTemplate("closing")}
                >
                  <CheckCircle2 className="w-6 h-6 text-primary" />
                  <span>Closing Call</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-24 flex-col gap-2"
                  onClick={() => handleStartFromTemplate("scratch")}
                >
                  <Plus className="w-6 h-6 text-primary" />
                  <span>From Scratch</span>
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Scorecard Creation Form */}
        {isCreating && (
          <Card className="border-primary/30 bg-primary/5">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">New Scorecard</h4>
                <Button variant="ghost" size="icon" onClick={() => setIsCreating(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-2">
                <Label>Scorecard Name</Label>
                <Input 
                  placeholder="e.g., Enterprise Demo Call"
                  value={newCardName}
                  onChange={(e) => setNewCardName(e.target.value)}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Criteria (must equal 100%)</Label>
                  <Badge variant={getTotalWeight(newCriteria) === 100 ? "default" : "destructive"}>
                    {getTotalWeight(newCriteria)}%
                  </Badge>
                </div>
                
                {newCriteria.map((criteria, index) => (
                  <div key={criteria.id} className="flex items-center gap-3">
                    <Input 
                      placeholder={`Criteria ${index + 1}`}
                      value={criteria.name}
                      onChange={(e) => handleCriteriaChange(criteria.id, "name", e.target.value)}
                      className="flex-1"
                    />
                    <div className="flex items-center gap-2 w-24">
                      <Input 
                        type="number"
                        min={0}
                        max={100}
                        value={criteria.weight}
                        onChange={(e) => handleCriteriaChange(criteria.id, "weight", parseInt(e.target.value) || 0)}
                        className="w-16 text-center"
                      />
                      <span className="text-sm text-muted-foreground">%</span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon"
                      onClick={() => handleRemoveCriteria(criteria.id)}
                      disabled={newCriteria.length <= 2}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}

                <Button variant="outline" size="sm" onClick={handleAddCriteria} className="gap-2">
                  <Plus className="w-4 h-4" />
                  Add Criteria
                </Button>
              </div>

              <div className="flex gap-2 pt-2">
                <Button onClick={handleCreateScorecard} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Scorecard
                </Button>
                <Button variant="outline" onClick={() => setIsCreating(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Existing Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scorecards.map((scorecard) => {
            const Icon = getTypeIcon(scorecard.type);
            return (
              <Card key={scorecard.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{scorecard.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {scorecard.criteria.length} criteria
                          </Badge>
                          {scorecard.isDefault && (
                            <Badge variant="outline" className="text-xs">Default</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    {scorecard.criteria.slice(0, 3).map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground truncate">{c.name}</span>
                        <span className="font-medium text-primary">{c.weight}%</span>
                      </div>
                    ))}
                    {scorecard.criteria.length > 3 && (
                      <p className="text-xs text-muted-foreground">+{scorecard.criteria.length - 3} more</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="flex-1 gap-1" onClick={() => handleDuplicate(scorecard)}>
                      <Copy className="w-3 h-3" />
                      Duplicate
                    </Button>
                    {!scorecard.isDefault && (
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(scorecard.id)}>
                        <Trash2 className="w-4 h-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScorecardManager;

import { useState } from "react";
import { 
  Plus, 
  Trash2, 
  GripVertical, 
  ChevronDown, 
  ChevronUp,
  Save,
  Wand2,
  Info,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ScorecardCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  category: string;
}

const exampleCriteria: ScorecardCriterion[] = [
  { id: "1", name: "Objection Handling", description: "Acknowledges concerns, reframes effectively, provides evidence", weight: 25, category: "Technique" },
  { id: "2", name: "Next Steps", description: "Clear call-to-action, confirms timeline, schedules follow-up", weight: 20, category: "Closing" },
  { id: "3", name: "Discovery Quality", description: "Open-ended questions, uncovers pain points, identifies decision makers", weight: 30, category: "Discovery" },
  { id: "4", name: "Pain → Product Connection", description: "Ties product features directly to prospect's stated challenges", weight: 25, category: "Value" },
];

const categories = ["Discovery", "Technique", "Closing", "Value", "Communication", "Custom"];

interface ScorecardBuilderProps {
  onSave?: (criteria: ScorecardCriterion[]) => void;
  initialCriteria?: ScorecardCriterion[];
}

const ScorecardBuilder = ({ onSave, initialCriteria }: ScorecardBuilderProps) => {
  const [criteria, setCriteria] = useState<ScorecardCriterion[]>(initialCriteria || exampleCriteria);
  const [isAdding, setIsAdding] = useState(false);
  const [newCriterion, setNewCriterion] = useState({
    name: "",
    description: "",
    weight: 15,
    category: "Custom"
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const totalWeight = criteria.reduce((sum, c) => sum + c.weight, 0);
  const isValid = totalWeight === 100;

  const handleAddCriterion = () => {
    if (!newCriterion.name.trim()) {
      toast.error("Please enter a criterion name");
      return;
    }

    const criterion: ScorecardCriterion = {
      id: `criterion-${Date.now()}`,
      ...newCriterion
    };

    setCriteria([...criteria, criterion]);
    setNewCriterion({ name: "", description: "", weight: 15, category: "Custom" });
    setIsAdding(false);
    toast.success("Criterion added!");
  };

  const handleRemove = (id: string) => {
    setCriteria(criteria.filter(c => c.id !== id));
  };

  const handleWeightChange = (id: string, weight: number) => {
    setCriteria(criteria.map(c => 
      c.id === id ? { ...c, weight } : c
    ));
  };

  const handleSave = () => {
    if (!isValid) {
      toast.error("Total weight must equal 100%");
      return;
    }
    onSave?.(criteria);
    toast.success("Scorecard saved!");
  };

  const handleAutoBalance = () => {
    const count = criteria.length;
    const baseWeight = Math.floor(100 / count);
    const remainder = 100 - (baseWeight * count);
    
    const balanced = criteria.map((c, i) => ({
      ...c,
      weight: i === 0 ? baseWeight + remainder : baseWeight
    }));
    
    setCriteria(balanced);
    toast.success("Weights balanced!");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              Custom Scorecard
              <Tooltip>
                <TooltipTrigger>
                  <Info className="w-4 h-4 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  Create a weighted scorecard to evaluate calls. Weights must total 100%.
                </TooltipContent>
              </Tooltip>
            </CardTitle>
            <CardDescription>
              Define criteria to score your calls. Total weight must equal 100%.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={isValid ? "default" : "destructive"} className="gap-1">
              {isValid ? <CheckCircle2 className="w-3 h-3" /> : null}
              {totalWeight}%
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Criteria List */}
        <div className="space-y-3">
          {criteria.map((criterion) => (
            <div
              key={criterion.id}
              className="border border-border rounded-xl overflow-hidden"
            >
              <div 
                className="flex items-center gap-3 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => setExpandedId(expandedId === criterion.id ? null : criterion.id)}
              >
                <GripVertical className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{criterion.name}</span>
                    <Badge variant="secondary" className="text-xs">{criterion.category}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {criterion.description}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-20 text-right">
                    <span className="text-lg font-bold">{criterion.weight}%</span>
                  </div>
                  {expandedId === criterion.id ? (
                    <ChevronUp className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              
              {expandedId === criterion.id && (
                <div className="p-4 pt-0 border-t border-border bg-muted/30 space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label>Weight</Label>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[criterion.weight]}
                        onValueChange={(value) => handleWeightChange(criterion.id, value[0])}
                        min={5}
                        max={50}
                        step={5}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-12">{criterion.weight}%</span>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemove(criterion.id);
                    }}
                    className="gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Add New Criterion */}
        {isAdding ? (
          <Card className="border-dashed">
            <CardContent className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Criterion Name</Label>
                  <Input
                    placeholder="e.g., Budget Qualification"
                    value={newCriterion.name}
                    onChange={(e) => setNewCriterion({ ...newCriterion, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <select
                    value={newCriterion.category}
                    onChange={(e) => setNewCriterion({ ...newCriterion, category: e.target.value })}
                    className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="What does this criterion measure?"
                  value={newCriterion.description}
                  onChange={(e) => setNewCriterion({ ...newCriterion, description: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label>Initial Weight: {newCriterion.weight}%</Label>
                <Slider
                  value={[newCriterion.weight]}
                  onValueChange={(value) => setNewCriterion({ ...newCriterion, weight: value[0] })}
                  min={5}
                  max={50}
                  step={5}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleAddCriterion}>Add Criterion</Button>
                <Button variant="outline" onClick={() => setIsAdding(false)}>Cancel</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button
            variant="outline"
            className="w-full gap-2 border-dashed"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-4 h-4" />
            Add Criterion
          </Button>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <Button variant="outline" onClick={handleAutoBalance} className="gap-2">
            <Wand2 className="w-4 h-4" />
            Auto-Balance Weights
          </Button>
          <Button onClick={handleSave} disabled={!isValid} className="gap-2">
            <Save className="w-4 h-4" />
            Save Scorecard
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScorecardBuilder;

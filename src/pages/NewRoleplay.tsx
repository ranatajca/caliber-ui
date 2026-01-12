import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Sparkles, Save, Plus, X, Wand2, Target, CheckCircle, Library, PenLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";

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

// Pre-built scoring criteria library from sales perspective
const scoringLibrary = {
  opening: {
    category: "Opening & Introduction",
    criteria: [
      { id: "greeting", name: "Professional Greeting", description: "Clear, confident introduction with name and company", weight: 10 },
      { id: "hook", name: "Attention Hook", description: "Compelling opening that captures interest within 10 seconds", weight: 15 },
      { id: "permission", name: "Permission-Based Opening", description: "Asks for time or permission to continue", weight: 10 },
      { id: "purpose", name: "Clear Purpose Statement", description: "Quickly articulates reason for the call", weight: 10 },
    ]
  },
  discovery: {
    category: "Discovery & Qualification",
    criteria: [
      { id: "open-questions", name: "Open-Ended Questions", description: "Uses who, what, why, how questions to uncover needs", weight: 20 },
      { id: "active-listening", name: "Active Listening", description: "Demonstrates understanding through paraphrasing", weight: 15 },
      { id: "pain-points", name: "Pain Point Identification", description: "Successfully uncovers business challenges", weight: 20 },
      { id: "decision-process", name: "Decision Process Understanding", description: "Identifies key stakeholders and timeline", weight: 15 },
      { id: "budget-qualification", name: "Budget Qualification", description: "Tactfully explores budget parameters", weight: 10 },
    ]
  },
  presentation: {
    category: "Presentation & Value",
    criteria: [
      { id: "value-prop", name: "Value Proposition", description: "Clearly articulates unique value and benefits", weight: 20 },
      { id: "storytelling", name: "Storytelling & Examples", description: "Uses relevant case studies or success stories", weight: 15 },
      { id: "personalization", name: "Personalization", description: "Tailors messaging to prospect's specific situation", weight: 15 },
      { id: "roi-focus", name: "ROI Focus", description: "Quantifies potential return on investment", weight: 15 },
    ]
  },
  objectionHandling: {
    category: "Objection Handling",
    criteria: [
      { id: "acknowledge", name: "Acknowledge & Validate", description: "Acknowledges objection without being defensive", weight: 15 },
      { id: "clarify", name: "Clarify & Probe", description: "Asks follow-up questions to understand root concern", weight: 15 },
      { id: "reframe", name: "Reframe Objection", description: "Turns objection into opportunity", weight: 20 },
      { id: "evidence", name: "Provide Evidence", description: "Uses data, testimonials, or case studies", weight: 15 },
    ]
  },
  closing: {
    category: "Closing & Next Steps",
    criteria: [
      { id: "trial-close", name: "Trial Closes", description: "Uses temperature checks throughout the call", weight: 10 },
      { id: "clear-ask", name: "Clear Ask", description: "Makes a specific, confident request for next step", weight: 20 },
      { id: "urgency", name: "Create Urgency", description: "Establishes compelling reason to act now", weight: 15 },
      { id: "follow-up", name: "Schedule Follow-up", description: "Confirms specific date/time for next interaction", weight: 15 },
    ]
  },
  communication: {
    category: "Communication Skills",
    criteria: [
      { id: "talk-ratio", name: "Talk/Listen Ratio", description: "Maintains healthy balance (ideally 40/60)", weight: 15 },
      { id: "pace", name: "Pace & Clarity", description: "Speaks at appropriate speed with clear diction", weight: 10 },
      { id: "filler-words", name: "Minimize Filler Words", description: "Avoids um, uh, like, you know", weight: 10 },
      { id: "enthusiasm", name: "Enthusiasm & Energy", description: "Conveys genuine excitement and confidence", weight: 10 },
      { id: "empathy", name: "Empathy & Rapport", description: "Builds connection and trust with prospect", weight: 15 },
    ]
  },
};

interface ScoringCriterion {
  id: string;
  name: string;
  description: string;
  weight: number;
  isCustom?: boolean;
}

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
  
  // Scoring criteria state
  const [selectedCriteria, setSelectedCriteria] = useState<ScoringCriterion[]>([
    { id: "greeting", name: "Professional Greeting", description: "Clear, confident introduction", weight: 10 },
    { id: "open-questions", name: "Open-Ended Questions", description: "Uses discovery questions", weight: 20 },
    { id: "value-prop", name: "Value Proposition", description: "Articulates unique value", weight: 20 },
    { id: "acknowledge", name: "Acknowledge Objections", description: "Handles objections well", weight: 15 },
    { id: "clear-ask", name: "Clear Ask", description: "Confident close request", weight: 20 },
    { id: "talk-ratio", name: "Talk/Listen Ratio", description: "Good listening balance", weight: 15 },
  ]);
  const [scoringTab, setScoringTab] = useState("library");
  const [expandedCategory, setExpandedCategory] = useState<string | null>("opening");
  const [customCriterionName, setCustomCriterionName] = useState("");
  const [customCriterionDesc, setCustomCriterionDesc] = useState("");
  const [customCriterionWeight, setCustomCriterionWeight] = useState(15);
  const [isGeneratingCriteria, setIsGeneratingCriteria] = useState(false);
  const [aiCriteriaPrompt, setAiCriteriaPrompt] = useState("");

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

  const toggleCriterion = (criterion: ScoringCriterion) => {
    const exists = selectedCriteria.find(c => c.id === criterion.id);
    if (exists) {
      setSelectedCriteria(selectedCriteria.filter(c => c.id !== criterion.id));
    } else {
      setSelectedCriteria([...selectedCriteria, criterion]);
    }
  };

  const updateCriterionWeight = (id: string, weight: number) => {
    setSelectedCriteria(selectedCriteria.map(c => 
      c.id === id ? { ...c, weight } : c
    ));
  };

  const removeCriterion = (id: string) => {
    setSelectedCriteria(selectedCriteria.filter(c => c.id !== id));
  };

  const addCustomCriterion = () => {
    if (!customCriterionName.trim()) {
      toast.error("Please enter a criterion name");
      return;
    }
    const newCriterion: ScoringCriterion = {
      id: `custom-${Date.now()}`,
      name: customCriterionName,
      description: customCriterionDesc || "Custom scoring criterion",
      weight: customCriterionWeight,
      isCustom: true,
    };
    setSelectedCriteria([...selectedCriteria, newCriterion]);
    setCustomCriterionName("");
    setCustomCriterionDesc("");
    setCustomCriterionWeight(15);
    toast.success("Custom criterion added!");
  };

  const generateAICriteria = async () => {
    setIsGeneratingCriteria(true);
    // Simulate AI generation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const aiGeneratedCriteria: ScoringCriterion[] = [
      { id: `ai-${Date.now()}-1`, name: "Agenda Setting", description: "Sets clear agenda at the start of the call", weight: 10, isCustom: true },
      { id: `ai-${Date.now()}-2`, name: "Problem Agitation", description: "Deepens pain by exploring consequences", weight: 15, isCustom: true },
      { id: `ai-${Date.now()}-3`, name: "Competitive Positioning", description: "Differentiates from competitors effectively", weight: 15, isCustom: true },
      { id: `ai-${Date.now()}-4`, name: "Social Proof", description: "Uses relevant customer success stories", weight: 10, isCustom: true },
    ];
    
    setSelectedCriteria([...selectedCriteria, ...aiGeneratedCriteria]);
    setIsGeneratingCriteria(false);
    setAiCriteriaPrompt("");
    toast.success("AI generated 4 new scoring criteria!");
  };

  const getTotalWeight = () => {
    return selectedCriteria.reduce((sum, c) => sum + c.weight, 0);
  };

  const handleCreate = () => {
    if (selectedCriteria.length === 0) {
      toast.error("Please select at least one scoring criterion");
      return;
    }
    navigate("/roleplays/new-id/start");
  };

  const generateWithAI = () => {
    toast.success("Generating AI buyer persona...");
    setBuyerName("Sarah Chen");
    setBuyerRole("VP of Engineering");
    setBuyerCompany("TechCorp");
    setSelectedTraits(["skeptical", "technical", "data-driven"]);
    setInstructions("You are a skeptical VP who has seen many sales pitches. You care about technical details and ROI. Be dismissive initially but open up if the caller demonstrates deep product knowledge.");
  };

  const handleSaveDraft = () => {
    toast.success("Buyer persona saved as draft!");
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-3 md:gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/ai-roleplays")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold">Create AI Buyer</h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Configure your custom AI buyer persona
            </p>
          </div>
        </div>
        <Button variant="outline" onClick={generateWithAI} className="gap-2 w-full sm:w-auto">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
              {callTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setCallType(type.id)}
                  className={cn(
                    "p-3 md:p-4 rounded-xl border-2 text-left transition-all",
                    callType === type.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  )}
                >
                  <p className="font-medium text-sm md:text-base">{type.label}</p>
                  <p className="text-xs md:text-sm text-muted-foreground">{type.description}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Scoring Criteria - NEW SECTION */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  Scoring Criteria
                </CardTitle>
                <CardDescription>
                  Define what the AI should score you on during the call
                </CardDescription>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">{selectedCriteria.length} criteria selected</p>
                <p className={cn(
                  "text-xs",
                  getTotalWeight() === 100 ? "text-success" : getTotalWeight() > 100 ? "text-destructive" : "text-muted-foreground"
                )}>
                  Total weight: {getTotalWeight()}%
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selected Criteria Summary */}
            {selectedCriteria.length > 0 && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="text-sm font-medium">Selected Criteria:</p>
                <div className="space-y-2">
                  {selectedCriteria.map((criterion) => (
                    <div key={criterion.id} className="flex items-center gap-3 bg-card p-2 rounded-lg">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{criterion.name}</p>
                        {criterion.isCustom && (
                          <span className="text-[10px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">Custom</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          min={5}
                          max={50}
                          value={criterion.weight}
                          onChange={(e) => updateCriterionWeight(criterion.id, parseInt(e.target.value) || 10)}
                          className="w-16 h-8 text-xs text-center"
                        />
                        <span className="text-xs text-muted-foreground">%</span>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6"
                          onClick={() => removeCriterion(criterion.id)}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs for adding criteria */}
            <Tabs value={scoringTab} onValueChange={setScoringTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="library" className="gap-1.5 text-xs md:text-sm">
                  <Library className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Library</span>
                </TabsTrigger>
                <TabsTrigger value="ai" className="gap-1.5 text-xs md:text-sm">
                  <Wand2 className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Generate with AI</span>
                </TabsTrigger>
                <TabsTrigger value="manual" className="gap-1.5 text-xs md:text-sm">
                  <PenLine className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Manual</span>
                </TabsTrigger>
              </TabsList>

              {/* Library Tab */}
              <TabsContent value="library" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Choose from our pre-built sales scoring criteria library
                </p>
                <div className="space-y-3">
                  {Object.entries(scoringLibrary).map(([key, category]) => (
                    <div key={key} className="border border-border rounded-lg overflow-hidden">
                      <button
                        onClick={() => setExpandedCategory(expandedCategory === key ? null : key)}
                        className="w-full flex items-center justify-between p-3 bg-muted/30 hover:bg-muted/50 transition-colors"
                      >
                        <span className="font-medium text-sm">{category.category}</span>
                        <span className="text-xs text-muted-foreground">
                          {category.criteria.filter(c => selectedCriteria.find(s => s.id === c.id)).length} / {category.criteria.length} selected
                        </span>
                      </button>
                      {expandedCategory === key && (
                        <div className="p-3 space-y-2 bg-card">
                          {category.criteria.map((criterion) => {
                            const isSelected = selectedCriteria.find(c => c.id === criterion.id);
                            return (
                              <div
                                key={criterion.id}
                                onClick={() => toggleCriterion(criterion)}
                                className={cn(
                                  "flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors",
                                  isSelected ? "bg-primary/10 border border-primary/30" : "hover:bg-muted"
                                )}
                              >
                                <Checkbox checked={!!isSelected} className="mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium">{criterion.name}</p>
                                  <p className="text-xs text-muted-foreground">{criterion.description}</p>
                                </div>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {criterion.weight}%
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              {/* AI Generation Tab */}
              <TabsContent value="ai" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Describe what you want to be scored on and AI will generate criteria
                </p>
                <Textarea
                  placeholder="e.g., I want to focus on consultative selling techniques, handling budget objections, and building urgency without being pushy..."
                  value={aiCriteriaPrompt}
                  onChange={(e) => setAiCriteriaPrompt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <Button 
                  onClick={generateAICriteria} 
                  disabled={isGeneratingCriteria}
                  className="w-full gap-2"
                >
                  {isGeneratingCriteria ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4" />
                      Generate Scoring Criteria
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  AI will analyze your input and suggest relevant scoring criteria
                </p>
              </TabsContent>

              {/* Manual Tab */}
              <TabsContent value="manual" className="space-y-4 mt-4">
                <p className="text-sm text-muted-foreground">
                  Create your own custom scoring criterion
                </p>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Criterion Name *</Label>
                    <Input
                      placeholder="e.g., Maintain Executive Presence"
                      value={customCriterionName}
                      onChange={(e) => setCustomCriterionName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      placeholder="e.g., Speaks with confidence and authority, maintains composure under pressure"
                      value={customCriterionDesc}
                      onChange={(e) => setCustomCriterionDesc(e.target.value)}
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Weight</Label>
                      <span className="text-sm font-medium">{customCriterionWeight}%</span>
                    </div>
                    <Slider
                      value={[customCriterionWeight]}
                      onValueChange={([value]) => setCustomCriterionWeight(value)}
                      min={5}
                      max={50}
                      step={5}
                      className="w-full"
                    />
                  </div>
                  <Button onClick={addCustomCriterion} className="w-full gap-2">
                    <Plus className="w-4 h-4" />
                    Add Custom Criterion
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
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
                    "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium border transition-all",
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
          <Button variant="outline" onClick={() => navigate("/ai-roleplays")} className="w-full sm:w-auto">
            Cancel
          </Button>
          <div className="flex gap-3 w-full sm:w-auto">
            <Button variant="secondary" className="gap-2 flex-1 sm:flex-initial" onClick={handleSaveDraft}>
              <Save className="w-4 h-4" />
              <span className="hidden sm:inline">Save as Draft</span>
              <span className="sm:hidden">Save</span>
            </Button>
            <Button onClick={handleCreate} className="gap-2 flex-1 sm:flex-initial">
              Create & Start Practice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewRoleplay;

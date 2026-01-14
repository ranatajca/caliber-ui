import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Building2, Sparkles, Save, Plus, X, Wand2, Target, CheckCircle, Library, PenLine, Loader2, Upload, FileAudio, Trash2, Shield, Lock, Star, Crown, Info, Volume2, Mic } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

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

interface UploadedCall {
  id: string;
  name: string;
  size: string;
  duration: string;
  uploadedAt: Date;
  status: 'uploading' | 'processing' | 'ready' | 'error';
  progress?: number;
}

type ScoringMode = 'general' | 'advanced';

const NewRoleplay = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Basic form state
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
  
  // Scoring mode state
  const [scoringMode, setScoringMode] = useState<ScoringMode>('general');
  const [uploadedCalls, setUploadedCalls] = useState<UploadedCall[]>([]);
  const [isUploadingCall, setIsUploadingCall] = useState(false);
  
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

  // File upload handlers
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const allowedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/webm', 'video/mp4', 'video/webm'];
    
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|mp4|webm)$/i)) {
      toast.error("Please upload an audio or video file (MP3, WAV, M4A, MP4, WebM)");
      return;
    }
    
    if (file.size > 100 * 1024 * 1024) {
      toast.error("File size must be under 100MB");
      return;
    }
    
    setIsUploadingCall(true);
    
    const newCall: UploadedCall = {
      id: `call-${Date.now()}`,
      name: file.name,
      size: formatFileSize(file.size),
      duration: "Processing...",
      uploadedAt: new Date(),
      status: 'uploading',
      progress: 0,
    };
    
    setUploadedCalls(prev => [...prev, newCall]);
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressInterval);
        
        // Transition to processing
        setUploadedCalls(prev => prev.map(c => 
          c.id === newCall.id 
            ? { ...c, status: 'processing' as const, progress: 100 }
            : c
        ));
        
        // Simulate processing (transcription, analysis)
        setTimeout(() => {
          setUploadedCalls(prev => prev.map(c => 
            c.id === newCall.id 
              ? { ...c, status: 'ready' as const, duration: formatDuration(Math.random() * 3600 + 300) }
              : c
          ));
          setIsUploadingCall(false);
          toast.success("Call uploaded and processed successfully!");
        }, 2000);
      } else {
        setUploadedCalls(prev => prev.map(c => 
          c.id === newCall.id ? { ...c, progress } : c
        ));
      }
    }, 200);
  };

  const removeUploadedCall = (callId: string) => {
    setUploadedCalls(prev => prev.filter(c => c.id !== callId));
    toast.success("Call recording removed");
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
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

        {/* Scoring Mode Selection - NEW */}
        <Card className="border-2 border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              Scoring Mode
            </CardTitle>
            <CardDescription>
              Choose how your performance will be evaluated
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* General Score Option */}
              <button
                onClick={() => setScoringMode('general')}
                className={cn(
                  "relative p-4 md:p-5 rounded-xl border-2 text-left transition-all",
                  scoringMode === 'general'
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    scoringMode === 'general' ? "bg-primary/20" : "bg-muted"
                  )}>
                    <Mic className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">General Sales Score</p>
                      <Badge variant="secondary" className="text-xs">Free</Badge>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      AI roleplay-based assessment. Product-agnostic evaluation of core skills.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Objection Handling</span>
                      <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Tonality</span>
                      <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Persistence</span>
                      <span className="text-[10px] px-2 py-0.5 bg-muted rounded-full">Sincerity</span>
                    </div>
                  </div>
                </div>
                {scoringMode === 'general' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-primary" />
                )}
              </button>

              {/* Advanced Score Option */}
              <button
                onClick={() => setScoringMode('advanced')}
                className={cn(
                  "relative p-4 md:p-5 rounded-xl border-2 text-left transition-all",
                  scoringMode === 'advanced'
                    ? "border-accent bg-accent/5"
                    : "border-border hover:border-accent/30"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "p-2 rounded-lg",
                    scoringMode === 'advanced' ? "bg-accent/20" : "bg-muted"
                  )}>
                    <Crown className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold">Advanced Custom Score</p>
                      <Badge className="text-xs bg-gradient-to-r from-accent to-primary text-white border-0">Pro</Badge>
                    </div>
                    <p className="text-xs md:text-sm text-muted-foreground mt-1">
                      Enhanced scoring using your real call recordings + roleplays.
                    </p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">Real Battlefield Data</span>
                      <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">Custom Benchmarks</span>
                      <span className="text-[10px] px-2 py-0.5 bg-accent/10 text-accent rounded-full">Higher Accuracy</span>
                    </div>
                  </div>
                </div>
                {scoringMode === 'advanced' && (
                  <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-accent" />
                )}
              </button>
            </div>

            {/* Info about scoring modes */}
            <div className={cn(
              "flex items-start gap-3 p-3 rounded-lg text-sm",
              scoringMode === 'general' ? "bg-primary/5" : "bg-accent/5"
            )}>
              <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <div>
                {scoringMode === 'general' ? (
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Perfect for recruiting assessments.</span>{" "}
                    Evaluates sales fundamentals without needing product-specific context. Scales to 1,000+ assessments/day.
                  </p>
                ) : (
                  <p className="text-muted-foreground">
                    <span className="font-medium text-foreground">Best for team development.</span>{" "}
                    Upload your top sales calls to create a personalized scoring model based on your team's winning patterns.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Real Call Uploads - Only shown for Advanced mode */}
        {scoringMode === 'advanced' && (
          <Card className="border-accent/30">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-accent" />
                    Real Call Recordings
                    <Badge className="text-[10px] bg-accent/20 text-accent border-0">Optional</Badge>
                  </CardTitle>
                  <CardDescription>
                    Upload your best sales calls to create a custom scoring baseline
                  </CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-xs text-accent font-medium">+15% accuracy boost</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Privacy Notice */}
              <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg border border-border">
                <Shield className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                <div className="space-y-1">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Lock className="w-3 h-3" />
                    Privacy & Compliance
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Recordings are processed to extract scoring patterns only</li>
                    <li>• Full recordings are <span className="font-medium text-foreground">not stored long-term</span> - deleted after processing</li>
                    <li>• Customer names and sensitive info are automatically stripped</li>
                    <li>• Only derived scoring metrics are retained for your custom model</li>
                  </ul>
                </div>
              </div>

              {/* Upload Zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className={cn(
                  "relative border-2 border-dashed rounded-xl p-6 md:p-8 text-center cursor-pointer transition-all",
                  "hover:border-accent/50 hover:bg-accent/5",
                  isUploadingCall ? "pointer-events-none opacity-50" : ""
                )}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="audio/*,video/*,.mp3,.wav,.m4a,.mp4,.webm"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e.target.files)}
                />
                <div className="flex flex-col items-center gap-3">
                  <div className="p-4 rounded-full bg-accent/10">
                    <FileAudio className="w-8 h-8 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium">Drop your best sales calls here</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      MP3, WAV, M4A, MP4, WebM • Max 100MB per file
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="mt-2 gap-2">
                    <Upload className="w-4 h-4" />
                    Browse Files
                  </Button>
                </div>
              </div>

              {/* Uploaded Calls List */}
              {uploadedCalls.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploaded Calls ({uploadedCalls.length})</p>
                  <div className="space-y-2">
                    {uploadedCalls.map((call) => (
                      <div
                        key={call.id}
                        className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg"
                      >
                        <div className={cn(
                          "p-2 rounded-lg",
                          call.status === 'ready' ? "bg-success/10" :
                          call.status === 'error' ? "bg-destructive/10" :
                          "bg-accent/10"
                        )}>
                          {call.status === 'ready' ? (
                            <CheckCircle className="w-4 h-4 text-success" />
                          ) : call.status === 'error' ? (
                            <X className="w-4 h-4 text-destructive" />
                          ) : (
                            <Volume2 className="w-4 h-4 text-accent" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{call.name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{call.size}</span>
                            <span>•</span>
                            <span>{call.duration}</span>
                            {call.status === 'uploading' && <span>• Uploading...</span>}
                            {call.status === 'processing' && <span>• Processing...</span>}
                          </div>
                          {(call.status === 'uploading' || call.status === 'processing') && call.progress !== undefined && (
                            <Progress value={call.progress} className="h-1 mt-2" />
                          )}
                        </div>
                        {call.status === 'ready' && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-destructive"
                            onClick={() => removeUploadedCall(call.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-xs font-medium mb-2">📈 For best results:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Upload 3-5 of your best closed-won calls</li>
                  <li>• Mix different call types (cold, discovery, closing)</li>
                  <li>• Include calls from your top performers</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        )}

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

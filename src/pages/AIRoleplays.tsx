import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Search, 
  Phone, 
  Target,
  Play,
  Snowflake,
  Flame,
  Clock,
  Star,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  User,
  Users,
  BookOpen,
  TrendingUp,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRole } from "@/contexts/RoleContext";

interface RoleplayScenario {
  id: string;
  name: string;
  buyerName: string;
  buyerRole: string;
  buyerCompany: string;
  callType: "cold" | "warm" | "discovery" | "closing";
  difficulty: "easy" | "medium" | "hard";
  description: string;
  estimatedTime: number; // minutes
  completedCount: number;
  averageScore?: number;
  scoringTemplate: string;
  tags: string[];
  isAssigned?: boolean;
  assignedBy?: string;
  dueDate?: string;
  focusArea?: string;
}

interface ScoringTemplate {
  id: string;
  name: string;
  description: string;
  criteriaCount: number;
  isDefault?: boolean;
  categories: string[];
}

// Pre-created library roleplays
const libraryRoleplays: RoleplayScenario[] = [
  {
    id: "lib-1",
    name: "Cold Call: Enterprise SaaS",
    buyerName: "Marcus Chen",
    buyerRole: "VP of Engineering",
    buyerCompany: "TechCorp",
    callType: "cold",
    difficulty: "hard",
    description: "Practice breaking through to a skeptical technical buyer. Focus on value proposition and handling 'we're happy with our current solution' objections.",
    estimatedTime: 8,
    completedCount: 3,
    averageScore: 72,
    scoringTemplate: "Standard Cold Call",
    tags: ["objection-handling", "technical-buyer", "enterprise"],
  },
  {
    id: "lib-2",
    name: "Discovery: Budget Holder",
    buyerName: "Sarah Williams",
    buyerRole: "CFO",
    buyerCompany: "GrowthCo",
    callType: "discovery",
    difficulty: "medium",
    description: "Deep discovery call with a financially-minded buyer. Practice uncovering pain points and quantifying business impact.",
    estimatedTime: 12,
    completedCount: 5,
    averageScore: 78,
    scoringTemplate: "Discovery Excellence",
    tags: ["discovery", "roi-focus", "c-suite"],
  },
  {
    id: "lib-3",
    name: "Warm Follow-up: Demo Request",
    buyerName: "Alex Rivera",
    buyerRole: "Head of Operations",
    buyerCompany: "ScaleUp Inc",
    callType: "warm",
    difficulty: "easy",
    description: "Follow up on an inbound demo request. Practice setting expectations and qualifying the opportunity.",
    estimatedTime: 6,
    completedCount: 8,
    averageScore: 85,
    scoringTemplate: "Standard Sales",
    tags: ["follow-up", "inbound", "qualification"],
  },
  {
    id: "lib-4",
    name: "Closing: Final Objection",
    buyerName: "Jennifer Park",
    buyerRole: "Director of IT",
    buyerCompany: "MidMarket LLC",
    callType: "closing",
    difficulty: "hard",
    description: "The prospect is ready but has one final objection about implementation timeline. Practice creating urgency and closing.",
    estimatedTime: 10,
    completedCount: 2,
    averageScore: 68,
    scoringTemplate: "Closing Mastery",
    tags: ["closing", "urgency", "implementation"],
  },
  {
    id: "lib-5",
    name: "Cold Call: Gatekeeper",
    buyerName: "Reception",
    buyerRole: "Executive Assistant",
    buyerCompany: "Fortune 500 Co",
    callType: "cold",
    difficulty: "medium",
    description: "Get past the gatekeeper to reach the decision maker. Practice rapport building and professional persistence.",
    estimatedTime: 5,
    completedCount: 0,
    scoringTemplate: "Standard Cold Call",
    tags: ["gatekeeper", "persistence", "rapport"],
  },
];

// Manager-assigned roleplays (with due dates and specific focus)
const assignedRoleplays: RoleplayScenario[] = [
  {
    id: "assigned-1",
    name: "Price Objection Drill",
    buyerName: "David Thompson",
    buyerRole: "Procurement Manager",
    buyerCompany: "BudgetFirst Corp",
    callType: "discovery",
    difficulty: "hard",
    description: "Your manager assigned this based on recent calls. Focus on reframing value when price comes up.",
    estimatedTime: 10,
    completedCount: 0,
    scoringTemplate: "Objection Handling Focus",
    tags: ["price-objection", "value-reframe"],
    isAssigned: true,
    assignedBy: "Lisa Martinez",
    dueDate: "2024-01-22",
    focusArea: "Price Objection Handling",
  },
  {
    id: "assigned-2",
    name: "Discovery Deep Dive",
    buyerName: "Emily Chen",
    buyerRole: "Head of Product",
    buyerCompany: "InnovateTech",
    callType: "discovery",
    difficulty: "medium",
    description: "Practice asking deeper discovery questions. Your recent calls averaged 3 questions - aim for 7+.",
    estimatedTime: 15,
    completedCount: 1,
    averageScore: 71,
    scoringTemplate: "Discovery Excellence",
    tags: ["discovery", "pain-points", "qualification"],
    isAssigned: true,
    assignedBy: "Lisa Martinez",
    dueDate: "2024-01-25",
    focusArea: "Discovery Questions",
  },
];

// Scoring templates (simplified - no weights shown to reps)
const scoringTemplates: ScoringTemplate[] = [
  {
    id: "standard-sales",
    name: "Standard Sales",
    description: "Balanced evaluation across all core sales competencies",
    criteriaCount: 12,
    isDefault: true,
    categories: ["Opening", "Discovery", "Presentation", "Objection Handling", "Closing"],
  },
  {
    id: "cold-call",
    name: "Standard Cold Call",
    description: "Focused on initial outreach, attention hooks, and breaking through",
    criteriaCount: 8,
    categories: ["Opening", "Hook", "Objection Handling", "Next Steps"],
  },
  {
    id: "discovery",
    name: "Discovery Excellence",
    description: "Deep focus on questioning, active listening, and pain identification",
    criteriaCount: 10,
    categories: ["Open Questions", "Active Listening", "Pain Points", "Qualification"],
  },
  {
    id: "objection-handling",
    name: "Objection Handling Focus",
    description: "Intensive practice on handling and reframing objections",
    criteriaCount: 8,
    categories: ["Acknowledge", "Clarify", "Reframe", "Evidence", "Recovery"],
  },
  {
    id: "closing",
    name: "Closing Mastery",
    description: "Focus on trial closes, urgency creation, and securing commitments",
    criteriaCount: 9,
    categories: ["Trial Closes", "Urgency", "Clear Ask", "Follow-up"],
  },
];

const AIRoleplays = () => {
  const navigate = useNavigate();
  const { isManager } = useRole();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCallType, setSelectedCallType] = useState<string>("all");
  const [showTemplates, setShowTemplates] = useState(false);

  const callTypeFilters = [
    { id: "all", label: "All Types", icon: Target },
    { id: "cold", label: "Cold Call", icon: Snowflake },
    { id: "warm", label: "Warm Call", icon: Flame },
    { id: "discovery", label: "Discovery", icon: Search },
    { id: "closing", label: "Closing", icon: CheckCircle },
  ];

  const filteredLibraryRoleplays = libraryRoleplays.filter((rp) => {
    if (selectedCallType !== "all" && rp.callType !== selectedCallType) return false;
    if (searchQuery && !rp.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "bg-success/10 text-success border-success/20";
      case "medium": return "bg-warning/10 text-warning-foreground border-warning/20";
      case "hard": return "bg-destructive/10 text-destructive border-destructive/20";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCallTypeIcon = (callType: string) => {
    switch (callType) {
      case "cold": return Snowflake;
      case "warm": return Flame;
      case "discovery": return Search;
      case "closing": return CheckCircle;
      default: return Target;
    }
  };

  const getCallTypeBadgeColor = (callType: string) => {
    switch (callType) {
      case "cold": return "bg-blue-100 text-blue-700 border-blue-200";
      case "warm": return "bg-orange-100 text-orange-700 border-orange-200";
      case "discovery": return "bg-purple-100 text-purple-700 border-purple-200";
      case "closing": return "bg-green-100 text-green-700 border-green-200";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const formatDueDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const diffDays = Math.ceil((date.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { text: "Overdue", color: "text-destructive" };
    if (diffDays === 0) return { text: "Due today", color: "text-destructive" };
    if (diffDays === 1) return { text: "Due tomorrow", color: "text-warning-foreground" };
    if (diffDays <= 3) return { text: `Due in ${diffDays} days`, color: "text-warning-foreground" };
    return { text: `Due ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`, color: "text-muted-foreground" };
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold">Practice Arena</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Sharpen your skills with AI-powered roleplays
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowTemplates(!showTemplates)}
            className="gap-2"
          >
            <BookOpen className="w-4 h-4" />
            <span className="hidden sm:inline">Scoring Templates</span>
          </Button>
          {isManager && (
            <Button onClick={() => navigate("/roleplays/new")} className="gap-2">
              <Target className="w-4 h-4" />
              Create Roleplay
            </Button>
          )}
        </div>
      </div>

      {/* Scoring Templates Panel */}
      {showTemplates && (
        <Card className="mb-6 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Scoring Templates
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Each roleplay uses a scoring template to evaluate your performance
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {scoringTemplates.map((template) => (
                <div
                  key={template.id}
                  className={cn(
                    "p-3 rounded-lg border transition-colors",
                    template.isDefault ? "border-primary/30 bg-primary/5" : "border-border hover:border-primary/20"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{template.name}</h4>
                    {template.isDefault && (
                      <Badge variant="secondary" className="text-[10px]">Default</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{template.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.slice(0, 3).map((cat) => (
                      <span key={cat} className="text-[10px] px-1.5 py-0.5 bg-muted rounded">
                        {cat}
                      </span>
                    ))}
                    {template.categories.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 bg-muted rounded">
                        +{template.categories.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Assigned Roleplays - Priority Section */}
      {assignedRoleplays.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-display font-semibold">Assigned by Manager</h2>
            <Badge variant="destructive" className="text-xs">{assignedRoleplays.length} pending</Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {assignedRoleplays.map((roleplay) => {
              const dueInfo = roleplay.dueDate ? formatDueDate(roleplay.dueDate) : null;
              const CallTypeIcon = getCallTypeIcon(roleplay.callType);
              
              return (
                <Card 
                  key={roleplay.id}
                  className="relative overflow-hidden border-l-4 border-l-primary hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group"
                  onClick={() => navigate(`/roleplays/${roleplay.id}/start`)}
                >
                  {/* Focus Area Banner */}
                  {roleplay.focusArea && (
                    <div className="bg-primary/10 px-4 py-2 border-b border-primary/20 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-primary" />
                      <span className="text-xs font-medium text-primary">Focus: {roleplay.focusArea}</span>
                    </div>
                  )}
                  
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <User className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm">{roleplay.name}</h3>
                          <p className="text-xs text-muted-foreground">
                            {roleplay.buyerName} • {roleplay.buyerRole}
                          </p>
                        </div>
                      </div>
                      {dueInfo && (
                        <span className={cn("text-xs font-medium", dueInfo.color)}>
                          {dueInfo.text}
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {roleplay.description}
                    </p>

                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <Badge variant="outline" className={cn("text-xs", getCallTypeBadgeColor(roleplay.callType))}>
                        <CallTypeIcon className="w-3 h-3 mr-1" />
                        {roleplay.callType.charAt(0).toUpperCase() + roleplay.callType.slice(1)}
                      </Badge>
                      <Badge variant="outline" className={cn("text-xs", getDifficultyColor(roleplay.difficulty))}>
                        {roleplay.difficulty.charAt(0).toUpperCase() + roleplay.difficulty.slice(1)}
                      </Badge>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {roleplay.estimatedTime}min
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>Assigned by {roleplay.assignedBy}</span>
                      </div>
                      <Button size="sm" className="gap-1 group-hover:bg-primary/90">
                        <Play className="w-3 h-3" />
                        Start
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 mb-4 sm:mb-0">
          <BookOpen className="w-5 h-5 text-muted-foreground" />
          <h2 className="text-lg font-display font-semibold">Practice Library</h2>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search roleplays..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Call Type Filters */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
        {callTypeFilters.map((filter) => (
          <Button
            key={filter.id}
            variant={selectedCallType === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCallType(filter.id)}
            className="gap-2 whitespace-nowrap"
          >
            <filter.icon className="w-4 h-4" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Library Roleplays Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLibraryRoleplays.map((roleplay, index) => {
          const CallTypeIcon = getCallTypeIcon(roleplay.callType);
          
          return (
            <Card 
              key={roleplay.id}
              className="overflow-hidden hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => navigate(`/roleplays/${roleplay.id}/start`)}
            >
              {/* Header with Avatar */}
              <div className="persona-header relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white shadow-lg flex items-center justify-center text-lg font-bold text-primary border-4 border-white">
                    {roleplay.buyerName.split(" ").map(n => n[0]).join("")}
                  </div>
                </div>
                {/* Difficulty Badge */}
                <Badge 
                  variant="outline" 
                  className={cn("absolute top-2 right-2 text-[10px]", getDifficultyColor(roleplay.difficulty))}
                >
                  {roleplay.difficulty}
                </Badge>
              </div>

              <CardContent className="p-4">
                {/* Name & Role */}
                <div className="text-center mb-3">
                  <h3 className="font-semibold text-sm">{roleplay.name}</h3>
                  <p className="text-xs text-muted-foreground">
                    {roleplay.buyerName} • {roleplay.buyerRole} @ {roleplay.buyerCompany}
                  </p>
                </div>

                {/* Badges */}
                <div className="flex items-center justify-center gap-2 mb-3 flex-wrap">
                  <Badge variant="outline" className={cn("text-xs", getCallTypeBadgeColor(roleplay.callType))}>
                    <CallTypeIcon className="w-3 h-3 mr-1" />
                    {roleplay.callType.charAt(0).toUpperCase() + roleplay.callType.slice(1)}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {roleplay.estimatedTime}min
                  </span>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground text-center mb-3 line-clamp-2">
                  {roleplay.description}
                </p>

                {/* Progress / Score */}
                {roleplay.completedCount > 0 ? (
                  <div className="mb-3 p-2 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Your best score</span>
                      <span className="font-medium">{roleplay.averageScore}/100</span>
                    </div>
                    <Progress value={roleplay.averageScore} className="h-1.5" />
                    <p className="text-[10px] text-muted-foreground mt-1">
                      Completed {roleplay.completedCount}x • Template: {roleplay.scoringTemplate}
                    </p>
                  </div>
                ) : (
                  <div className="mb-3 p-2 bg-primary/5 rounded-lg text-center">
                    <p className="text-xs text-primary font-medium">Not attempted yet</p>
                    <p className="text-[10px] text-muted-foreground">Template: {roleplay.scoringTemplate}</p>
                  </div>
                )}

                {/* Tags */}
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {roleplay.tags.slice(0, 3).map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[10px] px-2 py-0.5 bg-muted rounded-full text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <Button 
                  className="w-full gap-2 group-hover:bg-primary/90" 
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/roleplays/${roleplay.id}/start`);
                  }}
                >
                  <Phone className="w-4 h-4" />
                  {roleplay.completedCount > 0 ? "Practice Again" : "Start Practice"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredLibraryRoleplays.length === 0 && (
        <div className="text-center py-12">
          <Target className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No roleplays found</h3>
          <p className="text-muted-foreground text-sm">
            Try adjusting your search or filters
          </p>
        </div>
      )}

      {/* Quick Stats Footer */}
      <div className="mt-8 p-4 bg-muted/30 rounded-xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{libraryRoleplays.reduce((acc, rp) => acc + rp.completedCount, 0)}</p>
            <p className="text-xs text-muted-foreground">Total Practices</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">78</p>
            <p className="text-xs text-muted-foreground">Avg Score</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{assignedRoleplays.length}</p>
            <p className="text-xs text-muted-foreground">Assigned Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning-foreground">+12%</p>
            <p className="text-xs text-muted-foreground">Score Improvement</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIRoleplays;
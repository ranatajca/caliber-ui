import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Plus, 
  Search, 
  Filter, 
  Phone, 
  MessageSquare, 
  Target,
  MoreHorizontal,
  Play,
  Snowflake,
  Flame,
  Edit,
  Copy,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AIPersona {
  id: string;
  name: string;
  role: string;
  company: string;
  callType: "cold" | "warm" | "discovery";
  personality: "nice" | "rude" | "sassy" | "neutral";
  tags: string[];
  description: string;
  totalCalls: number;
}

const personas: AIPersona[] = [
  {
    id: "1",
    name: "Logan Sullivan",
    role: "Vice President",
    company: "Salesforce",
    callType: "cold",
    personality: "nice",
    tags: ["#super-rude", "#onboarding"],
    description: "Best bot for practicing cold calls. Your goal is to identify high-level goals, address key pain points, and evaluate compatibility effectively.",
    totalCalls: 156,
  },
  {
    id: "2",
    name: "Mason Brooks",
    role: "Finance Director",
    company: "Oracle",
    callType: "cold",
    personality: "rude",
    tags: ["#super-rude", "#onboarding"],
    description: "Best tool for cold calls: solve challenges and align solutions. Practice handling aggressive pushback.",
    totalCalls: 89,
  },
  {
    id: "3",
    name: "Liam Hughes",
    role: "Operations Manager",
    company: "Uber",
    callType: "warm",
    personality: "sassy",
    tags: ["#follow-up", "#closing"],
    description: "Best bot for honing sales pitches. Focus on uncovering client priorities, addressing pain points, and delivering tailored solutions.",
    totalCalls: 124,
  },
  {
    id: "4",
    name: "Ava Ramirez",
    role: "Innovation Lead",
    company: "Airbnb",
    callType: "discovery",
    personality: "nice",
    tags: ["#discovery", "#rapport"],
    description: "Leading bot for outreach: build rapport and tackle objections. Perfect for discovery call practice.",
    totalCalls: 67,
  },
  {
    id: "5",
    name: "Ethan Park",
    role: "CTO",
    company: "Stripe",
    callType: "cold",
    personality: "neutral",
    tags: ["#technical", "#skeptical"],
    description: "Technical decision maker who needs clear ROI. Expects data-driven conversations.",
    totalCalls: 45,
  },
  {
    id: "6",
    name: "Olivia Chen",
    role: "Head of Procurement",
    company: "Meta",
    callType: "warm",
    personality: "nice",
    tags: ["#budget", "#enterprise"],
    description: "Handles vendor relationships. Focuses on compliance, security, and total cost of ownership.",
    totalCalls: 78,
  },
];

const filters = [
  { id: "all", label: "All", count: 762 },
  { id: "cold", label: "Cold Bots", count: 82, icon: Snowflake },
  { id: "warm", label: "Warm Bots", count: 24, icon: Flame },
  { id: "discovery", label: "Discovery Bots", count: 24, icon: Target },
];

const AIRoleplays = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"quick" | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPersonas = personas.filter((persona) => {
    if (activeFilter !== "all" && persona.callType !== activeFilter) return false;
    if (searchQuery && !persona.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold">AI Roleplays</h1>
          <p className="text-muted-foreground mt-1">
            Practice with AI-powered buyer personas
          </p>
        </div>
        <Button onClick={() => navigate("/roleplays/new")} className="gap-2">
          <Plus className="w-4 h-4" />
          Create Custom Bot
        </Button>
      </div>

      {/* View Toggle & Search */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 bg-muted p-1 rounded-full">
          <button
            onClick={() => setViewMode("quick")}
            className={cn("tab-pill", viewMode === "quick" && "active")}
          >
            Quick access
          </button>
          <button
            onClick={() => setViewMode("all")}
            className={cn("tab-pill", viewMode === "all" && "active")}
          >
            All bots
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-6 mb-6 border-b border-border pb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "flex items-center gap-2 text-sm font-medium transition-colors pb-4 -mb-4 border-b-2",
              activeFilter === filter.id
                ? "text-primary border-primary"
                : "text-muted-foreground border-transparent hover:text-foreground"
            )}
          >
            {filter.icon && <filter.icon className="w-4 h-4" />}
            {filter.label} - {filter.count}
          </button>
        ))}
        
        <div className="ml-auto">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => toast.info("Filter options coming soon!")}>
            <Plus className="w-4 h-4" />
            Add filter
          </Button>
        </div>
      </div>

      {/* Personas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredPersonas.map((persona, index) => (
          <PersonaCard 
            key={persona.id} 
            persona={persona} 
            index={index}
            onStart={() => navigate(`/roleplays/${persona.id}/start`)}
          />
        ))}
      </div>
    </div>
  );
};

const PersonaCard = ({ 
  persona, 
  index,
  onStart 
}: { 
  persona: AIPersona; 
  index: number;
  onStart: () => void;
}) => {
  const navigate = useNavigate();
  
  const getPersonalityBadge = () => {
    switch (persona.personality) {
      case "nice": return "badge-nice";
      case "rude": return "badge-rude";
      case "sassy": return "badge-sassy";
      default: return "bg-muted text-muted-foreground border border-border";
    }
  };

  const getCallTypeBadge = () => {
    switch (persona.callType) {
      case "cold": return "badge-cold";
      case "warm": return "badge-warm";
      default: return "bg-purple-100 text-purple-700 border border-purple-200";
    }
  };

  const handleDuplicate = () => {
    toast.success(`Duplicated "${persona.name}" persona`);
  };

  const handleEdit = () => {
    navigate("/roleplays/new");
    toast.info(`Editing "${persona.name}" persona`);
  };

  const handleDelete = () => {
    toast.success(`Deleted "${persona.name}" persona`);
  };

  return (
    <div 
      className="persona-card animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Sky gradient header */}
      <div className="persona-header">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-white shadow-lg flex items-center justify-center text-2xl font-bold text-primary border-4 border-white">
            {persona.name.split(" ").map(n => n[0]).join("")}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-center justify-center gap-1 mb-2">
          <h3 className="font-semibold text-center">{persona.name}</h3>
          <span className="px-1.5 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold rounded">AI</span>
        </div>
        <p className="text-sm text-muted-foreground text-center mb-3">
          {persona.role} @ {persona.company}
        </p>

        {/* Badges */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className={cn("badge-trait", getCallTypeBadge())}>
            {persona.callType === "cold" && <Snowflake className="w-3 h-3 mr-1" />}
            {persona.callType === "warm" && <Flame className="w-3 h-3 mr-1" />}
            {persona.callType === "discovery" && <Target className="w-3 h-3 mr-1" />}
            {persona.callType.charAt(0).toUpperCase() + persona.callType.slice(1)} Call
          </span>
          <span className={cn("badge-trait", getPersonalityBadge())}>
            {persona.personality.charAt(0).toUpperCase() + persona.personality.slice(1)}
          </span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 justify-center mb-3">
          {persona.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs text-muted-foreground cursor-pointer hover:text-primary" onClick={() => toast.info(`Filtering by ${tag}`)}>
              {tag}
            </span>
          ))}
          {persona.tags.length > 2 && (
            <span className="text-xs text-muted-foreground cursor-pointer hover:text-primary" onClick={() => toast.info(`All tags: ${persona.tags.join(", ")}`)}>+{persona.tags.length - 2}</span>
          )}
        </div>

        {/* Description */}
        <p className="text-xs text-muted-foreground text-center mb-4 line-clamp-2">
          {persona.description}
        </p>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            onClick={onStart}
            className="flex-1 gap-2"
            variant="secondary"
          >
            <Phone className="w-4 h-4" />
            Start a call
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Persona
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="w-4 h-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default AIRoleplays;

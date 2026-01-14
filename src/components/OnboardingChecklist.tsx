import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  X, 
  Sparkles,
  BarChart3,
  Users,
  MessageSquare,
  FileText,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  action: string;
  route: string;
  icon: React.ElementType;
  completed: boolean;
}

interface OnboardingChecklistProps {
  onDismiss?: () => void;
}

const OnboardingChecklist = ({ onDismiss }: OnboardingChecklistProps) => {
  const navigate = useNavigate();
  const [items, setItems] = useState<ChecklistItem[]>([
    {
      id: "1",
      title: "Review Metrics Dashboard",
      description: "See team KPIs and compare rep performance at a glance",
      action: "Go to Metrics",
      route: "/metrics",
      icon: BarChart3,
      completed: false,
    },
    {
      id: "2",
      title: "Compare Team Reps",
      description: "Drill into individual reps to see strengths and weaknesses",
      action: "View Team",
      route: "/metrics",
      icon: Users,
      completed: false,
    },
    {
      id: "3",
      title: "Ask AI a Question",
      description: 'Try "What\'s the biggest performance gap?" or "Why did close rate drop?"',
      action: "Open Ask AI",
      route: "/ask-ai",
      icon: MessageSquare,
      completed: false,
    },
    {
      id: "4",
      title: "Create a Scorecard",
      description: "Set up custom scoring criteria for your team's calls",
      action: "Create Scorecard",
      route: "/roleplays/new",
      icon: FileText,
      completed: false,
    },
    {
      id: "5",
      title: "Try an AI Roleplay",
      description: "Practice a cold call with an AI buyer persona",
      action: "Start Roleplay",
      route: "/roleplays",
      icon: Bot,
      completed: false,
    },
  ]);

  const completedCount = items.filter(i => i.completed).length;
  const progress = (completedCount / items.length) * 100;

  const handleItemClick = (item: ChecklistItem) => {
    // Mark as completed when user clicks
    setItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, completed: true } : i
    ));
    navigate(item.route);
  };

  if (completedCount === items.length) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Get Started in 5 Minutes</CardTitle>
              <p className="text-sm text-muted-foreground mt-0.5">
                {completedCount} of {items.length} completed
              </p>
            </div>
          </div>
          {onDismiss && (
            <Button variant="ghost" size="icon" onClick={onDismiss}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Progress value={progress} className="h-1.5 mt-3" />
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => handleItemClick(item)}
            className={cn(
              "w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all",
              item.completed 
                ? "bg-success/5 border border-success/20" 
                : "hover:bg-muted border border-transparent"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
              item.completed ? "bg-success/10" : "bg-muted"
            )}>
              {item.completed ? (
                <CheckCircle2 className="w-5 h-5 text-success" />
              ) : (
                <item.icon className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn(
                "font-medium text-sm",
                item.completed && "line-through text-muted-foreground"
              )}>
                {item.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {item.description}
              </p>
            </div>
            {!item.completed && (
              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                {item.action}
                <ChevronRight className="w-3 h-3" />
              </div>
            )}
          </button>
        ))}
      </CardContent>
    </Card>
  );
};

export default OnboardingChecklist;

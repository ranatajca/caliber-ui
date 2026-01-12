import { Bell, HelpCircle, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  userName?: string;
}

const AppHeader = ({ userName = "User" }: AppHeaderProps) => {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6 fixed top-0 left-60 right-0 z-40">
      {/* Left: Greeting */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-foreground">
          Hi, <span className="font-semibold">{userName}</span>!
        </span>
      </div>

      {/* Center: Help */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>Have questions?</span>
        <a href="mailto:founders@caliber.ai" className="text-primary hover:underline font-medium">
          founders@caliber.ai
        </a>
        <span>or book a personalized demo →</span>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" className="gap-2">
          Book a personalized demo
        </Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-2 pl-3 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-medium">
            {userName.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm font-medium">{userName}</span>
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;

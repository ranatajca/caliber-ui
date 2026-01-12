import { useState } from "react";
import { Bell, Search, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AppHeaderProps {
  userName?: string;
  onMenuClick?: () => void;
}

const AppHeader = ({ userName = "Saad", onMenuClick }: AppHeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-16 bg-card/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 md:px-6 sticky top-0 z-30">
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="w-5 h-5" />
        </Button>

        {/* Search - hidden on mobile, visible on tablet+ */}
        <div className="relative w-48 md:w-64 lg:w-80 hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search roleplays, calls, team..."
            className="pl-10 bg-muted/50 border-0 focus-visible:ring-1"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* AI Status - hidden on mobile */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-accent/10 rounded-full">
          <div className="w-2 h-2 rounded-full bg-accent pulse-dot" />
          <span className="text-xs font-medium text-accent">AI Ready</span>
        </div>

        {/* Mobile search button */}
        <Button variant="ghost" size="icon" className="sm:hidden">
          <Search className="w-5 h-5" />
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </Button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-2 w-72 md:w-80 bg-card rounded-xl border border-border shadow-xl p-4 animate-fade-in">
              <h3 className="font-semibold mb-3">Notifications</h3>
              <div className="space-y-3">
                <NotificationItem
                  title="New AI feedback available"
                  description="Your call with Marcus Chen has been analyzed"
                  time="2m ago"
                  isNew
                />
                <NotificationItem
                  title="Weekly goal achieved!"
                  description="You've completed 10 cold calls this week"
                  time="1h ago"
                />
                <NotificationItem
                  title="Team update"
                  description="Sarah scored 95 on her discovery call"
                  time="3h ago"
                />
              </div>
              <Button variant="ghost" className="w-full mt-3 text-sm">
                View all notifications
              </Button>
            </div>
          )}
        </div>

        {/* Profile */}
        <button className="flex items-center gap-2 md:gap-3 hover:bg-muted rounded-xl px-2 md:px-3 py-2 transition-colors">
          <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-semibold text-sm">
            {userName.charAt(0)}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-sm font-medium">{userName}</p>
            <p className="text-xs text-muted-foreground">Pro Plan</p>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground hidden md:block" />
        </button>
      </div>
    </header>
  );
};

const NotificationItem = ({ 
  title, 
  description, 
  time, 
  isNew 
}: { 
  title: string; 
  description: string; 
  time: string; 
  isNew?: boolean;
}) => (
  <div className={`p-3 rounded-lg ${isNew ? 'bg-accent/5' : 'hover:bg-muted'} cursor-pointer transition-colors`}>
    <div className="flex items-start justify-between gap-2">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>
      {isNew && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-1" />}
    </div>
    <p className="text-xs text-muted-foreground mt-2">{time}</p>
  </div>
);

export default AppHeader;
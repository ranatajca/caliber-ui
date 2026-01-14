import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Phone, 
  Users, 
  BarChart3, 
  Settings,
  Plus,
  Bot,
  Trophy,
  Home,
  ChevronLeft,
  ChevronRight,
  X,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "Metrics", href: "/metrics", icon: BarChart3 },
  { name: "Ask AI", href: "/ask-ai", icon: Bot },
  { name: "AI Roleplays", href: "/roleplays", icon: Bot },
  { name: "Calls", href: "/calls", icon: Phone },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Team", href: "/team", icon: Users },
];

interface AppSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AppSidebar = ({ isOpen, onClose }: AppSidebarProps) => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-sidebar flex flex-col fixed left-0 top-0 transition-all duration-300 z-50",
      // Desktop: always visible
      "hidden lg:flex",
      collapsed ? "lg:w-20" : "lg:w-64",
      // Mobile: slide in/out
      isOpen && "flex w-64 lg:w-64"
    )}>
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-sidebar-accent lg:hidden"
      >
        <X className="w-5 h-5 text-sidebar-foreground" />
      </button>

      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <NavLink to="/home" className="flex items-center gap-3" onClick={onClose}>
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0">
            <img src="/favicon.png" alt="Caliber" className="w-full h-full object-cover" />
          </div>
          {!collapsed && (
            <span className="text-xl font-display font-bold text-sidebar-foreground">Caliber</span>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground hidden lg:block"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Create button */}
      <div className="p-4">
        <NavLink to="/roleplays/new" onClick={onClose}>
          <Button className={cn(
            "w-full gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90",
            collapsed && "lg:px-0"
          )}>
            <Plus className="w-5 h-5" />
            {!collapsed && "New Roleplay"}
          </Button>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    collapsed && "lg:justify-center lg:px-0"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span className={cn(collapsed && "lg:hidden")}>{item.name}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom section */}
      {!collapsed && (
        <div className="p-4">
          <div className="bg-gradient-to-br from-sidebar-primary/20 to-sidebar-primary/5 rounded-xl p-4 border border-sidebar-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-4 h-4 text-sidebar-primary" />
              <span className="text-xs font-semibold text-sidebar-primary">WEEKLY CHALLENGE</span>
            </div>
            <p className="text-sm text-sidebar-foreground mb-3">
              Complete 5 cold calls to earn 50 points
            </p>
            <div className="w-full h-2 bg-sidebar-accent rounded-full overflow-hidden">
              <div className="w-3/5 h-full bg-sidebar-primary rounded-full" />
            </div>
            <p className="text-xs text-sidebar-foreground/60 mt-2">3/5 completed</p>
          </div>
        </div>
      )}

      {/* Settings */}
      <div className="p-3 border-t border-sidebar-border">
        <NavLink
          to="/settings"
          onClick={onClose}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            collapsed && "lg:justify-center lg:px-0"
          )}
        >
          <Settings className="w-5 h-5" />
          <span className={cn(collapsed && "lg:hidden")}>Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AppSidebar;
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  Phone, 
  Users, 
  BarChart3, 
  GraduationCap, 
  Settings,
  Sparkles,
  Plus,
  Bot,
  Trophy,
  Home,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Home", href: "/home", icon: Home },
  { name: "AI Roleplays", href: "/roleplays", icon: Bot },
  { name: "Calls", href: "/calls", icon: Phone },
  { name: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Training", href: "/training", icon: GraduationCap },
  { name: "Team", href: "/team", icon: Users },
];

const AppSidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      "h-screen bg-sidebar flex flex-col fixed left-0 top-0 transition-all duration-300 z-50",
      collapsed ? "w-20" : "w-64"
    )}>
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        <NavLink to="/home" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sidebar-primary flex items-center justify-center">
            <Sparkles className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          {!collapsed && (
            <span className="text-xl font-display font-bold text-sidebar-foreground">Caliber</span>
          )}
        </NavLink>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg hover:bg-sidebar-accent text-sidebar-foreground/60 hover:text-sidebar-foreground"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Create button */}
      <div className="p-4">
        <NavLink to="/roleplays/new">
          <Button className={cn(
            "w-full gap-2 bg-sidebar-primary hover:bg-sidebar-primary/90",
            collapsed && "px-0"
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
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-foreground"
                      : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
                    collapsed && "justify-center px-0"
                  )}
                  title={collapsed ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  {!collapsed && item.name}
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
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all",
            location.pathname === "/settings"
              ? "bg-sidebar-accent text-sidebar-foreground"
              : "text-sidebar-foreground/60 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground",
            collapsed && "justify-center px-0"
          )}
        >
          <Settings className="w-5 h-5" />
          {!collapsed && "Settings"}
        </NavLink>
      </div>
    </aside>
  );
};

export default AppSidebar;

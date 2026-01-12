import { NavLink, useLocation } from "react-router-dom";
import { 
  Phone, 
  Users, 
  BarChart3, 
  ClipboardList, 
  Settings,
  Zap,
  Plus,
  Play
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Simulations", href: "/simulations", icon: Play },
  { name: "Buyers", href: "/buyers", icon: Users },
  { name: "Calls", href: "/calls", icon: Phone },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Assignments", href: "/assignments", icon: ClipboardList },
  { name: "Members", href: "/members", icon: Users },
];

const AppSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-60 h-screen bg-card border-r border-border flex flex-col fixed left-0 top-0">
      {/* Logo */}
      <div className="h-16 flex items-center px-4 border-b border-border">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground">Caliber</span>
        </NavLink>
      </div>

      {/* Create button */}
      <div className="p-4">
        <NavLink to="/simulations/new">
          <Button className="w-full gap-2" size="lg">
            <Plus className="w-4 h-4" />
            Create
          </Button>
        </NavLink>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-secondary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Promo card */}
      <div className="p-4">
        <div className="bg-primary rounded-xl p-4 text-primary-foreground">
          <p className="text-sm font-medium mb-1">
            Invite a friend to win 1 raffle ticket
          </p>
          <p className="text-xs opacity-90">
            for every friend that calls a bot
          </p>
        </div>
      </div>

      {/* Settings */}
      <div className="p-3 border-t border-border">
        <NavLink
          to="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
            location.pathname === "/settings"
              ? "bg-secondary text-secondary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="w-5 h-5" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};

export default AppSidebar;

import { useState, useEffect } from "react";
import { TrendingUp, Zap, Crown, Medal } from "lucide-react";
import { motion } from "framer-motion";

interface TeamMember {
  id: string;
  name: string;
  avatar: string;
  score: number;
  previousScore: number;
  trend: "up" | "down" | "same";
  isCurrentUser?: boolean;
}

interface TeamRaceChartProps {
  members?: TeamMember[];
  currentUserId?: string;
}

const defaultMembers: TeamMember[] = [
  { id: "1", name: "Sarah Chen", avatar: "SC", score: 94, previousScore: 91, trend: "up" },
  { id: "2", name: "You", avatar: "SK", score: 88, previousScore: 83, trend: "up", isCurrentUser: true },
  { id: "3", name: "Marcus J.", avatar: "MJ", score: 86, previousScore: 88, trend: "down" },
  { id: "4", name: "Emily R.", avatar: "ER", score: 84, previousScore: 82, trend: "up" },
  { id: "5", name: "David K.", avatar: "DK", score: 81, previousScore: 81, trend: "same" },
  { id: "6", name: "Lisa T.", avatar: "LT", score: 79, previousScore: 76, trend: "up" },
];

const TeamRaceChart = ({ members = defaultMembers, currentUserId }: TeamRaceChartProps) => {
  const [animatedMembers, setAnimatedMembers] = useState(members);
  const maxScore = 100;

  // Sort members by score
  const sortedMembers = [...animatedMembers].sort((a, b) => b.score - a.score);

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Crown className="w-4 h-4 text-amber-500" />;
      case 1:
        return <Medal className="w-4 h-4 text-slate-400" />;
      case 2:
        return <Medal className="w-4 h-4 text-orange-500" />;
      default:
        return <span className="text-xs font-medium text-muted-foreground w-4 text-center">{index + 1}</span>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "bg-success";
    if (score >= 80) return "bg-primary";
    if (score >= 70) return "bg-warning";
    return "bg-destructive";
  };

  const getTrendIndicator = (trend: "up" | "down" | "same", change: number) => {
    if (trend === "up") {
      return (
        <span className="flex items-center gap-0.5 text-success text-xs font-medium">
          <TrendingUp className="w-3 h-3" />
          +{change}
        </span>
      );
    } else if (trend === "down") {
      return (
        <span className="flex items-center gap-0.5 text-destructive text-xs font-medium">
          <TrendingUp className="w-3 h-3 rotate-180" />
          {change}
        </span>
      );
    }
    return <span className="text-xs text-muted-foreground">—</span>;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-primary" />
          <span className="font-semibold">Live Team Race</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-muted-foreground">Real-time</span>
        </div>
      </div>

      <div className="space-y-2">
        {sortedMembers.map((member, index) => {
          const progress = (member.score / maxScore) * 100;
          const change = member.score - member.previousScore;

          return (
            <motion.div
              key={member.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative flex items-center gap-3 p-2 rounded-xl transition-colors ${
                member.isCurrentUser 
                  ? "bg-primary/10 ring-1 ring-primary/30" 
                  : "hover:bg-muted"
              }`}
            >
              {/* Rank */}
              <div className="w-6 flex justify-center">
                {getRankIcon(index)}
              </div>

              {/* Avatar */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                member.isCurrentUser 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-muted text-muted-foreground"
              }`}>
                {member.avatar}
              </div>

              {/* Name & Progress */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm font-medium truncate ${member.isCurrentUser ? "text-primary" : ""}`}>
                    {member.name}
                    {member.isCurrentUser && (
                      <span className="ml-1 text-xs text-primary">(You)</span>
                    )}
                  </span>
                  <div className="flex items-center gap-2">
                    {getTrendIndicator(member.trend, change)}
                    <span className={`font-bold text-sm ${
                      member.score >= 90 ? "text-success" : 
                      member.score >= 80 ? "text-primary" : 
                      "text-muted-foreground"
                    }`}>
                      {member.score}
                    </span>
                  </div>
                </div>

                {/* Race Bar */}
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className={`absolute inset-y-0 left-0 ${getScoreColor(member.score)} rounded-full`}
                  />
                  {/* Racing dot */}
                  <motion.div
                    initial={{ left: 0 }}
                    animate={{ left: `${progress}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }}
                    className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
                  >
                    <div className={`w-3 h-3 rounded-full ${getScoreColor(member.score)} ring-2 ring-background shadow-lg`} />
                  </motion.div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 pt-4 border-t border-border mt-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-success" />
          90+ Excellent
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-primary" />
          80+ Good
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-warning" />
          70+ Needs Work
        </span>
      </div>
    </div>
  );
};

export default TeamRaceChart;

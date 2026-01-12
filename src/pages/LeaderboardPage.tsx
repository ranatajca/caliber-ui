import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trophy, Medal, Crown, Star, TrendingUp, Phone, Target, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface LeaderboardEntry {
  rank: number;
  name: string;
  avatar: string;
  points: number;
  calls: number;
  avgScore: number;
  streak: number;
}

const leaderboard: LeaderboardEntry[] = [
  { rank: 1, name: "Erika Brown", avatar: "EB", points: 99, calls: 52, avgScore: 91, streak: 12 },
  { rank: 2, name: "Eugene R.", avatar: "ER", points: 87, calls: 48, avgScore: 85, streak: 8 },
  { rank: 3, name: "Anastasia K.", avatar: "AK", points: 82, calls: 45, avgScore: 82, streak: 5 },
  { rank: 4, name: "Michael Chen", avatar: "MC", points: 78, calls: 41, avgScore: 80, streak: 7 },
  { rank: 5, name: "Sarah Kim", avatar: "SK", points: 74, calls: 38, avgScore: 78, streak: 3 },
  { rank: 6, name: "Tom Wilson", avatar: "TW", points: 71, calls: 35, avgScore: 76, streak: 4 },
  { rank: 7, name: "Saad Khan", avatar: "SK", points: 68, calls: 32, avgScore: 75, streak: 5 },
];

const timeFilters = ["This Week", "This Month", "All Time"];

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("This Week");

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  const handleViewProfile = (name: string) => {
    toast.info(`Viewing ${name}'s profile`);
  };

  return (
    <div className="p-4 md:p-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 md:mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-display font-bold">Leaderboard</h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Compete with your team and climb the ranks
          </p>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap",
                activeFilter === filter
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Podium */}
      <div className="flex items-end justify-center gap-2 md:gap-4 mb-8 md:mb-12">
        {/* 2nd Place */}
        <div className="text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="relative mb-3 md:mb-4">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-3 md:border-4 border-white shadow-lg flex items-center justify-center text-lg md:text-2xl font-bold mx-auto">
              {top3[1].avatar}
            </div>
            <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs md:text-sm font-bold">2</span>
            </div>
          </div>
          <p className="font-semibold mb-1 text-xs md:text-base">{top3[1].name}</p>
          <div className="flex items-center justify-center gap-1 mb-2 md:mb-3">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-sm md:text-lg">{top3[1].points}</span>
            <span className="text-[10px] md:text-sm text-muted-foreground hidden sm:inline">POINTS</span>
          </div>
          <div className="w-16 md:w-24 h-20 md:h-28 bg-gradient-to-b from-slate-300 to-slate-400 rounded-t-lg mx-auto" />
        </div>

        {/* 1st Place */}
        <div className="text-center animate-slide-up">
          <Crown className="w-6 h-6 md:w-8 md:h-8 text-amber-400 mx-auto mb-1 md:mb-2" />
          <div className="relative mb-3 md:mb-4">
            <div className="w-18 h-18 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 border-3 md:border-4 border-white shadow-xl flex items-center justify-center text-xl md:text-3xl font-bold mx-auto ring-3 md:ring-4 ring-amber-200" style={{ width: '4.5rem', height: '4.5rem' }}>
              {top3[0].avatar}
            </div>
            <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 w-7 h-7 md:w-10 md:h-10 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
              <span className="text-white text-sm md:text-lg font-bold">1</span>
            </div>
          </div>
          <p className="font-semibold text-sm md:text-lg mb-1">{top3[0].name}</p>
          <div className="flex items-center justify-center gap-1 mb-2 md:mb-3">
            <Star className="w-4 h-4 md:w-5 md:h-5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-lg md:text-2xl">{top3[0].points}</span>
            <span className="text-[10px] md:text-sm text-muted-foreground hidden sm:inline">POINTS</span>
          </div>
          <div className="w-20 md:w-28 h-28 md:h-36 bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-lg mx-auto" />
        </div>

        {/* 3rd Place */}
        <div className="text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="relative mb-3 md:mb-4">
            <div className="w-14 h-14 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 border-3 md:border-4 border-white shadow-lg flex items-center justify-center text-lg md:text-2xl font-bold mx-auto">
              {top3[2].avatar}
            </div>
            <div className="absolute -bottom-1.5 md:-bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
              <span className="text-white text-xs md:text-sm font-bold">3</span>
            </div>
          </div>
          <p className="font-semibold mb-1 text-xs md:text-base">{top3[2].name}</p>
          <div className="flex items-center justify-center gap-1 mb-2 md:mb-3">
            <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-sm md:text-lg">{top3[2].points}</span>
            <span className="text-[10px] md:text-sm text-muted-foreground hidden sm:inline">POINTS</span>
          </div>
          <div className="w-16 md:w-24 h-14 md:h-20 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-lg mx-auto" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.info("Viewing your rank points breakdown")}>
          <CardContent className="p-3 md:p-4 text-center">
            <Trophy className="w-6 h-6 md:w-8 md:h-8 text-amber-500 mx-auto mb-1 md:mb-2" />
            <p className="text-xl md:text-2xl font-bold">47</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Your Rank Points</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/calls")}>
          <CardContent className="p-3 md:p-4 text-center">
            <Phone className="w-6 h-6 md:w-8 md:h-8 text-primary mx-auto mb-1 md:mb-2" />
            <p className="text-xl md:text-2xl font-bold">32</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Calls This Week</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate("/analytics")}>
          <CardContent className="p-3 md:p-4 text-center">
            <Target className="w-6 h-6 md:w-8 md:h-8 text-accent mx-auto mb-1 md:mb-2" />
            <p className="text-xl md:text-2xl font-bold">75</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => toast.success("You're ranked #7 this week!")}>
          <CardContent className="p-3 md:p-4 text-center">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-success mx-auto mb-1 md:mb-2" />
            <p className="text-xl md:text-2xl font-bold">#7</p>
            <p className="text-[10px] md:text-sm text-muted-foreground">Your Rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Full Rankings */}
      <Card>
        <CardHeader className="pb-2 md:pb-4">
          <CardTitle className="text-base md:text-lg">Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rest.map((entry, index) => (
              <div
                key={entry.rank}
                onClick={() => handleViewProfile(entry.name)}
                className={cn(
                  "flex items-center gap-2 md:gap-4 p-3 md:p-4 rounded-xl transition-colors cursor-pointer",
                  entry.name === "Saad Khan" ? "bg-primary/5 border border-primary/20" : "hover:bg-muted"
                )}
                style={{ animationDelay: `${(index + 4) * 50}ms` }}
              >
                <span className="w-6 md:w-8 text-center font-bold text-muted-foreground text-sm md:text-base">
                  {entry.rank}
                </span>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold text-xs md:text-sm">
                  {entry.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm md:text-base truncate">{entry.name}</p>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">
                    {entry.calls} calls • {entry.avgScore} avg
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-1">
                  <span className="text-orange-500">🔥</span>
                  <span className="text-xs md:text-sm font-medium">{entry.streak}d</span>
                </div>
                <div className="flex items-center gap-1 min-w-[50px] md:min-w-[80px] justify-end">
                  <Star className="w-3 h-3 md:w-4 md:h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-sm md:text-base">{entry.points}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LeaderboardPage;
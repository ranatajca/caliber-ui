import { useState } from "react";
import { Trophy, Medal, Crown, Star, TrendingUp, Phone, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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
  const [activeFilter, setActiveFilter] = useState("This Week");

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold">Leaderboard</h1>
          <p className="text-muted-foreground mt-1">
            Compete with your team and climb the ranks
          </p>
        </div>
        <div className="flex items-center gap-2">
          {timeFilters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
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
      <div className="flex items-end justify-center gap-4 mb-12">
        {/* 2nd Place */}
        <div className="text-center animate-slide-up" style={{ animationDelay: "100ms" }}>
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold mx-auto">
              {top3[1].avatar}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center">
              <span className="text-white text-sm font-bold">2</span>
            </div>
          </div>
          <p className="font-semibold mb-1">{top3[1].name}</p>
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-lg">{top3[1].points}</span>
            <span className="text-sm text-muted-foreground">POINTS</span>
          </div>
          <div className="w-24 h-28 bg-gradient-to-b from-slate-300 to-slate-400 rounded-t-lg mx-auto" />
        </div>

        {/* 1st Place */}
        <div className="text-center animate-slide-up">
          <Crown className="w-8 h-8 text-amber-400 mx-auto mb-2" />
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-300 to-amber-400 border-4 border-white shadow-xl flex items-center justify-center text-3xl font-bold mx-auto ring-4 ring-amber-200">
              {top3[0].avatar}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-amber-500 border-2 border-white flex items-center justify-center">
              <span className="text-white text-lg font-bold">1</span>
            </div>
          </div>
          <p className="font-semibold text-lg mb-1">{top3[0].name}</p>
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            <span className="font-bold text-2xl">{top3[0].points}</span>
            <span className="text-sm text-muted-foreground">POINTS</span>
          </div>
          <div className="w-28 h-36 bg-gradient-to-b from-amber-400 to-amber-500 rounded-t-lg mx-auto" />
        </div>

        {/* 3rd Place */}
        <div className="text-center animate-slide-up" style={{ animationDelay: "200ms" }}>
          <div className="relative mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-300 to-orange-400 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold mx-auto">
              {top3[2].avatar}
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-orange-500 border-2 border-white flex items-center justify-center">
              <span className="text-white text-sm font-bold">3</span>
            </div>
          </div>
          <p className="font-semibold mb-1">{top3[2].name}</p>
          <div className="flex items-center justify-center gap-1 mb-3">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-bold text-lg">{top3[2].points}</span>
            <span className="text-sm text-muted-foreground">POINTS</span>
          </div>
          <div className="w-24 h-20 bg-gradient-to-b from-orange-400 to-orange-500 rounded-t-lg mx-auto" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
            <p className="text-2xl font-bold">47</p>
            <p className="text-sm text-muted-foreground">Your Rank Points</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Phone className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-bold">32</p>
            <p className="text-sm text-muted-foreground">Calls This Week</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Target className="w-8 h-8 text-accent mx-auto mb-2" />
            <p className="text-2xl font-bold">75</p>
            <p className="text-sm text-muted-foreground">Avg Score</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-bold">#7</p>
            <p className="text-sm text-muted-foreground">Your Rank</p>
          </CardContent>
        </Card>
      </div>

      {/* Full Rankings */}
      <Card>
        <CardHeader>
          <CardTitle>Full Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {rest.map((entry, index) => (
              <div
                key={entry.rank}
                className={cn(
                  "flex items-center gap-4 p-4 rounded-xl transition-colors",
                  entry.name === "Saad Khan" ? "bg-primary/5 border border-primary/20" : "hover:bg-muted"
                )}
                style={{ animationDelay: `${(index + 4) * 50}ms` }}
              >
                <span className="w-8 text-center font-bold text-muted-foreground">
                  {entry.rank}
                </span>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center font-semibold">
                  {entry.avatar}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{entry.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {entry.calls} calls • {entry.avgScore} avg score
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-orange-500">🔥</span>
                  <span className="text-sm font-medium">{entry.streak} day streak</span>
                </div>
                <div className="flex items-center gap-1 min-w-[80px] justify-end">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="font-bold">{entry.points}</span>
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

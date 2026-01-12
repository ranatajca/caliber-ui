import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Building2, User, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/landing/Navbar";
import ArenaSimulation from "@/components/arena/ArenaSimulation";
import ScoutingReport from "@/components/arena/ScoutingReport";

type Track = "b2b" | "b2c" | null;
type Stage = "select" | "simulation" | "results";

const Arena = () => {
  const [selectedTrack, setSelectedTrack] = useState<Track>(null);
  const [stage, setStage] = useState<Stage>("select");
  const [score, setScore] = useState<number>(0);

  const handleTrackSelect = (track: Track) => {
    setSelectedTrack(track);
  };

  const handleStartSimulation = () => {
    if (selectedTrack) {
      setStage("simulation");
    }
  };

  const handleSimulationComplete = (finalScore: number) => {
    setScore(finalScore);
    setStage("results");
  };

  const handleReset = () => {
    setSelectedTrack(null);
    setStage("select");
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 px-4 pb-12">
        <AnimatePresence mode="wait">
          {stage === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="max-w-4xl mx-auto"
            >
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 mb-6">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-accent">The Filter</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-4">
                  <span className="text-foreground">Enter the </span>
                  <span className="text-gradient-accent">Sales Arena</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Prove your skills through AI simulation. Choose your track and roleplay against 
                  a realistic AI prospect. Score 85+ to get verified.
                </p>
              </div>

              {/* Track Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <TrackCard
                  title="B2B Enterprise"
                  description="Sell to skeptical VPs and C-suite executives. Handle objections about budget, adoption, and status quo."
                  persona="Marcus - VP of Sales at Series C SaaS"
                  icon={<Building2 className="w-8 h-8" />}
                  selected={selectedTrack === "b2b"}
                  onClick={() => handleTrackSelect("b2b")}
                  traits={["Direct & Impatient", "Data-Focused", "Protective of Workflow"]}
                />
                <TrackCard
                  title="B2C High-Ticket"
                  description="Close high-net-worth individuals on premium offers. Build rapport and overcome trust barriers."
                  persona="Sarah - Burnout Corporate Lawyer ($250k/yr)"
                  icon={<User className="w-8 h-8" />}
                  selected={selectedTrack === "b2c"}
                  onClick={() => handleTrackSelect("b2c")}
                  traits={["Emotionally Exhausted", "Financially Literate", "Skeptical of Industry"]}
                />
              </div>

              {/* Start Button */}
              <div className="text-center">
                <Button
                  variant="arena"
                  size="xl"
                  disabled={!selectedTrack}
                  onClick={handleStartSimulation}
                  className="group"
                >
                  Start 15-Minute Simulation
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  You'll face realistic objections. Your handling will be scored in real-time.
                </p>
              </div>
            </motion.div>
          )}

          {stage === "simulation" && selectedTrack && (
            <motion.div
              key="simulation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ArenaSimulation 
                track={selectedTrack} 
                onComplete={handleSimulationComplete}
              />
            </motion.div>
          )}

          {stage === "results" && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <ScoutingReport 
                score={score} 
                track={selectedTrack!}
                onReset={handleReset}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

interface TrackCardProps {
  title: string;
  description: string;
  persona: string;
  icon: React.ReactNode;
  selected: boolean;
  onClick: () => void;
  traits: string[];
}

const TrackCard = ({ title, description, persona, icon, selected, onClick, traits }: TrackCardProps) => (
  <Card
    variant={selected ? "arena" : "elevated"}
    className={`cursor-pointer transition-all duration-300 ${
      selected ? "border-accent ring-2 ring-accent/20" : "hover:border-muted-foreground/30"
    }`}
    onClick={onClick}
  >
    <CardHeader>
      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${
        selected ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"
      }`}>
        {icon}
      </div>
      <CardTitle className="text-2xl">{title}</CardTitle>
      <CardDescription className="text-base">{description}</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="p-3 rounded-lg bg-secondary/50 border border-border">
        <p className="text-xs text-muted-foreground mb-1">AI Prospect</p>
        <p className="text-sm font-medium">{persona}</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {traits.map((trait) => (
          <span
            key={trait}
            className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
          >
            {trait}
          </span>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default Arena;

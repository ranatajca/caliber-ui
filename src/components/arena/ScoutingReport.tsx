import { motion } from "framer-motion";
import { Award, CheckCircle, XCircle, TrendingUp, ArrowRight, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ScoutingReportProps {
  score: number;
  track: "b2b" | "b2c";
  onReset: () => void;
}

const ScoutingReport = ({ score, track, onReset }: ScoutingReportProps) => {
  const isPassing = score >= 85;
  const getGrade = (score: number) => {
    if (score >= 95) return "S";
    if (score >= 90) return "A+";
    if (score >= 85) return "A";
    if (score >= 80) return "B+";
    if (score >= 75) return "B";
    if (score >= 70) return "C+";
    if (score >= 65) return "C";
    return "D";
  };

  const metrics = [
    { name: "Objection Handling", score: Math.min(100, score + Math.floor(Math.random() * 10) - 5), weight: "30%" },
    { name: "Discovery Questions", score: Math.min(100, score + Math.floor(Math.random() * 15) - 7), weight: "25%" },
    { name: "Rapport Building", score: Math.min(100, score + Math.floor(Math.random() * 12) - 6), weight: "20%" },
    { name: "Close Attempts", score: Math.min(100, score + Math.floor(Math.random() * 8) - 4), weight: "15%" },
    { name: "Pacing & Tone", score: Math.min(100, score + Math.floor(Math.random() * 10) - 5), weight: "10%" },
  ];

  const strengths = track === "b2b" 
    ? ["Professional demeanor", "Good use of data points", "Handled budget objection well"]
    : ["Built emotional rapport", "Acknowledged their success", "Created urgency naturally"];

  const improvements = track === "b2b"
    ? ["Ask more discovery questions upfront", "Quantify ROI earlier", "Address adoption concerns proactively"]
    : ["Deeper exploration of pain points", "Stronger testimonial usage", "Handle spousal objection better"];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 ${
          isPassing 
            ? "bg-success/20 border border-success/30" 
            : "bg-accent/20 border border-accent/30"
        }`}>
          {isPassing ? (
            <>
              <Award className="w-5 h-5 text-success" />
              <span className="text-sm font-bold text-success">VERIFIED SELLER</span>
            </>
          ) : (
            <>
              <TrendingUp className="w-5 h-5 text-accent" />
              <span className="text-sm font-bold text-accent">KEEP PRACTICING</span>
            </>
          )}
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          Scouting Report
        </h1>
        <p className="text-lg text-muted-foreground">
          {track === "b2b" ? "B2B Enterprise Track" : "B2C High-Ticket Track"}
        </p>
      </motion.div>

      {/* Main Score */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center mb-12"
      >
        <div className="relative">
          <svg className="w-48 h-48 transform -rotate-90">
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-secondary"
            />
            <circle
              cx="96"
              cy="96"
              r="88"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="553"
              strokeDashoffset={553 - (553 * score) / 100}
              strokeLinecap="round"
              className={isPassing ? "text-success" : "text-accent"}
              style={{
                transition: "stroke-dashoffset 2s ease-out",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-6xl font-black">{score}</span>
            <span className="text-lg font-bold text-muted-foreground">
              Grade: {getGrade(score)}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8"
      >
        {metrics.map((metric, index) => (
          <Card key={metric.name} variant="elevated">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{metric.name}</span>
                <span className="text-xs text-muted-foreground">{metric.weight}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.score}%` }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    className={`h-full rounded-full ${
                      metric.score >= 85 ? "bg-success" : metric.score >= 70 ? "bg-primary" : "bg-accent"
                    }`}
                  />
                </div>
                <span className="font-mono font-bold text-sm w-8">{metric.score}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* Strengths & Improvements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card variant="glow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                Strengths
              </CardTitle>
              <CardDescription>What you did well</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {strengths.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-success mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card variant="arena">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-accent">
                <XCircle className="w-5 h-5" />
                Areas to Improve
              </CardTitle>
              <CardDescription>Focus on these next</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {improvements.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="flex flex-col sm:flex-row gap-4 justify-center"
      >
        {isPassing ? (
          <Button variant="success" size="xl" className="group">
            View Job Opportunities
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
        ) : (
          <Button variant="arena" size="xl" onClick={onReset} className="group">
            Try Again
            <RotateCcw className="w-5 h-5" />
          </Button>
        )}
        <Button variant="outline" size="xl" onClick={onReset}>
          Change Track
        </Button>
      </motion.div>
    </div>
  );
};

export default ScoutingReport;

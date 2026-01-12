import { motion } from "framer-motion";
import { ArrowRight, Zap, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-20">
      {/* Gradient glow background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>
      
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
                          linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-6xl mx-auto text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/30 bg-primary/5 mb-8"
        >
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Autonomous Sales Infrastructure</span>
        </motion.div>

        {/* Main headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6"
        >
          <span className="text-foreground">The </span>
          <span className="text-gradient-primary">Operating System</span>
          <br />
          <span className="text-foreground">for Sales Talent</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12"
        >
          Verify reps through AI simulation. Manage calls in real-time. 
          Replace gut feeling with data-driven hiring and oversight.
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
        >
          <Button 
            variant="hero" 
            size="xl"
            onClick={() => navigate('/arena')}
            className="group"
          >
            Enter Sales Arena
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            variant="heroOutline" 
            size="xl"
            onClick={() => navigate('/client')}
          >
            I'm Hiring Talent
          </Button>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
        >
          <StatCard
            icon={<Shield className="w-6 h-6" />}
            value="100%"
            label="Call Coverage"
            description="Every call audited by AI"
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            value="0.8"
            label="Correlation Score"
            description="AI scores predict real results"
          />
          <StatCard
            icon={<Zap className="w-6 h-6" />}
            value="1,000+"
            label="Screenings/Week"
            description="Scale without bottlenecks"
          />
        </motion.div>
      </div>
    </section>
  );
};

const StatCard = ({ 
  icon, 
  value, 
  label, 
  description 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string; 
  description: string;
}) => (
  <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 backdrop-blur-sm">
    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
      {icon}
    </div>
    <div className="text-3xl md:text-4xl font-black text-foreground mb-1">{value}</div>
    <div className="text-sm font-semibold text-primary mb-1">{label}</div>
    <div className="text-xs text-muted-foreground">{description}</div>
  </div>
);

export default Hero;

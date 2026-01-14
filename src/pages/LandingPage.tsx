import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Phone, 
  Target, 
  TrendingUp, 
  Users, 
  Zap, 
  BarChart3, 
  Bot,
  CheckCircle2,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Bot,
      title: "AI Role Plays",
      description: "Practice with realistic AI buyers that adapt to your selling style"
    },
    {
      icon: BarChart3,
      title: "Real-Time Metrics",
      description: "Track every rep's performance with detailed scoring and analytics"
    },
    {
      icon: Phone,
      title: "Call Analysis",
      description: "Upload real calls or connect Fathom for automatic scoring"
    },
    {
      icon: Users,
      title: "Talent Marketplace",
      description: "Find pre-verified sales talent ranked by actual performance"
    }
  ];

  const stats = [
    { value: "89", label: "Avg Score Improvement", suffix: "%" },
    { value: "500+", label: "Sales Teams", suffix: "" },
    { value: "10K+", label: "Calls Analyzed", suffix: "" },
    { value: "24/7", label: "AI Coaching", suffix: "" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden">
                <img src="/favicon.png" alt="Caliber" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-display font-bold">Caliber</span>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <Button variant="ghost" onClick={() => navigate("/talent")}>
                Talent Pool
              </Button>
              <Button variant="ghost" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button onClick={() => navigate("/auth?signup=true")}>
                Get Started
              </Button>
            </nav>
            <div className="flex md:hidden items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>
                Sign In
              </Button>
              <Button size="sm" onClick={() => navigate("/auth?signup=true")}>
                Start
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6">
            <Zap className="w-3 h-3 mr-1" />
            AI-Powered Sales Coaching
          </Badge>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight">
            Train your sales team with{" "}
            <span className="text-primary">AI-powered</span> coaching
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Practice calls, analyze performance, and improve close rates with intelligent feedback. 
            Real-time scoring for every call, AI roleplays, and a marketplace for top talent.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={() => navigate("/auth?signup=true")} className="gap-2">
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/talent")} className="gap-2">
              <Users className="w-4 h-4" /> Browse Talent Pool
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-y border-border bg-muted/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}{stat.suffix}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Everything you need to build a winning sales team
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              From AI practice sessions to real call analysis, Caliber gives you the tools to improve every aspect of your sales process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <Card key={feature.title} className="hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Talent Pool CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20">
            <CardContent className="p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <Badge variant="secondary" className="mb-4">
                    <Users className="w-3 h-3 mr-1" />
                    Talent Marketplace
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
                    Hire top sales talent with verified performance scores
                  </h2>
                  <p className="text-muted-foreground mb-6">
                    Browse our marketplace of pre-verified sales professionals. Every candidate is ranked by actual call performance, not just resumes.
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button onClick={() => navigate("/talent")} className="gap-2">
                      Browse Talent <ArrowRight className="w-4 h-4" />
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/auth?signup=true&type=individual")}>
                      Join as Sales Rep
                    </Button>
                  </div>
                </div>
                <div className="hidden md:block">
                  <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <Target className="w-24 h-24 text-primary/40" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Get started in 5 minutes
            </h2>
          </div>
          <div className="space-y-6">
            {[
              { step: "1", title: "Sign up & connect your calls", desc: "Link Fathom or upload recordings to analyze your real sales calls" },
              { step: "2", title: "Review your metrics", desc: "See team KPIs, compare reps, and drill into individual performance" },
              { step: "3", title: "Practice with AI", desc: "Use AI roleplays to practice objection handling and discovery calls" },
              { step: "4", title: "Get coaching feedback", desc: "Receive actionable insights and track improvement over time" }
            ].map((item) => (
              <div key={item.step} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Ready to improve your sales team?
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
            Start with a free trial. No credit card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" onClick={() => navigate("/auth?signup=true")} className="gap-2">
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/home")} className="gap-2 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Play className="w-4 h-4" /> View Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg overflow-hidden">
              <img src="/favicon.png" alt="Caliber" className="w-full h-full object-cover" />
            </div>
            <span className="font-display font-bold">Caliber</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <button onClick={() => navigate("/talent")} className="hover:text-foreground transition-colors">
              Talent Pool
            </button>
            <button onClick={() => navigate("/auth")} className="hover:text-foreground transition-colors">
              Sign In
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2026 Caliber. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
